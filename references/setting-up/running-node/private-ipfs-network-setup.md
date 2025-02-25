---
description: Set up private IPFS network
---

# Private IPFS Network Setup

{% hint style="warning" %}
Note that Bacalhau`v1.4.0` supports IPFS `v0.27` and below.&#x20;

Starting from `v.1.5.0` Bacalhau supports latest IPFS versions.

Consider this when selecting versions of Bacalhau and IPFS when setting up your own private network.
{% endhint %}

## Introduction

Support for the embedded [IPFS](https://ipfs.tech/) node was [discontinued](../../help-and-faq/release-notes/release-notes.md#libp2p-ipfs-deprecation-and-migration-to-nats-warning) in `v1.4.0` to streamline communication and reduce overhead. Therefore, now in order to use a private IPFS network, it is necessary to create it yourself and then connect to it with nodes. This manual describes how to:

1. Install and configure IPFS
2. Create Private IPFS network
3. Configure your [Bacalhau network](broken-reference) to use the private IPFS network
4. Pin your data to private IPFS network

## TL;DR

1. Install [Go](https://go.dev/doc/install) on all nodes
2. Install [IPFS](https://dist.ipfs.tech/#kubo)
3. Initialize Private IPFS network
4. Connect all nodes to the same private network
5. Connect Bacalhau network to use private IPFS network

## Download and Install

In this manual [Kubo](https://dist.ipfs.tech/#kubo) (the earliest and most widely used implementation of IPFS) will be used, so first of all, [Go](https://go.dev/doc/install) should be installed.&#x20;

1. See the [Go Downloads](https://go.dev/dl/) page for latest Go version.

```bash
wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
```

2. Remove any previous Go installation by deleting the `/usr/local/go` folder (if it exists), then extract the archive you downloaded into `/usr/local`, creating a fresh Go tree in `/usr/local/go`:

```bash
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
```

3. Add `/usr/local/go/bin` to the `PATH` environment variable. You can do this by adding the following line to your `$HOME/.profile` or `/etc/profile` (for a system-wide installation):

```bash
export PATH=$PATH:/usr/local/go/bin
```

{% hint style="info" %}
Changes made to a profile file may not apply until the next time you log into the system. To apply the changes immediately, just run the shell commands directly or execute them from the profile using a command such as `source $HOME/.profile`.
{% endhint %}

4. Verify that Go is installed correctly by checking its version:

```bash
go version
```

The next step is to download and install Kubo. [Select and download](https://dist.ipfs.tech/#kubo) the appropriate version for your system. It is recommended to use the latest stable version.

<pre class="language-bash"><code class="lang-bash">wget https://dist.ipfs.tech/kubo/v0.30.0/kubo_v0.30.0_linux-amd64.tar.gz
<strong>tar -xvzf kubo_v0.30.0_linux-amd64.tar.gz
</strong>sudo bash kubo/install.sh
</code></pre>

Verify that `IPFS` is installed correctly by checking its version:

```bash
ipfs --version
```

## Configure Bootstrap IPFS Node

A bootstrap node is used by client nodes to connect to the private IPFS network. The bootstrap connects clients to other nodes available on the network.

Execute the `ipfs init` command to initialize an IPFS node:

```bash
ipfs init
```

```bash
# example output

generating ED25519 keypair...done
peer identity: 12D3KooWQqr8BLHDUaZvYG59KnrfYJ1PbbzCq3pzfpQ6QrKP5yz7
initializing IPFS node at /home/username/.ipfs
```

The next step is to generate the swarm key - a cryptographic key that is used to control access to an IPFS network, and export the key into a `swarm.key` file, located in the `~/ipfs` folder.

```bash
echo -e "/key/swarm/psk/1.0.0/\n/base16/\n$(tr -dc 'a-f0-9' < /dev/urandom | head -c64)" > ~/.ipfs/swarm.key
```

```bash
# example swarm.key content:

/key/swarm/psk/1.0.0/
/base16/
k51qzi5uqu5dli3yce3powa8pme8yc2mcwc3gpfwh7hzkzrvp5c6l0um99kiw2
```

Now the default entries of bootstrap nodes should be removed. Execute the command on all nodes:

```bash
ipfs bootstrap rm --all
```

Check that bootstrap config does not contain default values:

```bash
ipfs config show | grep Bootstrap
```

```bash
# expected output:

  "Bootstrap": null,
```

Configure IPFS to listen for incoming connections on specific network addresses and ports, making the IPFS Gateway and API services accessible. Consider changing addresses and ports depending on the specifics of your network.

```bash
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
```

```bash
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
```

Start the IPFS daemon:

```bash
ipfs daemon
```

## Configure Client Nodes

Copy the `swarm.key` file from the bootstrap node to client nodes into the `~/.ipfs/` folder and initialize IPFS:

```bash
ipfs init
```

Apply same config as on bootstrap node and start the daemon:

```bash
ipfs bootstrap rm --all

ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080

ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001

ipfs daemon
```

Done! Now you can check that private IPFS network works properly:

1. List peers on the bootstrap node. It should list all connected nodes:

```bash
ipfs swarm peers
```

```bash
# example output for single connected node

/ip4/10.0.2.15/tcp/4001/p2p/12D3KooWQqr8BLHDUaZvYG59KnrfYJ1PbbzCq3pzfpQ6QrKP5yz7
```

2. Pin some files and check their availability across the network:

```bash
# Create a sample text file and pin it
echo “Hello from the private IPFS network!” > sample.txt
```

```bash
# Pin file:
ipfs add sample.txt
```

```bash
# example output:

added QmWQeYip3JuwhDFmkDkx9mXG3p83a3zMFfiMfhjS2Zvnms sample.txt
 25 B / 25 B [=========================================] 100.00%
```

```bash
# Retrieve and display the content of a pinned file
# Execute this on any node of your private network
ipfs cat QmWQeYip3JuwhDFmkDkx9mXG3p83a3zMFfiMfhjS2Zvnms
```

```bash
# expected output:

Hello from the private IPFS network!
```

## Configure the IPFS Daemon as `systemd` Service

Finally, make the IPFS daemon run at system startup. To do this:

1. Create new service unit file in the `/etc/systemd/system/`

```bash
sudo nano /etc/systemd/system/ipfs.service
```

2. Add following content to the file, replacing `/path/to/your/ipfs/executable` with the actual path

```bash
[Unit]
Description=IPFS Daemon
After=network.target

[Service]
User=username
ExecStart=/path/to/your/ipfs/executable daemon
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

{% hint style="info" %}
Use `which ipfs` command to locate the executable.

Usually path to the executable is `/usr/local/bin/ipfs`
{% endhint %}

{% hint style="info" %}
For security purposes, consider creating a separate user to run the service. In this case, specify its name in the `User=` line. Without specifying user, the ipfs service will be launched with `root`, which means that you will need to copy the ipfs binary to the `/root` directory
{% endhint %}

3. Reload and enable the service

```bash
sudo systemctl daemon-reload
sudo systemctl enable ipfs
```

4. Done! Now reboot the machine to ensure that daemon starts correctly. Use `systemctl status ipfs` command to check that service is running:

```bash
sudo systemctl status ipfs

#example output

● ipfs.service - IPFS Daemon
     Loaded: loaded (/etc/systemd/system/ipfs.service; enabled; preset: enabled)
     Active: active (running) since Wed 2024-09-10 13:24:09 CEST; 16min ago
```

## Configure Bacalhau Nodes

Now to connect your private Bacalhau network to the private IPFS network, the IPFS API address should be specified using the `--ipfs-connect` flag. It can be found in the `~/.ipfs/api` file:

```bash
bacalhau serve \
# any other flags
--ipfs-connect /ip4/0.0.0.0/tcp/5001
```

Done! Now your private Bacalhau network is connected to the private IPFS network!

## Test Configured Networks

To verify that everything works correctly:

1. Pin the file to the private IPFS network
2. Run the job, which takes the pinned file as input and publishes result to the private IPFS network
3. View and download job results

### Create and Pin Sample File

Create any file and pin it. Use the `ipfs add` command:

```bash
# create file
echo "Hello from private IPFS network!" > file.txt

# pin the file
ipfs add file.txt
```

```bash
# example output:

added QmWQK2Rz4Ng1RPFPyiHECvQGrJb5ZbSwjpLeuWpDuCZAbQ file.txt
 33 B / 33 B
```

### Run a Bacalhau Job

Run a simple job, which fetches the pinned file via its CID, lists its content and publishes results back into the private IPFS network:

```bash
bacalhau docker run \
-i ipfs://QmWQK2Rz4Ng1RPFPyiHECvQGrJb5ZbSwjpLeuWpDuCZAbQ
--publisher ipfs \
alpine cat inputs
```

```bash
# example output

Job successfully submitted. Job ID: j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa
Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

 TIME          EXEC. ID    TOPIC            EVENT         
 15:54:35.767              Submission       Job submitted 
 15:54:35.780  e-a498daaf  Scheduling       Requested execution on n-0f29f45c 
 15:54:35.859  e-a498daaf  Execution        Running 
 15:54:36.707  e-a498daaf  Execution        Completed successfully 
                                             
To get more details about the run, execute:
	bacalhau job describe j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa

To get more details about the run executions, execute:
	bacalhau job executions j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa

To download the results, execute:
	bacalhau job get j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa
```

### View and Download Job Results

Use [bacalhau job describe](broken-reference) command to view job execution results:

```bash
bacalhau job describe j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa
```

```bash
# example output (was truncated for brevity)

...
Standard Output
Hello from private IPFS network!
```

Use [bacalhau job get](broken-reference)  command to download job results. In this particular case, `ipfs` publisher was used, so the get command will print the `CID` of the job results:

```bash
bacalhau job get j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa
```

```bash
# example output

Fetching results of job 'j-c6514250-2e97-4fb6-a1e6-6a5a8e8ba6aa'...
No supported downloader found for the published results. You will have to download the results differently.
[
    {
        "Type": "ipfs",
        "Params": {
            "CID": "QmSskRNnbbw8rNtkLdcJrUS2uC2mhiKofVJsahKRPgbGGj"
        }
    }
]
```

&#x20;Use the `ipfs ls` command to view the results:

```bash
ipfs ls QmSskRNnbbw8rNtkLdcJrUS2uC2mhiKofVJsahKRPgbGGj
```

```bash
# example output

QmS6mcrMTFsZnT3wAptqEb8NpBPnv1H6WwZBMzEjT8SSDv 1  exitCode
QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH 0  stderr
QmWQK2Rz4Ng1RPFPyiHECvQGrJb5ZbSwjpLeuWpDuCZAbQ 33 stdout
```

Use the `ipfs cat` command to view the file content. In our case, the file of interest is the `stdout`:

```bash
ipfs cat QmWQK2Rz4Ng1RPFPyiHECvQGrJb5ZbSwjpLeuWpDuCZAbQ
```

```bash
# example output

Hello from private IPFS network!
```

Use the `ipfs get` command to download the file using its CID:

```bash
ipfs get --output stdout QmWQK2Rz4Ng1RPFPyiHECvQGrJb5ZbSwjpLeuWpDuCZAbQ
```

<pre class="language-bash"><code class="lang-bash"># example output
<strong>Saving file(s) to stdout
</strong> 33 B / 33 B [===============================================] 100.00% 0s
</code></pre>

## Need Support?[​](http://localhost:3000/setting-up/data-ingestion/from-url#need-support) <a href="#need-support" id="need-support"></a>

For questions and feedback, please reach out in our [Slack](https://bacalhauproject.slack.com/)

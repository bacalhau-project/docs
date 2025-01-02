---
icon: square-down
---

# Installation

## Install the Bacalhau CLI

In this tutorial, you'll learn how to install and run a job with the Bacalhau client using the Bacalhau CLI or Docker.

### Step 1 - Install the Bacalhau Client

The Bacalhau client is a command-line interface (CLI) that allows you to submit jobs to the Bacalhau. The client is available for Linux, macOS, and Windows. You can also run the Bacalhau client in a Docker container.

{% hint style="info" %}
By default, you will submit to the Bacalhau public network, but the same CLI can be configured to submit to a private Bacalhau network. For more information, please read Running [Bacalhau on a Private Network](../setting-up/running-node/).
{% endhint %}

#### Step 1.1 - Install the Bacalhau CLI

{% tabs %}
{% tab title="Linux/macOS (CLI)" %}
You can install or update the Bacalhau CLI by running the commands in a terminal. You may need sudo mode or root password to install the local Bacalhau binary to `/usr/local/bin`:

```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```
{% endtab %}

{% tab title="Windows (CLI)" %}
Windows users can download the [latest release tarball from Github](https://github.com/bacalhau-project/bacalhau/releases) and extract `bacalhau.exe` to any location available in the PATH environment variable.
{% endtab %}

{% tab title="Docker" %}
```bash
docker image rm -f ghcr.io/bacalhau-project/bacalhau:latest # Remove old image if it exists
docker pull ghcr.io/bacalhau-project/bacalhau:latest
```

To run a specific version of Bacalhau using Docker, use the command `docker run -it ghcr.io/bacalhau-project/bacalhau:v1.0.3`, where `v1.0.3` is the version you want to run; note that the `latest` tag will not re-download the image if you have an older version. For more information on running the Docker image, check out the Bacalhau docker image example.
{% endtab %}
{% endtabs %}

#### Step 1.2 - Verify the Installation

To verify installation and check the version of the client and server, use the `version` command. To run a Bacalhau client command with Docker, prefix it with `docker run ghcr.io/bacalhau-project/bacalhau:latest`.

{% tabs %}
{% tab title="Linux/macOS/Windows (CLI)" %}
```bash
bacalhau version
```
{% endtab %}

{% tab title="Docker" %}
```bash
docker run -it ghcr.io/bacalhau-project/bacalhau:latest version
```
{% endtab %}
{% endtabs %}

If you're wondering which server is being used, the Bacalhau Project has a demo network that's shared with the community. This network allows you to familiarize with Bacalhau's capabilities and launch jobs from your computer without maintaining a compute cluster on your own.

### Step 2 - Submit a Hello World job

To submit a job in Bacalhau, we will use the [`bacalhau docker run`](../references/cli-reference/all-flags.md#docker-run) command. The command runs a job using the Docker executor on the node. Let's take a quick look at its syntax:

```shell
bacalhau docker run [flags] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

To run the job, you will need to connect to a public demo network or set up your own [private network](create-private-network.md). In the following example, we will use the public demo network by using the `--configuration` flag.

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau docker run \
--config api.host=bootstrap.production.bacalhau.org \
alpine echo helloWorld
```

We will use the command to submit a Hello World job that runs an [echo](https://en.wikipedia.org/wiki/Echo_\(command\)) program within an [Alpine container](https://hub.docker.com/_/alpine).

Let's take a look at the results of the command execution in the terminal:

```bash
Job successfully submitted. Job ID: j-de72aeff-0f18-4f70-a07c-1366a0edcb64
Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

 TIME          EXEC. ID    TOPIC            EVENT         
 15:32:50.323              Submission       Job submitted 
 15:32:50.332  e-6e4f2db9  Scheduling       Requested execution on n-f1c579e2 
 15:32:50.410  e-6e4f2db9  Execution        Running 
 15:32:50.986  e-6e4f2db9  Execution        Completed successfully 
                                             
To get more details about the run, execute:
	bacalhau job describe j-de72aeff-0f18-4f70-a07c-1366a0edcb64

To get more details about the run executions, execute:
	bacalhau job executions j-de72aeff-0f18-4f70-a07c-1366a0edcb64

```

After the above command is run, the job is submitted to the selected network, which processes the job and Bacalhau prints out the related job id:

```bash
Job successfully submitted. Job ID: j-de72aeff-0f18-4f70-a07c-1366a0edcb64
Checking job status...
```

The `job_id` above is shown in its full form. For convenience, you can use the shortened version, in this case: `j-de72aeff`.

{% hint style="info" %}
While this command is designed to resemble Docker's run command which you may be familiar with, Bacalhau introduces a whole new set of [flags](../references/cli-reference/all-flags.md#docker-run) to support its computing model.
{% endhint %}
{% endtab %}

{% tab title="Docker" %}
```
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
                docker run \
                --id-only \
                --wait \
                ubuntu:latest -- \
                sh -c 'uname -a && echo "Hello from Docker Bacalhau!"'
```

Let's take a look at the results of the command execution in the terminal:

```
14:02:25.992 | INF pkg/repo/fs.go:81 > Initializing repo at '/root/.bacalhau' for environment 'production'
19b105c9-4cb5-43bd-a12f-d715d738addd
```
{% endtab %}
{% endtabs %}

### Step 3 - Checking the State of your Jobs

After having deployed the job, we now can use the CLI for the interaction with the network. The jobs were sent to the public demo network, where it was processed and we can call the following functions. The `job_id` will differ for every submission.

#### Step 3.1 - Job information:

You can find out more information about your job by using [`bacalhau job describe`](../references/cli-reference/cli/job/index-1.md).

```shell
bacalhau job describe j-de72aeff
```

Let's take a look at the results of the command execution in the terminal:

```shell
ID            = j-de72aeff-0f18-4f70-a07c-1366a0edcb64
Name          = j-de72aeff-0f18-4f70-a07c-1366a0edcb64
Namespace     = default
Type          = batch
State         = Completed
Count         = 1
Created Time  = 2024-10-07 13:32:50
Modified Time = 2024-10-07 13:32:50
Version       = 0

Summary
Completed = 1

Job History
 TIME                 TOPIC         EVENT         
 2024-10-07 15:32:50  Submission    Job submitted 
 2024-10-07 15:32:50  State Update  Running       
 2024-10-07 15:32:50  State Update  Completed     

Executions
 ID          NODE ID     STATE      DESIRED  REV.  CREATED    MODIFIED   COMMENT 
 e-6e4f2db9  n-f1c579e2  Completed  Stopped  6     4m18s ago  4m17s ago          

Execution e-6e4f2db9 History
 TIME                 TOPIC       EVENT                             
 2024-10-07 15:32:50  Scheduling  Requested execution on n-f1c579e2 
 2024-10-07 15:32:50  Execution   Running                           
 2024-10-07 15:32:50  Execution   Completed successfully            

Standard Output
helloWorld
```

This outputs all information about the job, including stdout, stderr, where the job was scheduled, and so on.

#### Step 3.2 - Job download:

You can download your job results directly by using [`bacalhau job get`](../references/cli-reference/all-flags.md#get).

```shell
bacalhau job get j-de72aeff
```

Depending on selected [publisher](../references/jobs/job/task/publishers/), this may result in:

```shell
Fetching results of job 'j-de72aeff'...
Results for job 'j-de72aeff' have been written to...
/home/username/.bacalhau/job-j-de72aeff
```

{% hint style="info" %}
While executing this command, you may encounter warnings regarding receive and send buffer sizes: `failed to sufficiently increase receive buffer size`. These warnings can arise due to limitations in the UDP buffer used by Bacalhau to process tasks. Additional information can be found in [https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes](https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes).
{% endhint %}

After the download has finished you should see the following contents in the results directory.

<pre class="language-shell"><code class="lang-shell"><strong>job-j-de72aeff
</strong>├── exitCode
├── outputs
├── stderr
└── stdout
</code></pre>

### Step 4 - Viewing your Job Output

```shell
cat j-de72aeff/stdout
```

That should print out the string `helloWorld`.

```shell
helloWorld
```

With that, you have just successfully run a job on Bacalhau! :fish:

### Step 5 - Where to go next?

Here are few resources that provide a deeper dive into running jobs with Bacalhau:

[How Bacalhau works](architecture.md), [Create your Private Network](create-private-network.md), [Examples & Use Cases](broken-reference)

### Support

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

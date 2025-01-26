---
icon: globe
---

# Creating Your Own Bacalhau Network

## Introduction

While we ([Expanso](https://expanso.io)) offer a public network for testing out Bacalhau workloads, your best bet is to  create your own private network so you can securely run private workloads.

{% hint style="success" %}
If you are familiar with running clusters with other clustered orchestration systems (Kubernetes, Mesosphere, DataBricks/Spark, Cloudera/Hadoop, Nomad, etc), we think you will be pleasantly surprised how easy it is to set up your first Bacalhau cluster!
{% endhint %}

This tutorial describes the process of creating your own private network from multiple nodes, configuring the nodes and running demo jobs.​

## TLDR

1. [Download the CLI](https://www.expanso.io/sign-up/) for setting up a Bacalhau cluster. Hang onto this URL, you'll need it for all the nodes you set up (both orchestrator and compute nodes).
2. Start the [Orchestrator node](./#start-initial-requester-node):&#x20;

<pre class="language-bash"><code class="lang-bash"><strong>bacalhau serve --orchestrator 
</strong></code></pre>

1. Install Bacalhau on each node you want to run your compute on (use the same URL)
2. Run the server on the [Compute node](./#create-and-connect-compute-node)

```bash
bacalhau serve --compue --api-host <ORCHESTRATOR_IP>
```

1. Done! You can run an example, like:

```bash
bacalhau docker run apline echo hello --api-host <ORCHESTRATOR_IP>
```

## Prerequisites

1. Prepare the hosts on which the nodes are going to be set up. They could be:
   1. Physical Hosts
   2. Cloud VMs ([AWS](https://aws.amazon.com/ec2/), [GCP](https://cloud.google.com/products/compute), [Azure](https://azure.microsoft.com/en-us/products/virtual-machines) or any other provider)
   3. Local Hypervisor VMs
   4. An executor (Bash, [Docker Containers](../../setting-up/running-node/quick-start-docker.md), [WASM](https://webassembly.org/), etc)&#x20;
2. [Install Bacalhau](../installation/) on each host
3. Ensure that all nodes are connected to the same network and that the necessary ports are open for communication between them. This will require bidirectional communication on port 4222 between all nodes, and port 1234 to the orchestrator node.

{% hint style="info" %}
Ensure your nodes have an internet connection in case you have to download or upload any data (docker images, input data, results). This is not _required_ but most jobs require some form of network connectivity (even just for downloading containers).
{% endhint %}

1. If you want to run [Docker](https://docker.io) workloads, ensure that [Docker Engine](https://docs.docker.com/engine/install/) is installed.​

## Start Initial Orchestrator Node

The Bacalhau network consists of nodes of two types: compute and orchestrator. Compute Node is responsible for executing jobs and producing results. Orchestrator Node is responsible for handling user requests, forwarding jobs to compute nodes and monitoring the job lifecycle.

The first step is to start up the initial **Orchestrator** node. This node will connect to nothing but will listen for connections.

## Create and Set Up a Token

When you set up a network for the first time, any compute node can join. This can be dangerous - malicious nodes could join your network and "see" jobs being executed, bid on jobs to try to capture them, etc. We don't recommend this!

We recommend adding a Compute Token to the orchestrator. This will mean only nodes that join the network with the token will be allowed to join.&#x20;

{% hint style="warning" %}
While it is not REQUIRED to run with a compute token to join, we highly recommend it!
{% endhint %}

Let's use the `uuidgen` tool to create our token, then add it to the Bacalhau configuration and run the orchestrator node:

```bash
# Create token and write it into the 'my_token' file
$ uuidgen
2EE91AD9-89B5-46CC-86B6-B0E76A3F763F

# On the orchestrator machine, add token to the Bacalhau configuration
bacalhau config set orchestrator.auth.token="2EE91AD9-89B5-46CC-86B6-B0E76A3F763F"
```

Now start (or restart) your orchestrator node like usual.

```bash
#Start the Orchestrator node
bacalhau serve --orchestrator
```

This will produce output similar to this, indicating that the node is up and running:

```bash
17:27:42.273 | INF cmd/cli/serve/serve.go:102 > Config loaded from: [/home/username/.bacalhau/config.yaml], and with data-dir /home/username/.bacalhau
17:27:42.322 | INF cmd/cli/serve/serve.go:228 > Starting bacalhau...
17:27:42.405 | WRN pkg/nats/logger.go:49 > Filestore [KV_node_v1] Stream state too short (0 bytes) [Server:n-0f29f45c-c894-4f8f-8a0a-8f2f1f64d96d]
17:27:42.479 | INF cmd/cli/serve/serve.go:300 > bacalhau node running [address:0.0.0.0:1234] [compute_enabled:false] [name:n-0f29f45c-c894-4f8f-8a0a-8f2f1f64d96d] [orchestrator_address:0.0.0.0:4222] [orchestrator_enabled:true] [webui_enabled:true]
```

Your orchestrator now requires a token to join. Awesome!

## Create and Connect Compute Node

Now let's start a compute node on it and connect to the orchestrator node. You'll use the same token&#x20;

```bash
#Add token to the Bacalhau configuration
bacalhau config set compute.auth.token="2EE91AD9-89B5-46CC-86B6-B0E76A3F763F"
```

Then execute the `serve` command to connect to the orchestrator node:you created earlier, but add it to a different configuration setting.

```bash
bacalhau serve --сompute -c API.Host=<IP-of-Orchestrator> 
```

This will produce output similar to this, indicating that the node is up and running:

<pre class="language-bash"><code class="lang-bash"><strong># formatting has been adjusted for better readability
</strong><strong>16:23:33.386 | INF cmd/cli/serve/serve.go:256 > bacalhau node running 
</strong>[address:0.0.0.0:1235] 
[capacity:"{CPU: 1.40, Memory: 2.9 GB, Disk: 13 GB, GPU: 0}"]
[compute_enabled:true] [engines:["docker","wasm"]]
[name:n-7a510a5b-86de-41db-846f-8c6a24b67482] [orchestrator_enabled:false]
[orchestrators:["127.0.0.1","0.0.0.0"]] [publishers:["local","noop"]]
[storages:["urldownload","inline"]] [webui_enabled:false]
</code></pre>

To ensure that the nodes are connected to the network, run the following command, specifying the public IP of the orchestrator node:

```bash
bacalhau -c API.Host=<IP-of-Orchestrator> node list
```

This will produce output similar to this, indicating that the nodes belong to the same network:

```bash
 ID          TYPE       STATUS    LABELS                                              CPU     MEMORY      DISK         GPU  
 n-7a510a5b  Compute              Architecture=amd64 Operating-System=linux           0.8 /   1.5 GB /    12.3 GB /    0 /      
 n-b2ab8483  Requester  APPROVED  Architecture=amd64 Operating-System=linux           0.8     1.5 GB      12.3 GB      0
```

You have your first network up and running!

## Submitting Jobs

You can submit your jobs using the `bacalhau docker run`, `bacalhau wasm run` and `bacalhau job run` commands. For example submit a hello-world job:

```bash
bacalhau docker run alpine echo hello -c API.Host=<IP-of-Orchestrator> 
```

```bash
Job successfully submitted. Job ID: j-5be2a5b2-567e-4f57-ac9e-8816e47ebeff
Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

 TIME          EXEC. ID    TOPIC            EVENT         
 16:34:16.467              Submission       Job submitted 
 16:34:16.484  e-1e9dca31  Scheduling       Requested execution on n-d41eeae7 
 16:34:16.550  e-1e9dca31  Execution        Running 
 16:34:17.506  e-1e9dca31  Execution        Completed successfully 
                                             
To get more details about the run, execute:
	bacalhau job describe j-5be2a5b2-567e-4f57-ac9e-8816e47ebeff

To get more details about the run executions, execute:
	bacalhau job executions j-5be2a5b2-567e-4f57-ac9e-8816e47ebeff

```

{% hint style="info" %}
If you would like to avoid adding the `API.Host`  you can configure your client's default by  either setting an environment variable:

`export BACALHAU_API_HOST=<IP-address-of-orchestrator>`

Or adding it to your config:

`bacalhau config set API.Host=<IP-address-of-orchestrator>`
{% endhint %}

## Publishers and Sources Configuration

By default only `local` publisher and `URL` & `local` sources are available on the compute node. Out of the box Bacalhau also supports:

{% hint style="info" %}
Though S3 is typically associated with Amazon Web Services, the S3 publisher is compatible with any S3 compatible blob store service. This includes [AWS S3](https://aws.amazon.com/s3/), [GCP storage](https://cloud.google.com/storage/docs/interoperability), [Azure Blob](https://learn.microsoft.com/en-us/azure/architecture/aws-professional/storage), [Oracle Cloud](https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/s3compatibleapi.htm), and many others.&#x20;
{% endhint %}

&#x20;The following describes how to configure the appropriate sources and publishers:

{% tabs %}
{% tab title="S3" %}
To set up [S3 publisher](../../references/jobs/job/task/publishers/s3.md) you need to specify environment variables such as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, populating a credentials file to be located on your compute node, i.e. `~/.aws/credentials`, or creating an [IAM role](https://aws.amazon.com/iam/) for your compute nodes if you are utilizing cloud instances.

Your chosen publisher can be set for your Bacalhau compute nodes declaratively or imperatively using either configuration yaml file:

```yaml
Publisher:
  Type: "s3"
  Params:
    Bucket: "my-task-results"
    Key: "task123/result.tar.gz"
    Endpoint: "https://s3.us-west-2.amazonaws.com"
```

Or within your imperative job execution commands:

```bash
bacalhau docker run -p s3://bucket/key,opt=endpoint=http://s3.example.com,opt=region=us-east-1 ubuntu …
```

S3 compatible publishers can also be used as [input sources](../../references/jobs/job/task/sources/s3.md) for your jobs, with a similar configuration.

```yaml
InputSources:
  - Source:
      Type: "s3"
      Params:
        Bucket: "my-bucket"
        Key: "data/"
        Endpoint: "https://storage.googleapis.com"
  - Target: "/data"
```
{% endtab %}

{% tab title="IPFS" %}
By default, bacalhau does not connect or create its own IPFS network. Consider creating your [own private IPFS](../../setting-up/running-node/private-ipfs-network-setup.md) network and connect to it using the [appropriate flags](../../references/cli-reference/all-flags.md#serve).

[IPFS publisher](../../references/jobs/job/task/publishers/ipfs.md) can be set for your Bacalhau compute nodes declaratively or imperatively using either configuration yaml file:

```bash
Publisher:
  Type: ipfs
```

Or within your imperative job execution commands:

```bash
bacalhau docker run --publisher ipfs ubuntu ...
```

Data pinned to the IPFS network can be used as [input source](../../references/jobs/job/task/sources/ipfs.md). To do this, you will need to specify the CID in declarative:

```bash
InputSources:
  - Source:
      Type: "ipfs"
      Params:
        CID: "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjY3fZ"
  - Target: "/data"
```

Or imperative format:

```bash
bacalhau docker run --input QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjY3fZ:/data ...
```
{% endtab %}

{% tab title="Local" %}
Bacalhau allows to publish job results directly to the compute node. Please note that this method is not a reliable storage option and is recommended to be used mainly for introductory purposes.

[Local publisher](../../references/jobs/job/task/publishers/local.md) can be set for your Bacalhau compute nodes declaratively or imperatively using configuration yaml file:

```bash
Publisher:
  Type: local
```

Or within your imperative job execution commands:

```bash
bacalhau docker run --publisher local ubuntu ...
```

The [Local input source](../../references/jobs/job/task/sources/local.md) allows Bacalhau jobs to access files and directories that are already present on the compute node. To allow jobs to access local files when starting a node, the `Compute.AllowListedLocalPaths` configuration key should be used, specifying the path to the data and access mode `:rw` for Read-Write access or `:ro` for Read-Only (used by default). For example:

```bash
bacalhau config set Compute.AllowListedLocalPaths=/etc/config:rw,/etc/*.conf:ro
```

Further, the path to local data in declarative or imperative form must be specified in the job. Declarative example of the local input source:

```yaml
InputSources:
  - Source:
      Type: "localDirectory"
      Params:
        SourcePath: "/etc/config"
        ReadWrite: true
    Target: "/config"
```

Imperative example of the local input source:

```bash
bacalhau docker run --input file:///etc/config:/config ubuntu ...
```
{% endtab %}
{% endtabs %}

## Best Practices for Production Use Cases

When using a private cluster in production, here are a few considerations to note.

1. Ensure you are running the Bacalhau agents with limited permissions. This enhances security and reduces the risk of unauthorized access to critical system resources.
2. Utilize a service file to manage the Bacalhau process, ensuring the correct user is specified and consistently used. Here’s a [sample service file](https://github.com/bacalhau-project/bacalhau/blob/main/ops/marketplace-tf/modules/instance_files/bacalhau.service)
3. Create an authentication file for your clients. A [dedicated authentication file or policy](../../references/auth_flow.md) can ease the process of maintaining secure data transmission within your network. With this, clients can authenticate themselves, and you can limit the Bacalhau API endpoints unauthorized users have access to.
4. Ensure separation of concerns in your cloud deployments by mounting the Bacalhau repository on a non-boot disk. This prevents instability on shutdown or restarts and improves performance within your host instances.

For many other common questions, we recommend checking out the [Bacalhau FAQ](../../help-and-faq/faqs.md).

That's all folks! 🎉 Please contact us on [Slack](https://bacalhauproject.slack.com/) `#bacalhau` channel for questions and feedback!

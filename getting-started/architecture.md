# How Bacalhau Works

In this tutorial we will go over the components and the architecture of Bacalhau. You will learn how it is built, what components are used, how you could interact and how you could use Bacalhau.

## Chapter 1 - Architecture

Bacalhau is a peer-to-peer network of nodes that enables decentralized communication between computers. The network consists of two types of nodes, which can communicate with each other.

![Bacalhau Architecture](../.gitbook/assets/architecture-overview.webp)

The requester and compute nodes together form a p2p network and use gossiping to discover each other, share information about node capabilities, available resources and health status. Bacalhau is a peer-to-peer network of nodes that enables decentralized communication between computers.

{% hint style="info" %}
**Requester Node:** responsible for handling user requests, discovering and ranking compute nodes, forwarding jobs to compute nodes, and monitoring the job lifecycle.

**Compute Node:** responsible for executing jobs and producing results. Different compute nodes can be used for different types of jobs, depending on their capabilities and resources.
{% endhint %}

To interact with the Bacalhau network, users can use the Bacalhau CLI (command-line interface) to send requests to a requester node in the network. These requests are sent using the JSON format over HTTP, a widely-used protocol for transmitting data over the internet. Bacalhau's architecture involves two main sections which are the **core components** and **interfaces**.

<details>

<summary>Components overview</summary>

<img src="../.gitbook/assets/System-Components-3071e4cf5e37f7a0cdc70ce60b60678c.png" alt="" data-size="original">

</details>

### Core Components

The core components are responsible for handling requests and connecting different nodes. The network includes two different components:

<details>

<summary>Requester node</summary>

In the Bacalhau network, the requester node is responsible for handling requests from clients using `JSON` over `HTTP`. This node serves as the main custodian of jobs that are submitted to it. When a job is submitted to a requester node, it selects compute nodes that are capable and suitable to execute the job, and coordinates the job execution.

</details>

<details>

<summary>Compute node</summary>

In the Bacalhau network, it is the compute node that is responsible for determining whether it can execute a job or not. This model allows for a more decentralized approach to job orchestration as the network will function properly even if the requester nodes have stale view of the network, or if concurrent requesters are allocating jobs to the same compute nodes. Once the compute node has run the job and produced results, it will publish the results to a remote destination as specified in the job specification (e.g. `S3`), and notify the requester of the job completion. The compute node has a collection of named executors, storage sources, and publishers, and it will choose the most appropriate ones based on the job specifications.

</details>

### Interfaces

The interfaces handle the distribution, execution, storage and publishing of jobs. In the following all the different components are described and their respective protocols are shown.

<details>

<summary>Transport</summary>

The transport interface is responsible for sending messages about jobs that are created, accepted, and executed to other compute nodes. It also manages the identity of individual Bacalhau nodes to ensure that messages are only delivered to authorized nodes, which improves network security. To achieve this, the transport interface uses a protocol, which is a point-to-point scheduling protocol that runs securely and is used to distribute job messages efficiently to other nodes on the network. This is our upgrade to previous handlers as it ensures that messages are delivered to the right nodes without causing network congestion, thereby making communication between nodes more scalable and efficient.

</details>

<details>

<summary>Executor</summary>

The executor is a critical component of the Bacalhau network that handles the execution of jobs and ensures that the storage used by the job is local. One of its main responsibilities is to present the input and output storage volumes into the job when it is run. The executor performs two primary functions: presenting the storage volumes in a format that is suitable for the executor and running the job. When the job is completed, the executor will merge the `stdout`, `stderr` and named output volumes into a results folder that is then published to a remote location. Overall, the executor plays a crucial role in the Bacalhau network by ensuring that jobs are executed properly, and their results are published accurately.

</details>

<details>

<summary>Storage Provider</summary>

In a peer-to-peer network like Bacalhau, storage providers play a crucial role in presenting an upstream storage source. There can be different storage providers available in the network, each with its own way of manifesting the `CID (Content IDentifier)` to the executor. For instance, there can be a `POSIX` storage provider that presents the `CID` as a `POSIX` filesystem, or a library storage provider that streams the contents of the `CID` via a library call. Therefore, the storage providers and Executor implementations are loosely coupled, allowing the `POSIX` and library storage providers to be used across multiple executors, wherever it is deemed appropriate.

</details>

<details>

<summary>Publisher</summary>

The publisher is responsible for uploading the final results of a job to a remote location where clients can access them, such as S3 or IPFS.

</details>

## Chapter 2 - Job cycle

### Job preparation

You can create jobs in the Bacalhau network using various [job types](../setting-up/jobs/job-types.md) introduced in version 1.2. Each job may need specific variables, resource requirements and data details that are described in the [Job Specification](../setting-up/jobs/job.md).

<details>

<summary>Advanced job preparation</summary>

Prepare data with Bacalhau by [copying from URLs](../setting-up/data-ingestion/from-url.md), [pinning to public storage](../setting-up/data-ingestion/pin.md) or [copying from an S3 bucket](../setting-up/data-ingestion/s3.md). Mount data anywhere for Bacalhau to run against. Refer to [IPFS](../references/other-specifications/sources/ipfs.md), [Local](../references/other-specifications/publishers/local.md), [S3](../references/other-specifications/publishers/s3.md) and [URL](../references/other-specifications/sources/url.md) Source Specifications for data source usage.

Optimize workflows without completely redesigning them. Run arbitrary tasks using Docker containers and WebAssembly images. Follow the Onboarding guides for [Docker](docker-workload-onboarding.md) and [WebAssembly](wasm-workload-onboarding.md) workloads.

Explore GPU workload support with Bacalhau. Learn how to run [GPU workloads](../setting-up/gpu.md) using the Bacalhau client in the GPU Workloads section. Integrate Python applications with Bacalhau using the [Bacalhau Python SDK](../integrations/python-sdk.md).

For node operation, refer to the [Running a Node](../setting-up/running-node/) section for configuring and running a Bacalhau node. If you prefer an isolated environment, explore the [Private Cluster](broken-reference) for performing tasks without connecting to the main Bacalhau network.

</details>

### Job Submission

You should use the Bacalhau client to send a task to the network. The client transmits the job information to the Bacalhau network via established protocols and interfaces. Jobs submitted via the Bacalhau CLI are forwarded to a Bacalhau network node at [http://bootstrap.production.bacalhau.org/](http://bootstrap.production.bacalhau.org/) via port `1234` by default. This Bacalhau node will act as the requester node for the duration of the job lifecycle.

Bacalhau provides an interface to interact with the server via a REST API. Bacalhau uses 127.0.0.1 as the localhost and 1234 as the port by default.



{% tabs %}
{% tab title="CLI" %}
```sh
bacalhau create [flags]
```

You can use the command with [appropriate flags](../references/cli-reference/all-flags.md) to create a job in Bacalhau using JSON and YAML formats.
{% endtab %}

{% tab title="API" %}
```
Endpoint: `PUT /api/v1/orchestrator/jobs` 
```

You can use [Create Job API Documentation](../references/api/jobs.md) to submit a new job for execution.
{% endtab %}
{% endtabs %}

You can use the `bacalhau docker run` [command](../references/cli-reference/all-flags.md#docker-run) to start a job in a Docker container. Below, you can see an excerpt of the commands:

<details>

<summary>Bacalhau Docker CLI commands</summary>

```
bacalhau docker run [flags] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

```
Flags:
    --concurrency int                  How many nodes should run the job (default 1)
    --cpu string                       Job CPU cores (e.g. 500m, 2, 8).
    --disk string                      Job Disk requirement (e.g. 500Gb, 2Tb, 8Tb).
    --domain stringArray               Domain(s) that the job needs to access (for HTTP networking)
    --download                         Should we download the results once the job is complete?
    --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
    --dry-run                          Do not submit the job, but instead print out what will be submitted
    --entrypoint strings               Override the default ENTRYPOINT of the image
-e, --env strings                      The environment variables to supply to the job (e.g. --env FOO=bar --env BAR=baz)
-f, --follow                           When specified will follow the output from the job as it runs
-g, --gettimeout int                   Timeout for getting the results of a job in --wait (default 10)
    --gpu string                       Job GPU requirement (e.g. 1, 2, 8).
-h, --help                             help for run
    --id-only                          Print out only the Job ID on successful submission.
-i, --input storage                    Mount URIs as inputs to the job. Can be specified multiple times. Format: src=URI,dst=PATH[,opt=key=value]
                                    Examples:
                                    # Mount IPFS CID to /inputs directory
                                    -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72
                                    # Mount S3 object to a specific path
                                    -i s3://bucket/key,dst=/my/input/path
                                    # Mount S3 object with specific endpoint and region
                                    -i src=s3://bucket/key,dst=/my/input/path,opt=endpoint=https://s3.example.com,opt=region=us-east-1
    --ipfs-connect string              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
    --ipfs-serve-path string           path local Ipfs node will persist data to
    --ipfs-swarm-addrs strings         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
    --ipfs-swarm-key string            Optional IPFS swarm key required to connect to a private IPFS swarm
-l, --labels strings                   List of labels for the job. Enter multiple in the format '-l a -l 2'. All characters not matching /a-zA-Z0-9_:|-/ and all emojis will be stripped.
    --memory string                    Job Memory requirement (e.g. 500Mb, 2Gb, 8Gb).
    --network network-type             Networking capability required by the job. None, HTTP, or Full (default None)
    --node-details                     Print out details of all nodes (overridden by --id-only).
-o, --output strings                   name:path of the output data volumes. 'outputs:/outputs' is always added unless '/outputs' is mapped to a different name. (default [outputs:/outputs])
    --output-dir string                Directory to write the output to.
    --private-internal-ipfs            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
-p, --publisher publisher              Where to publish the result of the job (default ipfs)
    --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
-s, --selector string                  Selector (label query) to filter nodes on which this job can be executed, supports '=', '==', and '!='.(e.g. -s key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints.
    --target all|any                   Whether to target the minimum number of matching nodes ("any") (default) or all matching nodes ("all") (default any)
    --timeout int                      Job execution timeout in seconds (e.g. 300 for 5 minutes)
    --wait                             Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
    --wait-timeout-secs int            When using --wait, how many seconds to wait for the job to complete before giving up. (default 600)
-w, --workdir string                   Working directory inside the container. Overrides the working directory shipped with the image (e.g. via WORKDIR in Dockerfile).
```

</details>

You can also use the `bacalhau wasm run` [command](../references/cli-reference/all-flags.md) to run a job compiled into the (WASM) format. Below, you can find an excerpt of the commands in the Bacalhau CLI:

<details>

<summary>Bacalhau WASM CLI commands</summary>

```
bacalhau wasm run {cid-of-wasm | } [--entry-point ] [wasm-args ...] [flags]
```

```
Flags:
    --concurrency int                  How many nodes should run the job (default 1)
    --cpu string                       Job CPU cores (e.g. 500m, 2, 8).
    --disk string                      Job Disk requirement (e.g. 500Gb, 2Tb, 8Tb).
    --domain stringArray               Domain(s) that the job needs to access (for HTTP networking)
    --download                         Should we download the results once the job is complete?
    --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
    --dry-run                          Do not submit the job, but instead print out what will be submitted
    --entry-point string               The name of the WASM function in the entry module to call. This should be a zero-parameter zero-result function that
                                will execute the job. (default "_start")
-e, --env strings                      The environment variables to supply to the job (e.g. --env FOO=bar --env BAR=baz)
-f, --follow                           When specified will follow the output from the job as it runs
-g, --gettimeout int                   Timeout for getting the results of a job in --wait (default 10)
    --gpu string                       Job GPU requirement (e.g. 1, 2, 8).
-h, --help                             help for run
    --id-only                          Print out only the Job ID on successful submission.
-U, --import-module-urls url           URL of the WASM modules to import from a URL source. URL accept any valid URL supported by the 'wget' command, and supports both HTTP and HTTPS.
-I, --import-module-volumes cid:path   CID:path of the WASM modules to import from IPFS, if you need to set the path of the mounted data.
-i, --input storage                    Mount URIs as inputs to the job. Can be specified multiple times. Format: src=URI,dst=PATH[,opt=key=value]
                                        Examples:
                                        # Mount IPFS CID to /inputs directory
                                        -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72
                                        # Mount S3 object to a specific path
                                        -i s3://bucket/key,dst=/my/input/path
                                        # Mount S3 object with specific endpoint and region
                                        -i src=s3://bucket/key,dst=/my/input/path,opt=endpoint=https://s3.example.com,opt=region=us-east-1
    --ipfs-connect string              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
    --ipfs-serve-path string           path local Ipfs node will persist data to
    --ipfs-swarm-addrs strings         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
    --ipfs-swarm-key string            Optional IPFS swarm key required to connect to a private IPFS swarm
-l, --labels strings                   List of labels for the job. Enter multiple in the format '-l a -l 2'. All characters not matching /a-zA-Z0-9_:|-/ and all emojis will be stripped.
    --memory string                    Job Memory requirement (e.g. 500Mb, 2Gb, 8Gb).
    --network network-type             Networking capability required by the job. None, HTTP, or Full (default None)
    --node-details                     Print out details of all nodes (overridden by --id-only).
-o, --output strings                   name:path of the output data volumes. 'outputs:/outputs' is always added unless '/outputs' is mapped to a different name. (default [outputs:/outputs])
    --output-dir string                Directory to write the output to.
    --private-internal-ipfs            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
-p, --publisher publisher              Where to publish the result of the job (default ipfs)
    --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
-s, --selector string                  Selector (label query) to filter nodes on which this job can be executed, supports '=', '==', and '!='.(e.g. -s key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints.
    --target all|any                   Whether to target the minimum number of matching nodes ("any") (default) or all matching nodes ("all") (default any)
    --timeout int                      Job execution timeout in seconds (e.g. 300 for 5 minutes)
    --wait                             Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
    --wait-timeout-secs int            When using --wait, how many seconds to wait for the job to complete before giving up. (default 600)
```

</details>

### Job Acceptance

When a job is submitted to a requester node, it selects compute nodes that are capable and suitable to execute the job, and communicate with them directly. The compute node has a collection of named executors, storage sources, and publishers, and it will choose the most appropriate ones based on the job specifications.

### Job execution

The selected compute node receives the job and starts its execution inside a container. The container can use different executors to work with the data and perform the necessary actions. A job can use the docker executor, WASM executor or a library storage volumes. Use [Docker Engine Specification](../references/other-specifications/engines/docker.md) to view the parameters to configure the Docker Engine. If you want tasks to be executed in a WebAssembly environment, pay attention to [WebAssembly Engine Specification](../references/other-specifications/engines/wasm.md).

### Results publishing

When the Compute node completes the job, it publishes the results to **S3's remote storage**, **IPFS**.

Bacalhau's seamless integration with IPFS ensures that users have a decentralized option for publishing their task results, enhancing accessibility and resilience while reducing dependence on a single point of failure. View [IPFS Publisher Specification](../references/other-specifications/publishers/ipfs.md) to get the detailed information.

Bacalhau's S3 Publisher provides users with a secure and efficient method to publish task results to any S3-compatible storage service. This publisher supports not just AWS S3, but other S3-compatible services offered by cloud providers like Google Cloud Storage and Azure Blob Storage, as well as open-source options like MinIO. View [S3 Publisher Specification](../references/other-specifications/publishers/s3.md) to get the detailed information.

## Chapter 3 - Returning Information

The Bacalhau client receives updates on the task execution status and results. A user can access the results and manage tasks through the command line interface.

### Get Job Results

To Get the results of a job you can run the following command.

```bash
bacalhau get [id] [flags]
```

One can choose from a wide range of flags, from which a few are shown below.

```shell
Usage:
  bacalhau get [id] [flags]

Flags:
      --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
  -h, --help                             help for get
      --ipfs-connect string              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
      --ipfs-serve-path string           path local Ipfs node will persist data to
      --ipfs-swarm-addrs strings         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
      --ipfs-swarm-key string            Optional IPFS swarm key required to connect to a private IPFS swarm
      --output-dir string                Directory to write the output to.
      --private-internal-ipfs            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
      --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
```

### Describe a Job

To describe a specific job, inserting the ID to the CLI or API gives back an overview of the job.

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau describe [id] [flags]
```

You can use the command with [appropriate flags](../references/cli-reference/all-flags.md) to get a full description of a job in yaml format.
{% endtab %}

{% tab title="API" %}
```
Endpoint: `GET /api/v1/orchestrator/jobs/:jobID`
```

You can use [describe Job API Documentation](../references/api/) to retrieve the specification and current status of a particular job.
{% endtab %}
{% endtabs %}

### List of Jobs

If you run more then one job or you want to find a specific job ID

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau list [flags]
```

You can use the command with [appropriate flags](../references/cli-reference/all-flags.md) to list jobs on the network in yaml format.
{% endtab %}

{% tab title="API" %}
```
Endpoint: `GET /api/v1/orchestrator/jobs`
```

You can use [List Jobs API Documentation](../references/api/jobs.md#list-jobs) to retrieve a list of jobs.
{% endtab %}
{% endtabs %}

### Job Executions

To list executions follow the following commands.

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau job executions [id] [flags]
```

You can use the command with [appropriate flags](../references/cli-reference/cli/job/index-3.md) to list all executions associated with a job, identified by its ID, in yaml format.
{% endtab %}

{% tab title="API" %}
```
Endpoint: `GET /api/v1/orchestrator/jobs/:jobID/executions`
```

You can use [Job Executions API Documentation](../references/api/jobs.md#job-executions) to retrieve all executions for a particular job.
{% endtab %}
{% endtabs %}

## Chapter 4 - Monitoring and Management

The Bacalhau client provides the user with tools to monitor and manage the execution of jobs. You can get information about status, progress and decide on next steps. View the [Bacalhau Agent APIs](../references/api/agent.md) if you want to know the node's health, capabilities, and deployed Bacalhau version. To get information about the status and characteristics of the nodes in the cluster use [Nodes API Documentation](../references/api/nodes.md).

### Stop a Job

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau cancel [id] [flags]
```

You can use the command with [appropriate flags](../references/cli-reference/all-flags.md#cancel) to cancel a job that was previously submitted and stop it running if it has not yet completed.
{% endtab %}

{% tab title="API" %}
```
Endpoint: `DELETE /api/v1/orchestrator/jobs/:jobID`
```

You can use [Stop Job API Documentation](../references/api/jobs.md#stop-job) to terminate a specific job asynchronously.
{% endtab %}
{% endtabs %}

### Job History

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau job history [id] [flags]
```

You can use the command with [appropriate flags](../references/cli-reference/all-flags.md) to enumerate the historical events related to a job, identified by its ID.
{% endtab %}

{% tab title="API" %}
```
Endpoint: `GET /api/v1/orchestrator/jobs/:jobID/history`
```

You can use [Job History API Documentation](../references/api/jobs.md#job-history) to retrieve historical events for a specific job.
{% endtab %}
{% endtabs %}

### Job Logs

```shell
bacalhau job logs [flags] [id]
```

You can use this [command](../references/cli-reference/all-flags.md#logs) to retrieve the log output (stdout, and stderr) from a job. If the job is still running it is possible to follow the logs after the previously generated logs are retrieved.

{% hint style="info" %}
To familiarize yourself with all the commands used in Bacalhau, please view [CLI Commands](../references/cli-reference/all-flags.md)
{% endhint %}

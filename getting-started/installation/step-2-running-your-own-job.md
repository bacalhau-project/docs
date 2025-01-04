# Step 2: Running Your Own Job

Now that you have the Bacalhau CLI installed, what can you do with it? Just about anything! Let's walk you through running some very simple jobs.

### Submit a Hello World job

To submit a job in Bacalhau, we will use the [`bacalhau docker run`](../../references/cli-reference/all-flags.md#docker-run) command. The command runs a job using the Docker executor on the node. Let's take a quick look at its syntax:

```shell
bacalhau docker run [flags] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

To run the job, you will need to connect to a public demo network or set up your own [private network](../create-private-network.md). In the following example, we will use the public demo network by using the `--configuration` flag.

{% tabs %}
{% tab title="CLI" %}
```bash
bacalhau docker run \
                -c API.Host=bootstrap.production.bacalhau.org \
                --wait \
                docker run \
                docker.io/bacalhauproject/hello-world:latest
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
{% endtab %}

{% tab title="Docker" %}
```bash
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
                -c API.Host=bootstrap.production.bacalhau.org \
                --wait \
                docker run \
                docker.io/bacalhauproject/hello-world:latest
```

Let's take a look at the results of the command execution in the terminal:

```
14:02:25.992 | INF pkg/repo/fs.go:81 > Initializing repo at '/root/.bacalhau' for environment 'production'
19b105c9-4cb5-43bd-a12f-d715d738addd
```
{% endtab %}
{% endtabs %}

The output will look something like the following:

```shell
Hello from Bacalhau! 🐟🐠🐡

This message shows that your job is running correctly on your Bacalhau environment.

To generate this output, Bacalhau took the following steps:
 1. The Bacalhau client received your job request and sent it to the orchestrator.
 2. The orchestrator selected an appropriate compute node from the network.
 3. The compute node pulled the Docker image from the specified registry.
 4. The container was launched in a secure, isolated environment.
 5. The job executed and gathered system information about its runtime environment.
 6. The results were captured and returned through the Bacalhau network.

To try something more ambitious, you can:
 - Process large datasets (https://bac.al/data-engineering)
 - Run AI/ML training (https://bac.al/model-training) or inference (https://bac.al/model-inference)
 - Run GPU-enabled workloads (https://bac.al/using-gpus-on-bacalhau)
 - Mount your own S3 bucket (https://bac.al/running-with-s3)
 - Use IPFS to store your data (https://bac.al/using-ipfs)

Learn more about Bacalhau:
 - Documentation: https://bac.al/docs
 - Getting Started: https://bac.al/getting-started
 - Examples: https://bac.al/examples
 - Slack: https://bac.al/slack
 - BlueSky: https://bac.al/bsky

Below is the detailed system information from your compute environment:
-------------------------------------------------------------------

timestamp: '2025-01-04T05:45:00.504060'
hostname: aa524162c525
container:
  python_version: 3.13.1
  base_image: cgr.dev/chainguard/python:latest
platform:
  system: Linux
  machine: aarch64
cpu:
  physical_cores: 12
  total_cores: 12
memory:
  total: 7.8 GB
  used: 1.0 GB
  percentage: 15.8
disk:
  total: 454.4 GB
  used: 286.6 GB
  percentage: 66.5
network:
  ip_addresses:
  - 127.0.0.1
  - 172.17.0.5
cwd: /hello-world-app
```

With that, you have just successfully run a job on Bacalhau! :fish: Congratulations!

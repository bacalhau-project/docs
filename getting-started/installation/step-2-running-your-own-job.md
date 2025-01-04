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
alpine echo hello bacalhau
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
While this command is designed to resemble Docker's run command which you may be familiar with, Bacalhau introduces a whole new set of [flags](../../references/cli-reference/all-flags.md#docker-run) to support its computing model.
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

```shell
helloWorld
```

With that, you have just successfully run a job on Bacalhau! :fish:

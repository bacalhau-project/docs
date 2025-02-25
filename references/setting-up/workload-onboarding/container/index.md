---
description: How to use Bacalhau Docker Image for task management
---

# Bacalhau Docker Image

This documentation explains how to use the Bacalhau Docker image for task management with Bacalhau client.

## Prerequisites

To get started, you need to install the Bacalhau client (see more information [here](broken-reference)) and Docker.

## 1. Pull the Bacalhau Docker image

The first step is to pull the Bacalhau Docker image from the [Github container registry](https://github.com/orgs/bacalhau-project/packages/container/package/bacalhau).

```
docker pull ghcr.io/bacalhau-project/bacalhau:latest
```

Expected output:

```shell
latest: Pulling from bacalhau-project/bacalhau
d14ccdd25413: Pull complete
621f190d05c8: Pull complete
Digest: sha256:3cda5619984de9b56c738c50f94188684170f54f7e417f8dcbe74ff8ec8eb434
Status: Downloaded newer image for ghcr.io/bacalhau-project/bacalhau:latest
ghcr.io/bacalhau-project/bacalhau:latest
```

You can also pull a specific version of the image, e.g.:

```
docker pull ghcr.io/bacalhau-project/bacalhau:v1.6.0
```

## 1. Check the version of Bacalhau client

```bash
docker run -t ghcr.io/bacalhau-project/bacalhau:latest version
```

The output is similar to:

```shell
12:00:32.427 | INF pkg/repo/fs.go:93 > Initializing repo at '/root/.bacalhau' for environment 'production'
CLIENT  SERVER  UPDATE MESSAGE 
v1.3.0  v1.4.0                 
```

## 2. Run a Bacalhau Job

For example to run an Ubuntu-based job that prints the message 'Hello from Docker Bacalhau':

```shell
bacalhau docker run \
        --id-only \
        --wait \
        ubuntu:latest \
        -- sh -c 'uname -a && echo "Hello from Docker Bacalhau!"'
```

### Structure of the command

1. `--id-only`: Output only the job id
2. `--wait`: Wait for the job to finish
3. `ubuntu:latest.` Ubuntu container
4. `--`: Separate Bacalhau parameters from the command to be executed inside the container
5. `sh -c 'uname -a && echo "Hello from Docker Bacalhau!"'`: The command executed inside the container

The command execution in the terminal is similar to:

```shell
j-6ffd54b8-e992-498f-9ee9-766ab09d5daa
```

`j-6ffd54b8-e992-498f-9ee9-766ab09d5daa` is a `job ID`, which represents the result of executing a command inside a Docker container. It can be used to obtain additional information about the executed job or to access the job's results. We store that in an environment variable so that we can reuse it later on (env: `JOB_ID=j-6ffd54b8-e992-498f-9ee9-766ab09d5daa`)

To print the **content of the Job ID**, execute the following command:

```
bacalhau job describe j-6ffd54b8-e992-498f-9ee9-766ab09d5daa
```

The output is similar to:

```shell
ID            = j-6ffd54b8-e992-498f-9ee9-766ab09d5daa
Name          = j-6ffd54b8-e992-498f-9ee9-766ab09d5daa
Namespace     = default
Type          = batch
State         = Completed
Count         = 1
Created Time  = 2024-09-08 14:33:19
Modified Time = 2024-09-08 14:33:20
Version       = 0

Summary
Completed = 1

Job History
 TIME                 REV.  STATE      TOPIC       EVENT         
 2024-09-08 14:33:19  1     Pending    Submission  Job submitted 
 2024-09-08 14:33:19  2     Running                              
 2024-09-08 14:33:20  3     Completed                            

Executions
 ID          NODE ID     STATE      DESIRED  REV.  CREATED     MODIFIED    COMMENT      
 e-bd5746b8  n-e002001e  Completed  Stopped  6     27m21s ago  27m21s ago  Accepted job 

Execution e-bd5746b8 History
 TIME                 REV.  STATE              TOPIC            EVENT        
 2024-09-08 14:33:19  1     New                                              
 2024-09-08 14:33:19  2     AskForBid                                        
 2024-09-08 14:33:19  3     AskForBidAccepted  Requesting Node  Accepted job 
 2024-09-08 14:33:19  4     AskForBidAccepted                                
 2024-09-08 14:33:19  5     BidAccepted                                      
 2024-09-08 14:33:20  6     Completed                                        

Standard Output
Linux 7d5c3dcc7fc2 6.5.0-1024-gcp #26~22.04.1-Ubuntu SMP Fri Jun 14 18:48:45 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
Hello from Docker Bacalhau!

```

## 3. Submit a Job With Output Files

You always need to mount directories into the container to access files. This is because the container is running in a separate environment from your host machine.

The first part of this example should look familiar, except for the Docker commands.

```shell
bacalhau docker run \                                   
        --id-only \
        --wait \
        --gpu 1 \
        ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1 -- \
            python main.py --o ./outputs --p "A Docker whale and a cod having a conversation about the state of the ocean"
```

When a job is submitted, Bacalhau prints the related `job_id` (`j-da29a804-3960-4667-b6e5-73f05e120117`):

```shell
j-da29a804-3960-4667-b6e5-73f05e120117
```

## 4. Check the State of your Jobs

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list
```

When it reads `Completed`, that means the job is done, and you can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe j-da29a804-3960-4667-b6e5-73f05e120117
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in the `result` directory.

```bash
bacalhau job get ${JOB_ID} --output-dir result
```

After the download is complete, you should see the following contents in the results directory.

![png](../../../.gitbook/assets/index_25_0.png)

## Support

If have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

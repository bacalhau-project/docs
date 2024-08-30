---
description: How to use the Bacalhau CLI in Docker
---

# Bacalhau CLI from Docker

This documentation explains how to use Bacalhau CLI from docker.

## Prerequisites

Install the [Bacalhau CLI in Docker](../../..//getting-started/installation#step-1.1-install-the-bacalhau-cli).

## 1. Check the version of Bacalhau CLI

```bash
docker run -t ghcr.io/bacalhau-project/bacalhau:latest version
```

The output is similar to:

```shell
13:38:54.518 | INF pkg/repo/fs.go:81 > Initializing repo at '/root/.bacalhau' for environment 'production'
CLIENT  SERVER  UPDATE MESSAGE
v1.2.0  v1.2.0
```

## 2. Run a Bacalhau Job

For example to run an Ubuntu-based job that prints the message 'Hello from Docker Bacalhau':

```shell
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
    docker run \
        --id-only \
        --wait \
        ubuntu:latest \
        -- sh -c 'uname -a && echo "Hello from Docker Bacalhau!"'
```

### Structure of the command

1. `ghcr.io/bacalhau-project/bacalhau:latest` : Name of the Bacalhau Docker image
2. `--id-only`: Output only the job id
3. `--wait`: Wait for the job to finish
4. `ubuntu:latest.` Ubuntu container
5. `--`: Separate Bacalhau parameters from the command to be executed inside the container
6. `sh -c 'uname -a && echo "Hello from Docker Bacalhau!"'`: The command executed inside the container

The command execution in the terminal is similar to:

```shell
13:53:46.478 | INF pkg/repo/fs.go:81 > Initializing repo at '/root/.bacalhau' for environment 'production'
ab95a5cc-e6b7-40f1-957d-596b02251a66
```

The output you're seeing is in two parts: **The first line:** `13:53:46.478 | INF pkg/repo/fs.go:81 > Initializing repo at '/root/.bacalhau' for environment 'production'` is an informational message indicating the initialization of a repository at the specified directory `('/root/.bacalhau')` for the `production` environment. **The second line:** `ab95a5cc-e6b7-40f1-957d-596b02251a66` is a `job ID`, which represents the result of executing a command inside a Docker container. It can be used to obtain additional information about the executed job or to access the job's results. We store that in an environment variable so that we can reuse it later on (env: `JOB_ID=ab95a5cc-e6b7-40f1-957d-596b02251a66`)

To print the **content of the Job ID**, execute the following command:

```
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
    describe ab95a5cc-e6b7-40f1-957d-596b02251a66 \
        | grep -A 2 "stdout: |"
```

The output is similar to:

```shell
stdout: |
        Linux fff680719453 6.2.0-1019-gcp #21~22.04.1-Ubuntu SMP Thu Nov 16 18:18:34 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
        Hello from Docker Bacalhau!
```

## 3. Submit a Job With Output Files

You always need to mount directories into the container to access files. This is because the container is running in a separate environment from your host machine.

The first part of this example should look familiar, except for the Docker commands.

```shell
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
    docker run \
        --id-only \
        --wait \
        --gpu 1 \
        ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1 -- \
            python main.py --o ./outputs --p "A Docker whale and a cod having a conversation about the state of the ocean"
```

When a job is submitted, Bacalhau prints the related `job_id` (`a46a9aa9-63ef-486a-a2f8-6457d7bafd2e`):

```shell
09:05:58.434 | INF pkg/repo/fs.go:81 > Initializing repo at '/root/.bacalhau' for environment 'production'
a46a9aa9-63ef-486a-a2f8-6457d7bafd2e
```

## 4. Check the State of your Jobs

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
    list $JOB_ID \
```

When it reads `Completed`, that means the job is done, and you can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
docker run -t ghcr.io/bacalhau-project/bacalhau:latest \
    describe $JOB_ID \
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in the `result` directory.

```bash
bacalhau job get ${JOB_ID} --output-dir result
```

After the download is complete, you should see the following contents in the results directory.

![png](../../../.gitbook/assets/index\_25\_0.png)

## Support

If have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

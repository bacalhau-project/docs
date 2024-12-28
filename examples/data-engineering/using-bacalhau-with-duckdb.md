# Using Bacalhau with DuckDB

[![stars - badge-generator](https://img.shields.io/github/stars/bacalhau-project/bacalhau?style=social)](https://github.com/bacalhau-project/bacalhau)

DuckDB is a relational table-oriented database management system that supports SQL queries for producing analytical results. It also comes with various features that are useful for data analytics.

DuckDB is suited for the following use cases:

1. Processing and storing tabular datasets, e.g. from CSV or Parquet files
2. Interactive data analysis, e.g. Joining & aggregate multiple large tables
3. Concurrent large changes, to multiple large tables, e.g. appending rows, adding/removing/updating columns
4. Large result set transfer to client

In this example tutorial, we will show how to use DuckDB with Bacalhau. The advantage of using DuckDB with Bacalhau is that you don’t need to install, and there is no need to download the datasets since the datasets are already there on IPFS or on the web.

## Overview

* How to run a relational database (like DUCKDB) on Bacalhau

## Prerequisites

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Containerize Script using Docker

{% hint style="info" %}
You can skip this entirely and directly go to running on Bacalhau.
{% endhint %}

If you want any additional dependencies to be installed along with DuckDB, you need to build your own container.

To build your own docker container, create a `Dockerfile`, which contains instructions to build your DuckDB docker container.

```docker
FROM mcr.microsoft.com/vscode/devcontainers/python:3.9

RUN apt-get update && apt-get install -y nodejs npm g++

# Install dbt
RUN pip3 --disable-pip-version-check --no-cache-dir install duckdb==0.4.0 dbt-duckdb==1.1.4 \
    && rm -rf /tmp/pip-tmp

# Install duckdb cli
RUN wget https://github.com/duckdb/duckdb/releases/download/v0.4.0/duckdb_cli-linux-amd64.zip \
    && unzip duckdb_cli-linux-amd64.zip -d /usr/local/bin \
    && rm duckdb_cli-linux-amd64.zip

# Configure Workspace
ENV DBT_PROFILES_DIR=/workspaces/datadex
WORKDIR /workspaces/datadex

```

{% hint style="info" %}
See more information on how to containerize your script/app [here](https://docs.docker.com/get-started/02_our_app/)
{% endhint %}

### Build the container

We will run `docker build` command to build the container:

```
docker build -t <hub-user>/<repo-name>:<tag> .
```

Before running the command replace:

**hub-user** with your docker hub username, If you don’t have a docker hub account [follow these instructions to create docker account](https://docs.docker.com/docker-id/), and use the username of the account you created

**repo-name** with the name of the container, you can name it anything you want

**tag** this is not required, but you can use the latest tag

In our case:

```bash
docker build -t davidgasquez/datadex:v0.2.0
```

### Push the container

Next, upload the image to the registry. This can be done by using the Docker hub username, repo name or tag.

```bash
docker push <hub-user>/<repo-name>:<tag>
```

In our case:

```bash
docker push davidgasquez/datadex:v0.2.0
```

## Running a Bacalhau Job

After the repo image has been pushed to Docker Hub, we can now use the container for running on Bacalhau. To submit a job, run the following Bacalhau command:

```bash
export JOB_ID=$(bacalhau docker run \
davidgasquez/datadex:v0.2.0 \
--  duckdb -s "select 1")
```

### Structure of the command

Let's look closely at the command above:

1. `bacalhau docker run`: call to bacalhau
2. `davidgasquez/datadex:v0.2.0` : the name and the tag of the docker image we are using
3. `duckdb -s "select 1"`: execute DuckDB

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

### Declarative job description​ <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../references/jobs/job/) format. In this case, the description will look like this:

```yaml
name: DuckDB Hello World
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: davidgasquez/datadex:v0.2.0
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - duckdb -s "select 1"
```

The job description should be saved in `.yaml` format, e.g. `duckdb1.yaml`, and then run with the command:

```bash
bacalhau job run duckdb1.yaml
```

## Checking the State of your Jobs

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID}
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau job get $JOB_ID --output-dir results
```

## Viewing your Job Output

Each job creates 3 subfolders: the **combined\_results**,**per\_shard files**, and the **raw** directory. To view the file, run the following command:

```bash
cat results/stdout  # displays the contents of the file
```

Expected output:

```bash
┌───┐
│ 1 │
├───┤
│ 1 │
└───┘
```

## Running Arbitrary SQL commands

Below is the `bacalhau docker run` command to to run arbitrary SQL commands over the yellow taxi trips dataset

```bash
export JOB_ID=$(bacalhau docker run \
 -i ipfs://bafybeiejgmdpwlfgo3dzfxfv3cn55qgnxmghyv7vcarqe3onmtzczohwaq \
  --workdir /inputs \
  --id-only \
  --wait \
  davidgasquez/duckdb:latest \
  -- duckdb -s "select count(*) from '0_yellow_taxi_trips.parquet'")
```

### Structure of the command

Let's look closely at the command above:

1. `bacalhau docker run`: call to bacalhau
2. `-i ipfs://bafybeiejgmdpwlfgo3dzfxfv3cn55qgnxmghyv7vcarqe3onmtzczohwaq \`: CIDs to use on the job. Mounts them at '/inputs' in the execution.
3. `davidgasquez/duckdb:latest`: the name and the tag of the docker image we are using
4. `/inputs`: path to input dataset
5. `duckdb -s`: execute DuckDB

### Declarative job description​ <a href="#declarative-job-description-1" id="declarative-job-description-1"></a>

The same job can be presented in the [declarative](../../references/jobs/job/) format. In this case, the description will look like this:

```yaml
name: DuckDB Parquet Query
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        WorkingDirectory: "/inputs"
        Image: davidgasquez/duckdb:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - duckdb -s "select count(*) from '0_yellow_taxi_trips.parquet'"
    InputSources:
    - Target: "/inputs"
      Source:
        Type: "s3"
        Params:
          Bucket: "bacalhau-duckdb"
          Key: "*"
          Region: "us-east-1"
```

The job description should be saved in `.yaml` format, e.g. `duckdb2.yaml`, and then run with the command:

```
bacalhau job run duckdb2.yaml
```

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID} --wide
```

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau job get $JOB_ID --output-dir results
```

## Viewing your Job Output

Each job creates 3 subfolders: the **combined\_results**, **per\_shard files**, and the **raw** directory. To view the file, run the following command:

```bash
cat results/stdout
```

```
┌──────────────┐
│ count_star() │
│    int64     │
├──────────────┤
│     24648499 │
└──────────────┘
```

## Need Support?

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

---
description: Parallel Video Resizing via File Sharding
---

# Video Processing

## Introduction

Many data engineering workloads consist of embarrassingly parallel workloads where you want to run a simple execution on a large number of files. In this example tutorial, we will run a simple video filter on a large number of video files.

## Prerequisite[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Upload the Data to IPFS[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#upload-the-data-to-ipfs) <a href="#upload-the-data-to-ipfs" id="upload-the-data-to-ipfs"></a>

The simplest way to upload the data to IPFS is to use a third-party service to "pin" data to the IPFS network, to ensure that the data exists and is available. To do this you need an account with a pinning service like [NFT.storage](https://nft.storage/) or [Pinata](https://pinata.cloud/). Once registered you can use their UI or API or SDKs to upload files.

This resulted in the IPFS CID of `Qmd9CBYpdgCLuCKRtKRRggu24H72ZUrGax5A9EYvrbC72j`.

## Running a Bacalhau Job[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#running-a-bacalhau-job) <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

To submit a workload to Bacalhau, we will use the `bacalhau docker run` command. The command allows one to pass input data volume with a `-i ipfs://CID:path` argument just like Docker, except the left-hand side of the argument is a [content identifier (CID)](https://github.com/multiformats/cid). This results in Bacalhau mounting a _data volume_ inside the container. By default, Bacalhau mounts the input volume at the path `/inputs` inside the container.

```bash
export JOB_ID=$(bacalhau docker run \
    --wait \
    --wait-timeout-secs 100 \
    --id-only \
    -i ipfs://Qmd9CBYpdgCLuCKRtKRRggu24H72ZUrGax5A9EYvrbC72j:/inputs \
    linuxserver/ffmpeg \
    -- bash -c 'find /inputs -iname "*.mp4" -printf "%f\n" | xargs -I{} ffmpeg -y -i /inputs/{} -vf "scale=-1:72,setsar=1:1" /outputs/scaled_{}' )
```

### Structure of the command[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Let's look closely at the command above:

1. `bacalhau docker run`: call to Bacalhau
2. `-i ipfs://Qmd9CBYpdgCLuCKRtKRRggu24H72ZUrGax5A9EYvrbC72j`: CIDs to use on the job. Mounts them at '/inputs' in the execution.
3. `linuxserver/ffmpeg`: the name of the docker image we are using to resize the videos
4. `-- bash -c 'find /inputs -iname "*.mp4" -printf "%f\n" | xargs -I{} ffmpeg -y -i /inputs/{} -vf "scale=-1:72,setsar=1:1" /outputs/scaled_{}'`: the command that will be executed inside the container. It uses `find` to locate all files with the extension ".mp4" within `/inputs` and then uses `ffmpeg` to resize each found file to 72 pixels in height, saving the results in the `/outputs` folder.

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

{% hint style="info" %}
[Bacalhau overwrites the default entrypoint](https://github.com/filecoin-project/bacalhau/blob/v0.2.3/cmd/bacalhau/docker\_run.go#L64) so we must run the full command after the `--` argument. In this line you will list all of the mp4 files in the `/inputs` directory and execute `ffmpeg` against each instance.
{% endhint %}

### Declarative job description[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#declarative-job-description) <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../setting-up/jobs/job.md) format. In this case, the description will look like this:

```yaml
name: Video Processing
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: linuxserver/ffmpeg
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - find /inputs -iname "*.mp4" -printf "%f\n" | xargs -I{} ffmpeg -y -i /inputs/{} -vf "scale=-1:72,setsar=1:1" /outputs/scaled_{}
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs
    InputSources:
    - Target: "/inputs"
      Source:
        Type: "s3"
        Params:
          Bucket: "bacalhau-video-processing"
          Key: "*"
          Region: "us-east-1"
```

The job description should be saved in `.yaml` format, e.g. `video.yaml`, and then run with the command:

```bash
bacalhau job run video.yaml
```

## Checking the State of your Jobs[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau list`.

```bash
bacalhau list --id-filter ${JOB_ID} --no-style
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
mkdir -p ./results # Temporary directory to store the results
bacalhau get ${JOB_ID} --output-dir ./results # Download the results
```

## Viewing your Job Output[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#viewing-your-job-output) <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

To view the results open the `results/outputs/` folder.&#x20;

{% file src="../../.gitbook/assets/scaled_Prominent_Late_Gothic_styled_architecture.mp4" %}

{% file src="../../.gitbook/assets/scaled_Calm_waves_on_a_rocky_sea_gulf.mp4" %}

{% file src="../../.gitbook/assets/scaled_Bird_flying_over_the_lake.mp4" %}

### Support[​](http://localhost:3000/examples/data-engineering/simple-parallel-workloads/#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

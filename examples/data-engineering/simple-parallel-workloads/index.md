---
description: Parallel Video Resizing via File Sharding
---

# Video Processing

[![stars - badge-generator](https://img.shields.io/github/stars/bacalhau-project/bacalhau?style=social)](https://github.com/bacalhau-project/bacalhau)

Many data engineering workloads consist of embarrassingly parallel workloads where you want to run a simple execution on a large number of files. In this example tutorial, we will run a simple video filter on a large number of video files.

## TD;LR

Running video files with Bacalhau

## Prerequisite

To get started, you need to install the Bacalhau client, see more information [here](https://docs.bacalhau.org/getting-started/installation)

## Submit the workload

To submit a workload to Bacalhau, we will use the `bacalhau docker run` command.

```bash
%%bash --out job_id
bacalhau docker run \
  --wait \
  --wait-timeout-secs 100 \
  --id-only \
  -i ipfs://Qmd9CBYpdgCLuCKRtKRRggu24H72ZUrGax5A9EYvrbC72j:/inputs \
  linuxserver/ffmpeg -- \
  bash -c 'find /inputs -iname "*.mp4" -printf "%f\n" | xargs -I{} ffmpeg -y -i /inputs/{} -vf "scale=-1:72,setsar=1:1" /outputs/scaled_{}'

```

The job has been submitted and Bacalhau has printed out the related job id. We store that in an environment variable so that we can reuse it later on.

The `bacalhau docker run` command allows one to pass input data volume with a `-i ipfs://CID:path` argument just like Docker, except the left-hand side of the argument is a [content identifier (CID)](https://github.com/multiformats/cid). This results in Bacalhau mounting a _data volume_ inside the container. By default, Bacalhau mounts the input volume at the path `/inputs` inside the container.

We created a 72px wide video thumbnails for all the videos in the `inputs` directory. The `outputs` directory will contain the thumbnails for each video. We will shard by 1 video per job, and use the `linuxserver/ffmpeg` container to resize the videos.

:::tip [Bacalhau overwrites the default entrypoint](https://github.com/filecoin-project/bacalhau/blob/v0.2.3/cmd/bacalhau/docker\_run.go#L64) so we must run the full command after the `--` argument. In this line you will list all of the mp4 files in the `/inputs` directory and execute `ffmpeg` against each instance. :::

## Checking the State of your Jobs

* **Job status**: You can check the status of the job using `bacalhau job list`.

```bash
%%bash
bacalhau job list --id-filter=${JOB_ID} --no-style
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

* **Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
%%bash
bacalhau job describe ${JOB_ID}
```

* **Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
%%bash
mkdir -p ./results # Temporary directory to store the results
bacalhau job get --output-dir ./results ${JOB_ID} # Download the results
```

After the download has finished you should see the following contents in the results directory.

## Viewing your Job Output

To view the file, run the following command:

### Display the videos

To view the videos, we will use **glob** to return all file paths that match a specific pattern.

\<video src={require('./scaled\_Bird\_flying\_over\_the\_lake.mp4').default} controls > Your browser does not support the `video` element. \<video src={require('./scaled\_Calm\_waves\_on\_a\_rocky\_sea\_gulf.mp4').default} controls > Your browser does not support the `video` element. \<video src={require('./scaled\_Prominent\_Late\_Gothic\_styled\_architecture.mp4').default} controls > Your browser does not support the `video` element.

## Need Support?

For questions, and feedback, please reach out in our [forum](https://github.com/filecoin-project/bacalhau/discussions)

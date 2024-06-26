---
description: How to process images stored in IPFS with Bacalhau
---

# Simple Image Processing

## Introduction

In this example tutorial, we will show you how to use Bacalhau to process images on a [Landsat dataset](https://ipfs.io/ipfs/QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72/).

Bacalhau has the unique capability of operating at a massive scale in a distributed environment. This is made possible because data is naturally sharded across the IPFS network amongst many providers. We can take advantage of this to process images in parallel.

## Prerequisite[​](http://localhost:3000/examples/data-engineering/image-processing/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Running a Bacalhau Job[​](http://localhost:3000/examples/data-engineering/image-processing/#running-a-bacalhau-job) <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

To submit a workload to Bacalhau, we will use the `bacalhau docker run` command. This command allows to pass input data volume with a `-i ipfs://CID:path` argument just like Docker, except the left-hand side of the argument is a [content identifier (CID)](https://github.com/multiformats/cid). This results in Bacalhau mounting a _data volume_ inside the container. By default, Bacalhau mounts the input volume at the path `/inputs` inside the container.

Bacalhau also mounts a data volume to store output data. The `bacalhau docker run` command creates an output data volume mounted at `/outputs`. This is a convenient location to store the results of your job.

```bash
export JOB_ID=$(bacalhau docker run \
    --wait \
    --wait-timeout-secs 100 \
    --id-only \
    -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72:/input_images \
    --entrypoint mogrify \
    dpokidov/imagemagick:7.1.0-47-ubuntu \
    -- -resize 100x100 -quality 100 -path /outputs '/input_images/*.jpg')
```

#### Structure of the command[​](http://localhost:3000/examples/data-engineering/image-processing/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Let's look closely at the command above:

1. `bacalhau docker run`: call to Bacalhau
2. `-i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72:/input_images`: Specifies the input data, which is stored in IPFS at the given CID.
3. `--entrypoint mogrify`: Overrides the default ENTRYPOINT of the image, indicating that the mogrify utility from the ImageMagick package will be used instead of the default entry.
4. `dpokidov/imagemagick:7.1.0-47-ubuntu`: The name and the tag of the docker image we are using
5. `-- -resize 100x100 -quality 100 -path /outputs '/input_images/*.jpg'`: These arguments are passed to mogrify and specify operations on the images: resizing to 100x100 pixels, setting quality to 100, and saving the results to the `/outputs` folder.

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

### Declarative job description[​](http://localhost:3000/examples/data-engineering/image-processing/#declarative-job-description) <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../setting-up/jobs/job.md) format. In this case, the description will look like this:

```yaml
name: Simple Image Processing
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: dpokidov/imagemagick:7.1.0-47-ubuntu
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - magick mogrify -resize 100x100 -quality 100 -path /outputs '/input_images/*.jpg'
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs
    InputSources:
    - Target: "/input_images"
      Source:
        Type: "s3"
        Params:
          Bucket: "landsat-image-processing"
          Key: "*"
          Region: "us-east-1"
```

The job description should be saved in `.yaml` format, e.g. `image.yaml`, and then run with the command:

```bash
bacalhau job run image.yaml
```

## Checking the State of your Jobs[​](http://localhost:3000/examples/model-inference/Huggingface-Model-Inference/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau job list`:

```bash
bacalhau job list --id-filter ${JOB_ID}
```

When it says `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`:

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir results
bacalhau job get ${JOB_ID} --output-dir results
```

### Display the image[​](http://localhost:3000/examples/data-engineering/image-processing/#display-the-image) <a href="#display-the-image" id="display-the-image"></a>

To view the images, open the `results/outputs/` folder:

<div>

<figure><img src="../../.gitbook/assets/index_21_0 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_1 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_2 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_3 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_4 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_5 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_6 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_7 (1).jpg" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../.gitbook/assets/index_21_8 (1).jpg" alt=""><figcaption></figcaption></figure>

</div>

### Support[​](http://localhost:3000/examples/data-engineering/image-processing/#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

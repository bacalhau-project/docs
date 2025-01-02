# Object Detection with YOLOv5 on Bacalhau

## Introduction​ <a href="#introduction" id="introduction"></a>

The identification and localization of objects in images and videos is a computer vision task called object detection. Several algorithms have emerged in the past few years to tackle the problem. One of the most popular algorithms to date for real-time object detection is [YOLO (You Only Look Once)](https://towardsdatascience.com/yolo-you-only-look-once-real-time-object-detection-explained-492dc9230006), initially proposed [by Redmond et al.](https://arxiv.org/abs/1506.02640)

Traditionally, models like YOLO required enormous amounts of training data to yield reasonable results. People might not have access to such high-quality labeled data. Thankfully, open-source communities and researchers have made it possible to utilize pre-trained models to perform inference. In other words, you can use models that have already been trained on large datasets to perform object detection on your own data.

Bacalhau is a highly scalable decentralized computing platform and is well suited to running massive object detection jobs. In this example, you can take advantage of the GPUs available on the Bacalhau Network and perform an end-to-end object detection inference, using the [YOLOv5 Docker Image developed by Ultralytics.](https://github.com/ultralytics/yolov5/wiki/Docker-Quickstart)

## TL;DR​ <a href="#tldr" id="tldr"></a>

Load your dataset into S3/IPFS, specify it and pre-trained weights via the `--input` flags, choose a suitable container, specify the command and path to save the results - done!

## Prerequisite​ <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Test Run with Sample Data​ <a href="#test-run-with-sample-data" id="test-run-with-sample-data"></a>

To get started, let's run a test job with a small sample dataset that is included in the YOLOv5 Docker Image. This will give you a chance to familiarise yourself with the process of running a job on Bacalhau.

In addition to the usual Bacalhau flags, you will also see example of using the `--gpu 1` flag in order to specify the use of a GPU.

{% hint style="info" %}
Remember that by default Bacalhau does not provide any network connectivity when running a job. So you need to either provide all assets at job submission time, or use the `--network=full` or `--network=http` flags to access the data at task time. See the [Internet Access](../../setting-up/networking-instructions/networking.md) page for more details
{% endhint %}

The model requires pre-trained weights to run and by default downloads them from within the container. Bacalhau jobs don't have network access so we will pass in the weights at submission time, saving them to `/usr/src/app/yolov5s.pt`. You may also provide your own weights here.

The container has its own options that we must specify:

1. `--input` to select which pre-trained weights you desire with details on the [yolov5 release page](https://github.com/ultralytics/yolov5/releases)
2. `--project` specifies the output volume that the model will save its results to. Bacalhau defaults to using `/outputs` as the output directory, so we save it there.

For more container flags refer to the `yolov5/detect.py` file in the [YOLO repository](https://github.com/ultralytics/yolov5/blob/master/detect.py#L3-#L25).

One final additional hack that we have to do is move the weights file to a location with the standard name. As of writing this, Bacalhau downloads the file to a UUID-named file, which the model is not expecting. This is because GitHub 302 redirects the request to a random file in its backend.

### Structure of the command​ <a href="#structure-of-the-command" id="structure-of-the-command"></a>

{% hint style="info" %}
Some of the jobs presented in the Examples section may require more resources than are currently available on the demo network. Consider [starting your own network](../../getting-started/create-private-network.md) or running less resource-intensive jobs on the demo network
{% endhint %}

1. `export JOB_ID=$( ... )` exports the job ID as environment variable
2. The `--gpu 1` flag is set to specify hardware requirements, a GPU is needed to run such a job
3. The `--timeout` flag is set to make sure that if the job is not completed in the specified time, it will be terminated
4. The `--wait` flag is set to wait for the job to complete before return
5. The `--wait-timeout-secs` flag is set together with `--wait` to define how long should app wait for the job to complete
6. The `--id-only` flag is set to print only job id
7. The `--input` flags are used to specify the sources of input data
8. `-- /bin/bash -c 'find /inputs -type f -exec cp {} /outputs/yolov5s.pt \; ; python detect.py --weights /outputs/yolov5s.pt --source $(pwd)/data/images --project /outputs'` tells the model where to find input data and where to write output

```bash
export JOB_ID=$(bacalhau docker run \
--gpu 1 \
--timeout 3600 \
--wait \
--wait-timeout-secs 3600 \
--id-only \
--input https://github.com/ultralytics/yolov5/releases/download/v6.2/yolov5s.pt \
ultralytics/yolov5:v6.2 \
-- /bin/bash -c 'find /inputs -type f -exec cp {} /outputs/yolov5s.pt \; ; python detect.py --weights /outputs/yolov5s.pt --source $(pwd)/data/images --project /outputs')
```

This should output a UUID (like `59c59bfb-4ef8-45ac-9f4b-f0e9afd26e70`), which will be stored in the environment variable `JOB_ID`. This is the ID of the job that was created. You can check the status of the job using the commands below.

### Declarative job description​ <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](object-detection-with-yolov5-on-bacalhau.md#declarative-job-description) format. In this case, the description will look like this:

```yaml
name: Object Detection with YOLOv5
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: ultralytics/yolov5:v6.2
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - "find /inputs -type f -exec cp {} /outputs/yolov5s.pt \\; ; python detect.py --weights /outputs/yolov5s.pt --source $(pwd)/data/images --project /outputs"
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs
    InputSources:
      - Source:
          Type: "urlDownload"
          Params:
            URL: "https://github.com/ultralytics/yolov5/releases/download/v6.1/yolov5s.pt"
        Target: "/inputs"
```

## Checking the State of your Jobs​ <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

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

### Viewing Output​ <a href="#viewing-output" id="viewing-output"></a>

After the download has finished we can see the results in the `results/outputs/exp` folder.

## Using Custom Images as an Input​ <a href="#using-custom-images-as-an-input" id="using-custom-images-as-an-input"></a>

Now let's use some custom images. First, you will need to ingest your images onto IPFS or S3 storage. For more information about how to do that see the [data ingestion](../../setting-up/data-ingestion/) section.

This example will use the [Cyclist Dataset for Object Detection | Kaggle](https://www.kaggle.com/datasets/f445f341fc5e3ab58757efa983a38d6dc709de82abd1444c8817785ecd42a1ac) dataset.

We have already uploaded this dataset to the IPFS storage under the CID: `bafybeicyuddgg4iliqzkx57twgshjluo2jtmlovovlx5lmgp5uoh3zrvpm`. You can browse to this dataset via [a HTTP IPFS proxy](https://w3s.link/ipfs/bafybeicyuddgg4iliqzkx57twgshjluo2jtmlovovlx5lmgp5uoh3zrvpm).

Let's run a the same job again, but this time use the images above.

```bash
export JOB_ID=$(bacalhau docker run \
--gpu 1 \
--timeout 3600 \
--wait \
--wait-timeout-secs 3600 \
--id-only \
--input https://github.com/ultralytics/yolov5/releases/download/v6.2/yolov5s.pt \
--input ipfs://bafybeicyuddgg4iliqzkx57twgshjluo2jtmlovovlx5lmgp5uoh3zrvpm:/datasets \
ultralytics/yolov5:v6.2 \
-- /bin/bash -c 'find /inputs -type f -exec cp {} /outputs/yolov5s.pt \; ; python detect.py --weights /outputs/yolov5s.pt --source /datasets --project /outputs')
```

Just as in the example above, this should output a UUID, which will be stored in the environment variable `JOB_ID`. You can check the status of the job using the commands below.

To check the state of the job and view job output refer to the [instructions above](object-detection-with-yolov5-on-bacalhau.md#checking-the-state-of-your-jobs).

## Support​ <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

# Training Pytorch Model with Bacalhau

## Introduction

In this example tutorial, we will show you how to train a Pytorch RNN MNIST neural network model with Bacalhau. PyTorch is a framework developed by Facebook AI Research for deep learning, featuring both beginner-friendly debugging tools and a high level of customization for advanced users, with researchers and practitioners using it across companies like Facebook and Tesla. Applications include computer vision, natural language processing, cryptography, and more.

## TL;DR[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#tldr) <a href="#tldr" id="tldr"></a>

```bash
bacalhau docker run \
    --gpu 1 \
    --timeout 3600 \
    --wait-timeout-secs 3600 \
    --wait \
    --id-only \
    pytorch/pytorch \
    -w /outputs \
    -i ipfs://QmdeQjz1HQQdT9wT2NHX86Le9X6X6ySGxp8dfRUKPtgziw:/data \
    -i https://raw.githubusercontent.com/pytorch/examples/main/mnist_rnn/main.py \
-- python ../inputs/main.py --save-model
```

## Prerequisite[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Training the Model Locally[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#training-the-model-locally) <a href="#training-the-model-locally" id="training-the-model-locally"></a>

To train our model locally, we will start by cloning the Pytorch examples [repo](https://github.com/pytorch/examples):

```bash
git clone https://github.com/pytorch/examples
```

Install the following:

```bash
pip install --upgrade torch torchvision
```

Next, we run the command below to begin the training of the `mnist_rnn` model. We added the `--save-model` flag to save the model

```bash
python ./examples/mnist_rnn/main.py --save-model
```

Next, the downloaded MNIST dataset is saved in the `data` folder.

## Uploading Dataset to IPFS[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#uploading-dataset-to-ipfs) <a href="#uploading-dataset-to-ipfs" id="uploading-dataset-to-ipfs"></a>

Now that we have downloaded our dataset, the next step is to upload it to IPFS. The simplest way to upload the data to IPFS is to use a third-party service to "pin" data to the IPFS network, to ensure that the data exists and is available. To do this you need an account with a pinning service like [Pinata](https://pinata.cloud/) or [NFT.Storage](https://nft.storage/). Once registered you can use their UI or API or SDKs to upload files.

Once you have uploaded your data, you'll be finished copying the CID. [Here](https://gateway.pinata.cloud/ipfs/QmdeQjz1HQQdT9wT2NHX86Le9X6X6ySGxp8dfRUKPtgziw/?filename=data) is the dataset we have uploaded.

## Running a Bacalhau Job[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#running-a-bacalhau-job) <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

After the repo image has been pushed to Docker Hub, we can now use the container for running on Bacalhau. To submit a job, run the following Bacalhau command:

```bash
export JOB_ID=$(bacalhau docker run \
    --gpu 1 \
    --timeout 3600 \
    --wait-timeout-secs 3600 \
    --wait \
    --id-only \
    pytorch/pytorch \
    -w /outputs \
    -i ipfs://QmdeQjz1HQQdT9wT2NHX86Le9X6X6ySGxp8dfRUKPtgziw:/data \
    -i https://raw.githubusercontent.com/pytorch/examples/main/mnist_rnn/main.py \
-- python ../inputs/main.py --save-model)
```

### Structure of the command[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#structure--of-the-command) <a href="#structure--of-the-command" id="structure--of-the-command"></a>

1. `export JOB_ID=$( ... )` exports the job ID as environment variable
2. `bacalhau docker run`: call to bacalhau
3. The `--gpu 1` flag is set to specify hardware requirements, a GPU is needed to run such a job
4. `pytorch/pytorch`: Using the official pytorch Docker image
5. The `-i ipfs://QmdeQjz1HQQd.....`: flag is used to mount the uploaded dataset
6. The `-i https://raw.githubusercontent.com/py..........`: flag is used to mount our training script. We will use the URL to this [Pytorch example](https://github.com/pytorch/examples/blob/main/mnist\_rnn/main.py)
7. `-w /outputs:` Our working directory is /outputs. This is the folder where we will save the model as it will automatically get uploaded to IPFS as outputs
8. `python ../inputs/main.py --save-model`: URL script gets mounted to the `/inputs` folder in the container

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

### Declarative job description[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#declarative-job-description) <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../setting-up/jobs/job.md) format. In this case, the description will look like this:

```yaml
name: Stable Diffusion Dreambooth Finetuning
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: "pytorch/pytorch" 
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - python ../inputs/main.py --save-model
    InputSources:
      - Source:
          Type: "ipfs"
          Params:
            CID: "QmdeQjz1HQQdT9wT2NHX86Le9X6X6ySGxp8dfRUKPtgziw"
        Target: /data
      - Source:
          Type: urlDownload
          Params:
            URL: https://raw.githubusercontent.com/pytorch/examples/main/mnist_rnn/main.py
        Target: /inputs  
    Resources:
      GPU: "1"
```

The job description should be saved in `.yaml` format, e.g. `torch.yaml`, and then run with the command:

```bash
bacalhau job run torch.yaml
```

## Checking the State of your Jobs[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

### Job status[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#job-status) <a href="#job-status" id="job-status"></a>

You can check the status of the job using `bacalhau list`.

```bash
bacalhau list --id-filter ${JOB_ID}
```

When it says `Completed`, that means the job is done, and we can get the results.

### Job information[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#job-information) <a href="#job-information" id="job-information"></a>

You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

### Job download[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#job-download) <a href="#job-download" id="job-download"></a>

You can download your job results directly by using `bacalhau get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau get $JOB_ID --output-dir results
```

After the download has finished you should see the following contents in results directory

## Viewing your Job Output[​](http://localhost:3000/examples/model-training/Training-Pytorch-Model/#viewing-your-job-output) <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

Now you can find results in the `results/outputs` folder. To view them, run the following command:

```bash
ls results/ # list the contents of the current directory 
```

```bash
cat results/stdout # displays the contents of the file given to it as a parameter.
```

```bash
ls results/outputs/ # list the successfully trained model
```

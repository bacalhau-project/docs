# Stable Diffusion Checkpoint Inference

## Introduction[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#introduction) <a href="#introduction" id="introduction"></a>

[Stable Diffusion](https://github.com/CompVis/stable-diffusion) is a state of the art text-to-image model that generates images from text and was developed as an open-source alternative to [DALL·E 2](https://openai.com/dall-e-2/). It is based on a [Diffusion Probabilistic Model](https://arxiv.org/abs/2102.09672) and uses a [Transformer](https://arxiv.org/abs/1706.03762) to generate images from text.

This example demonstrates how to use stable diffusion using a finetuned model and run inference on it. The first section describes the development of the code and the container - it is optional as users don't need to build their own containers to use their own custom model. The second section demonstrates how to convert your model weights to ckpt. The third section demonstrates how to run the job using Bacalhau.

The following guide is using the fine-tuned model, which was finetuned on Bacalhau. To learn how to finetune your own stable diffusion model refer to [this guide](../model-training/stable-diffusion-dreambooth-finetuning.md).

## TL;DR[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#tldr) <a href="#tldr" id="tldr"></a>

1. Convert your existing model weights to the `ckpt` format and upload to the IPFS storage.
2. Create a job using `bacalhau docker run`, relevant docker image, model weights and any prompt.
3. Download results using `bacalhau job get` and the job id.

## Prerequisite[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install:

1. Bacalhau client, see more information [here](../../getting-started/installation.md)
2. NVIDIA GPU
3. CUDA drivers
4. NVIDIA docker

## Running Locally[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#running-locally) <a href="#running-locally" id="running-locally"></a>

### Containerize your Script using Docker[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#containerize-your-script-using-docker) <a href="#containerize-your-script-using-docker" id="containerize-your-script-using-docker"></a>

{% hint style="success" %}
This part of the guide is optional - you can skip it and proceed to the [Running a Bacalhau job](stable-diffusion-checkpoint-inference.md#running-a-bacalhau-job) if you are not going to use your own custom image.
{% endhint %}

To build your own docker container, create a `Dockerfile`, which contains instructions to containerize the code for inference.

```docker
FROM  pytorch/pytorch:1.13.0-cuda11.6-cudnn8-runtime

WORKDIR /

RUN apt update &&  apt install -y git

RUN git clone https://github.com/runwayml/stable-diffusion.git

WORKDIR /stable-diffusion

RUN conda env create -f environment.yaml

SHELL ["conda", "run", "-n", "ldm", "/bin/bash", "-c"]

RUN pip install opencv-python

RUN apt update

RUN apt-get install ffmpeg libsm6 libxext6 libxrender-dev  -y
```

This container is using the `pytorch/pytorch:1.13.0-cuda11.6-cudnn8-runtime` image and the working directory is set. Next the Dockerfile installs required dependencies. Then we add our custom code and pull the dependent repositories.

{% hint style="info" %}
See more information on how to containerize your script/app [here](https://docs.docker.com/get-started/02\_our\_app/)
{% endhint %}

### Build the container[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#build-the-container) <a href="#build-the-container" id="build-the-container"></a>

We will run `docker build` command to build the container.

```
docker build -t <hub-user>/<repo-name>:<tag> .
```

Before running the command replace:

1. **hub-user** with your docker hub username, If you don’t have a docker hub account [follow these instructions to create the Docker account](https://docs.docker.com/docker-id/), and use the username of the account you created
2. **repo-name** with the name of the container, you can name it anything you want
3. **tag** this is not required but you can use the `latest` tag

So in our case, the command will look like this:

```bash
docker build -t jsacex/stable-diffusion-ckpt
```

### Push the container[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#push-the-container) <a href="#push-the-container" id="push-the-container"></a>

Next, upload the image to the registry. This can be done by using the Docker hub username, repo name or tag.

```bash
docker push <hub-user>/<repo-name>:<tag>
```

Thus, in this case, the command would look this way:

```bash
docker push jsacex/stable-diffusion-ckpt
```

After the repo image has been pushed to Docker Hub, you can now use the container for running on Bacalhau. But before that you need to check whether your model is a `ckpt` file or not. If your model is a `ckpt` file you can skip to the running on Bacalhau, and if not - the next section describes how to convert your model into the `ckpt` format.

## Converting model weights to CKPT[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#converting-model-weights-to-ckpt) <a href="#converting-model-weights-to-ckpt" id="converting-model-weights-to-ckpt"></a>

To download the convert script:

```bash
wget -q https://github.com/TheLastBen/diffusers/raw/main/scripts/convert_diffusers_to_original_stable_diffusion.py
```

To convert the model weights into `ckpt` format, the `--half` flag cuts the size of the output model from 4GB to 2GB:

```bash
python3 convert_diffusers_to_original_stable_diffusion.py \
    --model_path <path-to-the-model-weights>  \
    --checkpoint_path <path-to-save-the-checkpoint>/model.ckpt \
    --half
```

## Running a Bacalhau Job[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#running-a-bacalhau-job) <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

To do inference on your own checkpoint on Bacalhau you need to first upload it to your public storage, which can be mounted anywhere on your machine. In this case, we will be using [NFT.Storage](https://nft.storage/) (Recommended Option). To upload your dataset using [NFTup](https://nft.storage/docs/how-to/nftup/) drag and drop your directory and it will upload it to IPFS.

After the checkpoint file has been uploaded copy its CID.

{% hint style="warning" %}
Some of the jobs presented in the Examples section may require more resources than are currently available on the demo network. Consider [starting your own network](../../getting-started/create-private-network.md) or running less resource-intensive jobs on the demo network
{% endhint %}

### Structure of the command[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Let's look closely at the command above:

1. `export JOB_ID=$( ... )`: Export results of a command execution as environment variable
2. The `--gpu 1` flag is set to specify hardware requirements, a GPU is needed to run such a job
3. `-i ipfs://QmUCJuFZ2v7KvjBGHRP2K1TMPFce3reTkKVGF2BJY5bXdZ:/model.ckpt`: Path to mount the checkpoint
4. `-- conda run --no-capture-output -n ldm`: since we are using conda we need to specify the name of the environment which we are going to use, in this case it is `ldm`
5. `scripts/txt2img.py`: running the python script
6. `--prompt "a photo of a person drinking coffee"`: the prompt you need to specify the session name in the prompt.
7. `--plms`: the sampler you want to use. In this case we will use the `plms` sampler
8. `--ckpt ../model.ckpt`: here we specify the path to our checkpoint
9. `--n_samples 1`: no of samples we want to produce
10. `--skip_grid`: skip creating a grid of images
11. `--outdir ../outputs`: path to store the outputs
12. `--seed $RANDOM`: The output generated on the same prompt will always be the same for different outputs on the same prompt set the seed parameter to random

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

```bash
export JOB_ID=$(bacalhau docker run \
--gpu 1 \
--timeout 3600 \
--wait-timeout-secs 3600 \
--wait \
--id-only \
-i ipfs://QmUCJuFZ2v7KvjBGHRP2K1TMPFce3reTkKVGF2BJY5bXdZ:/model.ckpt \
jsacex/stable-diffusion-ckpt \
-- conda run --no-capture-output -n ldm python scripts/txt2img.py --prompt "a photo of a person drinking coffee" --plms --ckpt ../model.ckpt --skip_grid --n_samples 1 --skip_grid --outdir ../outputs) 
```

## Checking the State of your Jobs[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau list`:

```bash
bacalhau list --id-filter ${JOB_ID}
```

When it says `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau describe`:

```bash
bacalhau describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir results
bacalhau job get ${JOB_ID} --output-dir results
```

## Viewing your Job Output[​](http://localhost:3000/examples/model-inference/Stable-Diffusion-CKPT-Inference/#viewing-your-job-output) <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

After the download has finished we can see the results in the `results/outputs` folder. We received following image for our prompt:

<figure><img src="../../.gitbook/assets/index_19_0-93ca4dbcb23afc760c01faa65cac5699.png" alt=""><figcaption></figcaption></figure>

# Stable Diffusion on a CPU

## Introduction

[Stable Diffusion](https://github.com/CompVis/stable-diffusion) is an open-source text-to-image model, which generates images from text. It's a cutting-edge alternative to [DALL·E 2](https://openai.com/dall-e-2/) and uses the [Diffusion Probabilistic Model](https://arxiv.org/abs/2102.09672) for image generation. At the core the model generates graphics from text using a [Transformer](https://arxiv.org/abs/1706.03762).

This example demonstrates how to use stable diffusion online on a CPU and run it on the Bacalhau demo network. The first section describes the development of the code and the container. The second section demonstrates how to run the job using Bacalhau.

This model generated the images presented on this page.

## TL;DR​ <a href="#tldr" id="tldr"></a>

```bash
bacalhau docker run ghcr.io/bacalhau-project/examples/stable-diffusion-cpu:0.0.1 \
  -- python demo.py \
  --prompt "cod in space" \
  --output ../outputs/cod.png
```

## Development​ <a href="#development" id="development"></a>

The [original](https://github.com/CompVis/stable-diffusion) text-to-image stable diffusion model was trained on a fleet of GPU machines, at great cost. To use this trained model for inference, you also need to run it on a GPU.

However, this isn't always desired or possible. One alternative is to use a project called [OpenVINO](https://docs.openvino.ai/latest/index.html) from Intel that allows you to convert and optimize models from a variety of frameworks (and ONNX if your framework isn't directly supported) to run on a [supported](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Working_with_devices.html) Intel CPU. This is what we will do in this example.

{% hint style="info" %}
Heads up! This example takes about 10 minutes to generate an image on an average CPU. Whilst this demonstrates it is possible, it might not be practical.
{% endhint %}

### Prerequisites​ <a href="#prerequisites" id="prerequisites"></a>

In order to run this example you need:

1. A Debian-flavoured Linux (although you might be able to get it working on the newest machines)
2. [Docker](https://docs.docker.com/get-docker/)

### Converting Stable Diffusion to a CPU Model Using OpenVINO​ <a href="#converting-stable-diffusion-to-a-cpu-model-using-openvino" id="converting-stable-diffusion-to-a-cpu-model-using-openvino"></a>

First we convert the trained stable diffusion models so that they work efficiently on a CPU with OpenVINO. Choose the fine tuned version of Stable Diffusion you want to use. The example is quite complex, so we have created a [separate repository](https://github.com/js-ts/stable_diffusion.openvino) to host the code. This is a fork from this [Github repository](https://github.com/bes-dev/stable_diffusion.openvino).

In summary, the code downloads a [pre-optimized OpenVINO version](https://huggingface.co/bes-dev/stable-diffusion-v1-4-openvino) of the [original](https://huggingface.co/CompVis/stable-diffusion-v1-4) pre-trained stable diffusion model. This model leverages OpenAI's [CLIP transformer](https://huggingface.co/openai/clip-vit-large-patch14) and is wrapped inside an OpenVINO runtime, which executes the model.

The core code representing these tasks can be found [in the stable\_diffusion\_engine.py file](https://github.com/js-ts/stable_diffusion.openvino/blob/master/stable_diffusion_engine.py). This is a mashup that creates a pipeline necessary to tokenize the text and run the stable diffusion model. This boilerplate could be simplified by leveraging the more recent version of the [diffusers library](https://github.com/huggingface/diffusers). But let's continue.

### Install Dependencies​ <a href="#install-dependencies" id="install-dependencies"></a>

Note that these dependencies are only known to work on Ubuntu-based x64 machines.

```bash
sudo apt-get update
sudo apt-get install -y libgl1 libglib2.0-0 git-lfs
```

#### Clone the Repository and Dependencies​ <a href="#clone-the-repository-and-dependencies" id="clone-the-repository-and-dependencies"></a>

The following commands clone the example repository, and other required repositories, and install the Python dependencies.

```bash
git clone https://github.com/js-ts/stable_diffusion.openvino
cd stable_diffusion.openvino
git lfs install
git clone https://huggingface.co/openai/clip-vit-large-patch14
git clone https://huggingface.co/bes-dev/stable-diffusion-v1-4-openvino
pip3 install -r requirements.txt
```

### Generate an Image​ <a href="#generating-an-image" id="generating-an-image"></a>

Now that we have all the dependencies installed, we can call the `demo.py` wrapper, which is a simple CLI, to generate an image from a prompt.

```bash
cd stable_diffusion.openvino && \
  python3 demo.py \
  --prompt "hello" \
  --output hello.png
```

When the generation is complete, you can open the generated `hello.png` and see something like this:

<figure><img src="../../.gitbook/assets/index_8_0-2b8181632cc5143706e0bd8203496e06.png" alt=""><figcaption></figcaption></figure>

Lets try another prompt and see what we get:

```bash
cd stable_diffusion.openvino && \
  python3 demo.py \
  --prompt "cat driving a car" \
  --output cat.png
```

<figure><img src="../../.gitbook/assets/index_10_0-fea9a9996ca891e993b0f7f5f5cf4d24.png" alt=""><figcaption></figcaption></figure>

## Running Stable Diffusion (CPU) on Bacalhau​ <a href="#running-stable-diffusion-cpu-on-bacalhau" id="running-stable-diffusion-cpu-on-bacalhau"></a>

Now we have a working example, we can convert it into a format that allows us to perform inference in a distributed environment.

First we will create a `Dockerfile` to containerize the inference code. The Dockerfile [can be found in the repository](https://github.com/js-ts/stable_diffusion.openvino/blob/master/Dockerfile), but is presented here to aid understanding.

```docker
FROM python:3.9.9-bullseye

WORKDIR /src

RUN apt-get update && \
    apt-get install -y \
    libgl1 libglib2.0-0 git-lfs

RUN git lfs install

COPY requirements.txt /src/

RUN pip3 install -r requirements.txt

COPY stable_diffusion_engine.py demo.py demo_web.py /src/
COPY data/ /src/data/

RUN git clone https://huggingface.co/openai/clip-vit-large-patch14
RUN git clone https://huggingface.co/bes-dev/stable-diffusion-v1-4-openvino

# download models
RUN python3 demo.py --num-inference-steps 1 --prompt "test" --output /tmp/test.jpg
```

This container is using the `python:3.9.9-bullseye` image and the working directory is set. Next, the Dockerfile installs the same dependencies from earlier in this notebook. Then we add our custom code and pull the dependent repositories.

We've already pushed this image to GHCR, but for posterity, you'd use a command like this to update it:

```bash
docker buildx build --platform linux/amd64 --push -t ghcr.io/bacalhau-project/examples/stable-diffusion-cpu:0.0.1 .
```

### Prerequisites​ <a href="#prerequisites-1" id="prerequisites-1"></a>

To run this example you will need [Bacalhau](broken-reference) installed and running

### Generating an Image Using Stable Diffusion on Bacalhau​ <a href="#generating-an-image-using-stable-diffusion-on-bacalhau" id="generating-an-image-using-stable-diffusion-on-bacalhau"></a>

[Bacalhau](https://www.bacalhau.org/) is a distributed computing platform that allows you to run jobs on a network of computers. It is designed to be easy to use and to run on a variety of hardware. In this example, we will use it to run the stable diffusion model on a CPU.

To submit a job, you can use the Bacalhau CLI. The following command passes a prompt to the model and generates an image in the outputs directory.

{% hint style="info" %}
This will take about 10 minutes to complete. Go grab a coffee. Or a beer. Or both. If you want to block and wait for the job to complete, add the `--wait` flag.

Furthermore, the container itself is about 15GB, so it might take a while to download on the node if it isn't cached.
{% endhint %}

### Structure of the command​ <a href="#structure-of-the-command" id="structure-of-the-command"></a>

{% hint style="warning" %}
Some of the jobs presented in the Examples section may require more resources than are currently available on the demo network. Consider [starting your own network](broken-reference) or running less resource-intensive jobs on the demo network
{% endhint %}

1. `export JOB_ID=$( ... )`: Export results of a command execution as environment variable
2. `bacalhau docker run`: Run a job using docker executor.
3. `--id-only`: Flag to print out only the job id
4. `ghcr.io/bacalhau-project/examples/stable-diffusion-cpu:0.0.1`: The name and the tag of the Docker image.
5. The command to run inference on the model: `python demo.py --prompt "First Humans On Mars" --output ../outputs/mars.png`. It consists of:
   1. `demo.py`: The Python script that runs the inference process.
   2. `--prompt "First Humans On Mars"`: Specifies the text prompt to be used for the inference.
   3. `--output ../outputs/mars.png`: Specifies the path to the output image.

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

```bash
export JOB_ID=$(bacalhau docker run \  
ghcr.io/bacalhau-project/examples/stable-diffusion-cpu:0.0.1 \
--id-only \
-- python demo.py --prompt "First Humans On Mars" --output ../outputs/mars.png)
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

## Viewing your Job Output​ <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

After the download has finished we can see the results in the `results/outputs` folder.

<figure><img src="../../.gitbook/assets/index_24_0-c2e2786333fb3f08d08a6a435084100d.png" alt=""><figcaption></figcaption></figure>

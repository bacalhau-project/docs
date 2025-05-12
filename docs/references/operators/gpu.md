# GPU Workloads

## Overview

Bacalhau supports running jobs on GPUs out of the box. This guide covers how to set up and use GPUs with Bacalhau.

## Supported GPU Types

Bacalhau currently supports:

- NVIDIA GPUs
- AMD GPUs
- Intel GPUs

These are only available with the Docker executor.

## Prerequisites

### Basic Requirements

1. [Docker](https://get.docker.com/) installed
2. Appropriate GPU drivers for your hardware

### GPU-Specific Setup

#### NVIDIA GPUs

1. Install [NVIDIA GPU Drivers](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html)
2. Install [NVIDIA Container Toolkit (nvidia-docker2)](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
3. Verify with `nvidia-smi` command

#### AMD GPUs

1. Install [AMD GPU drivers](https://www.amd.com/en/support/download/drivers.html)
2. Set up Docker for ROCm following [this guide](https://rocm.docs.amd.com/projects/install-on-linux/en/latest/how-to/docker.html)
3. Verify with `rocm-smi` command

#### Intel GPUs

1. Install [Intel GPU drivers](https://www.intel.com/content/www/us/en/download-center/home.html)
2. Set up Docker for Intel GPUs following [this guide](https://github.com/Intel-Media-SDK/MediaSDK/wiki/Running-on-GPU-under-docker)
3. Verify with `xpu-smi` command

## Running GPU Jobs

### Command Line

Use the `--gpu` flag to specify the number of GPUs your job requires:

```bash
bacalhau docker run --gpu=1 nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi
```

### Using YAML

You can also submit GPU jobs using YAML configuration:

```yaml
Name: gpu-test-job
Type: batch
Count: 1
Tasks:
  - Engine:
      Type: docker
      Params:
        Image: 'nvidia/cuda:11.6.2-base-ubuntu20.04'
      Entrypoint:
        - /bin/bash
      Parameters:
        - -c
        - nvidia-smi && echo 'GPU is working!'
    Name: TestGPU
    ResourcesConfig:
      CPU: '1'
      Memory: '1GB'
      Disk: '10GB'
      GPU: '1'
```

## Important Notes

- Your container must include the appropriate CUDA runtime and be compatible with the CUDA version on the node
- GPU access can be controlled using resource limits
- The Bacalhau network must have executor nodes with GPUs exposed

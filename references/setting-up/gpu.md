---
icon: microchip
---

# GPU Workloads Setup

Bacalhau supports GPU workloads. In this tutorial, learn how to run a job using GPU workloads with the Bacalhau client.

## Prerequisites

* The Bacalhau network must have an executor node with a GPU exposed
* Your container must include the CUDA runtime (cudart) and must be compatible with the CUDA version running on the node

## Usage

To submit a job request, use the `--gpu` flag under the `docker run` command to select the number of GPUs your job requires. For example:

```bash
bacalhau docker run --gpu=1 nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi
```

In order to run this as a job, using yaml, execute the following:

```
Name: gpu-test-job
Type: batch
Count: 1
Tasks:
  - Engine:
      Type: docker
      Params:
        Image: "nvidia/cuda:11.6.2-base-ubuntu20.04"
      Entrypoint:
        - /bin/bash
      Parameters:
        - -c
        - nvidia-smi && echo 'GPU is working!'
    Name: TestGPU
    ResourcesConfig: 
      CPU: "1"
      Memory: "1GB"
      Disk: "10GB"
      GPU: "1"
```

## Limitations

The following limitations currently exist within Bacalhau. Bacalhau supports:

* NVIDIA, Intel or AMD GPUs only
* GPUs for the Docker executor only

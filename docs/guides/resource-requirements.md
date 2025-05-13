# Resource Requirements

This guide covers how to specify resource requirements for your jobs and how to configure resource limits on compute nodes.

## Understanding Resources in Bacalhau

Bacalhau manages four key resource types:

| Resource | Description                             | Default          | Example        |
| -------- | --------------------------------------- | ---------------- | -------------- |
| CPU      | Processing power in cores or millicores | 500m (0.5 cores) | `--cpu=2`      |
| Memory   | RAM allocation                          | 1GB              | `--memory=4GB` |
| Disk     | Storage space                           | System dependent | `--disk=10GB`  |
| GPU      | Number of GPUs                          | 0                | `--gpu=1`      |

## For Job Submitters: Requesting Resources

When submitting jobs, you can specify the resources your workload requires. This helps Bacalhau find appropriate compute nodes and allocate sufficient resources.

### Command Line Specification

```bash
# Request specific resources
bacalhau docker run \
  --cpu=2 \
  --memory=4GB \
  --disk=10GB \
  ubuntu:latest -- <your-command>
```

### YAML Job Specification

```yaml
# job.yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Parameters:
          - echo
          - 'Hello, world!'
    Resources:
      CPU: '2'
      Memory: '4GB'
      Disk: '10GB'
      GPU: '1'
```

Submit using:

```bash
bacalhau job run job.yaml
```

### Resource Formats

#### CPU

CPU can be specified in two formats:

- **Decimal cores**: `--cpu=2` (2 CPU cores)
- **Millicores**: `--cpu=500m` (0.5 CPU cores)

```bash
# Examples
bacalhau docker run --cpu=4 python:3.9 -- python cpu_heavy_script.py
bacalhau docker run --cpu=250m alpine -- sleep 60
```

#### Memory

Memory can be specified using different units:

- `MB` or `M` for megabytes
- `GB` or `G` for gigabytes

```bash
# Examples
bacalhau docker run --memory=8GB tensorflow/tensorflow -- python model.py
bacalhau docker run --memory=512MB alpine -- sleep 60
```

#### Disk

For jobs that write large files or process large datasets:

```bash
# Example
bacalhau docker run --disk=20GB ubuntu -- dd if=/dev/zero of=/outputs/large_file bs=1M count=15000
```

#### GPU

For GPU-accelerated workloads:

```bash
# Example
bacalhau docker run --gpu=1 nvidia/cuda:11.6.2-base-ubuntu20.04 -- nvidia-smi
```

## GPU Workloads

### Prerequisites

To run GPU jobs successfully:

1. The Bacalhau network must have compute nodes with GPUs
2. Your container must include CUDA runtime compatible with the node's GPU drivers
3. Use a pre-built GPU container (e.g., from NVIDIA's container registry)

### GPU Type Selection

Request specific GPU types using constraints:

```bash
# Request Tesla T4 GPU
bacalhau docker run \
  --gpu=1 \
  --constraints "GPU-0=Tesla-T4" \
  nvidia/cuda -- nvidia-smi
```

## For Node Operators: Setting Resource Limits

Node operators can configure how much of their system resources are allocated to Bacalhau jobs.

### Configuring Node Resource Limits

| Configuration Key                | Description                    | Default | Format                       |
| -------------------------------- | ------------------------------ | ------- | ---------------------------- |
| Compute.AllocatedCapacity.CPU    | CPU allocation for jobs        | `80%`   | Percentage or absolute value |
| Compute.AllocatedCapacity.Memory | Memory allocation for jobs     | `80%`   | Percentage or absolute value |
| Compute.AllocatedCapacity.Disk   | Disk space allocation for jobs | `80%`   | Percentage or absolute value |
| Compute.AllocatedCapacity.GPU    | GPU allocation for jobs        | `100%`  | Percentage or absolute value |

Values can be expressed as:

- Percentages of total system resources (e.g., `80%`)
- Absolute values (e.g., `16Gi` for memory)

Example `config.yaml` configuration:

```yaml
# config.yaml
Compute:
  AllocatedCapacity:
    CPU: '75%'
    Memory: '16Gi'
    Disk: '80%'
    GPU: '100%'
```

### Setting Default Job Resources

You can configure default resources for jobs that don't specify their own requirements in your `config.yaml` file:

```yaml
# config.yaml
JobDefaults:
  Batch:
    Task:
      Resources:
        Memory: '2Gi'
        CPU: '1'
  Ops:
    Task:
      Resources:
        CPU: '0.5'
```

## Checking Available Resources

View available resources across your network:

```bash
bacalhau node list --show capacity
```

This helps you understand what resources you can reasonably request.

## Troubleshooting

### Common Issues

1. **Job stays in PENDING state**: You may be requesting more resources than any available node can provide
2. **Out of memory (OOM) errors**: Increase memory allocation or optimize your workload
3. **Disk space errors**: Request more disk space or clean up temporary files
4. **CUDA errors with GPU jobs**: Ensure container compatibility with the node's GPU drivers

### Windows Support Limitations

Resource limits have the following limitations on Windows-based nodes:

- Resource limits are not supported for Docker jobs running on Windows
- Limits will be applied at the job bid stage but not enforced at runtime
- Bacalhau assumes all containers are Linux-based

## Best Practices

1. Start with conservative resource estimates and scale up as needed
2. For memory-intensive tasks, add a 20-30% buffer above expected peak usage
3. For disk space, consider both input data size and temporary files
4. Test GPU workloads locally before running on Bacalhau
5. Use monitoring and job logs to fine-tune resource requirements

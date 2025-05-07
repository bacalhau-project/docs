import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Resource Constraints

Configure CPU, memory, disk, and GPU requirements for your Bacalhau jobs to ensure efficient resource utilization.

### CPU & Memory

Specify CPU cores and memory allocation for your jobs. Default values are **CPU: 500m** and **Memory: 512Mb**.

<Tabs>
<TabItem value="Imperative" label="Imperative">
```bash
bacalhau docker run \
  --cpu 1.0 \
  --memory 1gb \
  ubuntu:latest -- cpu-intensive-task
```
</TabItem>

<TabItem value="Declarative" label="Declarative">
```yaml
Type: batch
Count: 1
Tasks:
  - Name: "resource-task"
    Engine:
      Type: "docker"
      Params:
        Image: ubuntu:latest
        Parameters:
        - cpu-intensive-task
    Resources:
      CPU: "1.0"
      Memory: "1gb"
```
</TabItem>
</Tabs>



### GPU Requirements

Request GPU resources for machine learning, deep learning, and other GPU-accelerated tasks.

> **Note:** The compute node must have available GPUs with proper drivers, and your container image should include necessary GPU libraries (e.g., CUDA).

<Tabs>
<TabItem value="Imperative" label="Imperative">
```bash
bacalhau docker run \
  --gpu 1 \
  nvidia/cuda:11.6.2-base-ubuntu20.04 -- nvidia-smi
```

To select specific GPU types, use label selectors:

```bash
bacalhau docker run \
  --gpu 1 \
  --constraints "GPU-0=Tesla-T1" \
  nvidia/cuda:11.6.2-base-ubuntu20.04 -- nvidia-smi
```
</TabItem>

<TabItem value="Declarative" label="Declarative">
```yaml
Type: batch
Count: 1
Constraints:
  - Key: GPU-0
    Operator: =
    Values:
    - Tesla-T1
Tasks:
  - Name: "gpu-task"
    Engine:
      Type: "docker"
      Params:
        Image: "nvidia/cuda:11.6.2-base-ubuntu20.04"
        Parameters: 
          - nvidia-smi
    Resources:
      GPU: "1"
```
</TabItem>
</Tabs>



### Disk Space

Control how much disk space your job can use:

<Tabs>
<TabItem value="Imperative" label="Imperative">
```bash
bacalhau docker run \
  --disk 10gb \
  ubuntu:latest -- dd if=/dev/zero of=/outputs/large_file bs=1M count=8000
```


</TabItem>

<TabItem value="Declarative" label="Declarative">
```yaml
Type: batch
Count: 1
Tasks:
  - Name: "task"
    Engine:
      Type: "docker"
      Params:
        Image: ubuntu:latest
        Parameters:
        - dd
        - if=/dev/zero
        - of=/outputs/large_file
        - bs=1M
        - count=8000
    Resources:
      Disk: 10gb
```
</TabItem>
</Tabs>



### Common Issues

* **Job Stuck Pending**: You may be requesting resources that aren't available. Check available resources with `bacalhau node list` or reduce requirements.
* **Out of Memory (OOM)**: Increase memory allocation or process data in smaller batches.
* **Disk Space Issues**: Increase disk allocation or clean up temporary files during processing.

### Best Practices

* Start with conservative resource requests and scale up as needed
* For memory-intensive tasks, add a 20-30% buffer to your estimated peak usage
* Check if your framework can effectively use multiple GPUs before requesting them


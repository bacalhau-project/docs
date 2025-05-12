# Queueing

## Introduction

Job Queueing allows Bacalhau to handle situations when there are no suitable nodes available to execute a job. You can configure a time period during which the job will wait for suitable nodes to become available or free up. This feature enables better flexibility and reliability in managing your distributed workloads.

## Configuring Job Queueing

The job queueing feature is not automatically enabled and needs to be explicitly set in your [Job specification](/docs/specifications/job) or node configuration using the `QueueTimeout` parameter. This parameter activates the queueing feature and defines the amount of time your job should wait for available nodes.

Node availability is determined by capacity as well as job constraints such as label selectors, engines, or publishers. For example, jobs will be queued if all nodes are currently busy, or if idle nodes do not match parameters in your job specification.

:::info
Bacalhau compute nodes regularly update their [node, resource and health information](/docs/references/operators/node-management.md) every 30 seconds to the orchestrator nodes. During this update period, multiple jobs may be allocated to a node, potentially exceeding its immediate available capacity. A local job queue is created at the compute node, efficiently handling the high demand as resources become available over time.
:::

## How It Works

You can set default queueing behavior for all jobs by defining the `QueueTimeout` parameter in the node's configuration file. Alternatively, within the job specification, you can include the `QueueTimeout` parameter directly in the configuration YAML. This flexibility allows you to tailor the queueing behavior to meet the specific needs of your distributed computing environment.

### Orchestrator Node

Here's an example orchestrator node configuration that sets the default job queueing retry interval for an hour:

```yaml
Orchestrator:
  Scheduler:
    QueueBackoff: 1h
```

:::info
The `QueueBackoff` parameter determines how frequently the scheduler will retry assigning queued jobs to compute nodes.
:::

### Job Specification

Here's a sample job specification setting the `QueueTimeout` for this specific job, overriding any node defaults:

```yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - sleep 90
    Timeouts:
      QueueTimeout: 1800
```

### CLI Command

You can also define timeouts for your jobs directly through the CLI using the `--queue-timeout` flag. This provides a convenient way to specify queueing behavior on a per-job basis without modifying configuration files:

```bash
bacalhau docker run ubuntu sleep 90 --queue-timeout 1800
```

:::warning
Timeouts in Bacalhau are generally governed by the `TotalTimeout` value for your YAML specifications and the `--timeout` flag for your CLI commands. The default total timeout value is 30 minutes. Setting a queue timeout larger than the total timeout without increasing the total timeout value will result in a validation error.
:::

## Monitoring Queued Jobs

Jobs will be queued when all available nodes are busy or when there is no node that matches your job specifications. Let's look at how you can monitor queued jobs.

Queued jobs will initially display the `Queued` status. Using the `bacalhau job describe` command will show both the state of the job and the reason behind queueing.

For busy nodes:

```bash
ID            = j-d740ba46-b135-4161-bd79-795c94d215b0
Name          = j-d740ba46-b135-4161-bd79-795c94d215b0
Namespace     = default
Type          = batch
State         = Queued
Message       = Job queued. not enough nodes to run job. requested: 1, available: 3, suitable: 0.
• Node n-b75224b7: node busy with available capacity {CPU: 0.2, Memory: 12 GB, Disk: 79 GB, GPU: 0}
  and queue capacity {CPU: 2, Memory: 4.0 GB, Disk: 0 B, GPU: 0}
• Node n-d42422fd: node busy with available capacity {CPU: 0.2, Memory: 12 GB, Disk: 83 GB, GPU: 0}
  and queue capacity {CPU: 3, Memory: 1.0 GB, Disk: 0 B, GPU: 0}
• Node n-f50db1f9: node busy with available capacity {CPU: 0.2, Memory: 12 GB, Disk: 83 GB, GPU: 0}
```

For no matching nodes:

```bash
ID            = j-0dda82b7-ad5a-4b96-b675-728c5f54f4c9
Name          = j-0dda82b7-ad5a-4b96-b675-728c5f54f4c9
Namespace     = default
Type          = batch
State         = Queued
Message       = Job queued. not enough nodes to run job. requested: 1, available: 4, suitable: 0.
• 3 of 4 nodes: labels map[Architecture:amd64 Operating-System:linux owner:bacalhau]
  don't match required selectors [name = walid]
• Node Qma5yQAk: labels map[Architecture:amd64 GPU-0:Tesla-T4 GPU-0-Memory:15360-MiB
  Operating-System:linux owner:bacalhau] don't match required selectors [name = walid]
```

Once appropriate node resources become available, these jobs will transition to either a `Running` or `Completed` status, allowing more jobs to be assigned to matching nodes.

Here's an example of a job's lifecycle from queued to completed:

```bash
ID            = j-0dda82b7-ad5a-4b96-b675-728c5f54f4c9
Name          = j-0dda82b7-ad5a-4b96-b675-728c5f54f4c9
Namespace     = default
Type          = batch
State         = Completed
Count         = 1
Created Time  = 2024-06-24 13:36:40
Modified Time = 2024-06-24 13:41:40
Version       = 0


Summary
Completed = 1


Job History
 TIME                 REV.  STATE      TOPIC       EVENT
 2024-06-24 13:36:40  1     Pending    Submission  Job submitted
 2024-06-24 13:36:40  2     Queued     Queueing    Job queued. not enough nodes to run job. requested: 1,
                                                   available: 4, suitable: 0.
                                                   • 3 of 4 nodes: labels map[Architecture:amd64
                                                   Operating-System:linux owner:bacalhau]
                                                   don't match required selectors [name = walid]
                                                   • Node Qma5yQAk: labels map[Architecture:amd64
                                                   GPU-0:Tesla-T4 GPU-0-Memory:15360-MiB
                                                   Operating-System:linux owner:bacalhau]
                                                   don't match required selectors [name = walid]
 2024-06-24 13:39:40  3     Running
 2024-06-24 13:41:40  4     Completed


Executions
 ID          NODE ID     STATE      DESIRED  REV.  CREATED   MODIFIED  COMMENT
 e-88cb1c72  n-73426e31  Completed  Stopped  6     6m5s ago  4m4s ago  Accepted job


Execution e-88cb1c72 History
 TIME                 REV.  STATE              TOPIC            EVENT
 2024-06-24 13:39:40  1     New
 2024-06-24 13:39:40  2     AskForBid
 2024-06-24 15:39:40  3     AskForBidAccepted  Requesting Node  Accepted job
 2024-06-24 13:39:40  4     AskForBidAccepted
 2024-06-24 13:39:40  5     BidAccepted
 2024-06-24 13:41:40  6     Completed
```

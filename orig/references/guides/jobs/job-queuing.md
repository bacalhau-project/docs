---
icon: pipe-valve
---

# Queuing

## Introduction

Efficient job management and resource optimization are significant considerations. In our continued effort to support scalable distributed computing and data processing, we are excited to introduce job queuing in Bacalhau `v1.4.0`.

{% hint style="info" %}
The Job Queuing feature was only added to the Bacalhau in version 1.4 and is not supported in previous versions. Consider upgrading to the latest version to optimize resource usage with Job Queuing.
{% endhint %}

Job Queuing allows to deal with the situation when there are no suitable nodes available on the network to execute a job. In this case, a user-defined period of time can be configured for the job, during which the job will wait for suitable nodes to become available or free in the network. This feature enables better flexibility and reliability in managing your distributed workloads.

## Configuring Job Queuing in your Network&#x20;

The job queuing feature is not automatically enabled, and it needs to be explicitly set in your [Job specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/job) or requester node using the `QueueTimeout` parameter. This parameter activates the queuing feature and defines the amount of time your job should wait for available nodes in the network.&#x20;

Node availability in your network is determined by capacity as well as job constraints such as label selectors, engines or publishers. For example, jobs will be queued if all nodes are currently busy, as well as if idle nodes do not match parameters in your job specification.

{% hint style="info" %}
Bacalhau compute nodes regularly update their [node, resource and health information](../../setting-up/node_management.md#compute-node-updates) every 30 seconds to the requester nodes in the network. During this update period, multiple jobs may be allocated to a node, oversubscribing and potentially exceeding its immediate available capacity. A local job queue is created at the compute node, efficiently handling the high demand as resources become available over time.
{% endhint %}

## How does it work?

At the requester node level, you can set default queuing behavior for all jobs by defining the `QueueTimeout` parameter in the node's configuration file. Alternatively, within the job specification, you can include the `QueueTimeout` parameter directly in the configuration YAML. This flexibility allows you to tailor the queuing behavior to meet the specific needs of your distributed computing environment, ensuring that jobs are efficiently managed and resources are optimally utilized.

### Requester Node

Here’s an example requester node configuration that sets the default job queuing time for an hour

```yaml
Node:
    Requester:
        JobDefaults:
            QueueTimeout: 1800s
        Scheduler:
            QueueBackoff: 1m0s
```

{% hint style="info" %}
The `QueueBackoff` parameter determines the interval between retry attempts by the requester node to assign queued jobs.
{% endhint %}

### Job Specification

Here’s a sample job specification setting the `QueueTimeout` for this specific job, overwriting any node defaults.

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

You can also define timeouts for your jobs directly through the CLI using the `--queue-timeout` flag. This method provides a convenient way to specify queuing behavior on a per-job basis, allowing you to manage job execution dynamically without modifying configuration files.

For example, here is how you can submit a job with a specified queue timeout using the CLI:&#x20;

```bash
bacalhau docker run ubuntu sleep 90 --queue-timeout 1800
```

{% hint style="warning" %}
Timeouts in Bacalhau are generally governed by the `TotalTimeout` value for your yaml specifications and the `--timeout` flag for your CLI commands. The default total timeout value is 30 minutes. Declaring any queue timeout that is larger than that without changing the total timeout value will result in a validation error.&#x20;
{% endhint %}

## Executing Job Queuing in Bacalhau&#x20;

Jobs will be queued when all available nodes are busy and when there is no node that matches your job specifications. Let’s take a look at how queuing will be executed within your network.

Queued Jobs will initially display the `Queued` status. Using the `bacalhau job describe` command will showcase both the state of the job and the reason behind queuing.

For busy nodes:

```bash
ID            = j-d740ba46-b135-4161-bd79-795c94d215b0
Name          = j-d740ba46-b135-4161-bd79-795c94d215b0
Namespace     = default
Type          = batch
State         = Queued
Message       = Job queued. not enough nodes to run job. requested: 1, available: 3, suitable: 0.
• Node n-b75224b7: node busy with available capacity {CPU: 0.20000000000000018, Memory: 12 GB, Disk: 79 GB, GPU: 0} and queue capacity {CPU: 2, Memory: 4.0 GB, Disk: 0 B, GPU: 0}
• Node n-d42422fd: node busy with available capacity {CPU: 0.20000000000000018, Memory: 12 GB, Disk: 83 GB, GPU: 0} and queue capacity {CPU: 3, Memory: 1.0 GB, Disk: 0 B, GPU: 0}
• Node n-f50db1f9: node busy with available capacity {CPU: 0.20000000000000018, Memory: 12 GB, Disk: 83 GB, GPU: 0}
```

For no matching nodes in the network:

```bash
ID            = j-0dda82b7-ad5a-4b96-b675-728c5f54f4c9
Name          = j-0dda82b7-ad5a-4b96-b675-728c5f54f4c9
Namespace     = default
Type          = batch
State         = Queued
Message       = Job queued. not enough nodes to run job. requested: 1, available: 4, suitable: 0.
• 3 of 4 nodes: labels map[Architecture:amd64 Operating-System:linux owner:bacalhau] don't match required selectors [name = walid]
• Node Qma5yQAk: labels map[Architecture:amd64 GPU-0:Tesla-T4 GPU-0-Memory:15360-MiB Operating-System:linux owner:bacalhau] don't match required selectors [name = walid]
```

Once appropriate node resources become available, these jobs will transition to either a `Running` or `Completed` status, allowing more jobs to be assigned to matching nodes.

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
 2024-06-24 13:36:40  2     Queued     Queueing    Job queued. not enough nodes to run job. requested: 1, avail
                                                   able: 4, suitable: 0.
                                                   • 3 of 4 nodes: labels map[Architecture:amd64 Operating-Syst
                                                   em:linux owner:bacalhau] don't match required selectors [nam
                                                   e = walid]
                                                   • Node Qma5yQAk: labels map[Architecture:amd64 GPU-0:Tesla-T
                                                   4 GPU-0-Memory:15360-MiB Operating-System:linux owner:bacalh
                                                   au] don't match required selectors [name = walid]
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

## Support & Feedback

As Bacalhau continues to evolve, our commitment to making distributed computing and data processing more accessible and efficient remains strong. We want to hear what you think about this feature so that we can make Bacalhau better and meet all the diverse needs and requirements of you, our users.

For questions, feedback, please reach out in our [Slack](https://bacalhauproject.slack.com/).

\

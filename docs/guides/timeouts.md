# Timeouts

This guide explains how Bacalhau uses timeouts to manage job execution duration, protecting both users and compute resources from problematic jobs.

## Understanding Timeouts

Timeouts in Bacalhau set limits on how long a job can run before being automatically terminated. They serve several important purposes:

1. **Resource Protection**: Prevent runaway jobs from consuming resources indefinitely
2. **Fair Scheduling**: Ensure compute nodes remain available for other jobs
3. **Error Recovery**: Help identify and abort jobs that are stuck in infinite loops
4. **QoS Management**: Allow operators to define service levels for different job types

## Timeout Types

Bacalhau supports several types of timeouts:

| Timeout Type | Description |
|--------------|-------------|
| Execution Timeout | Maximum time a job can spend in execution |
| Queue Timeout | Maximum time a job can wait for resources |
| Total Timeout | Overall maximum lifespan of a job including queue time |

## For Job Submitters: Setting Timeouts

When submitting jobs, you can specify timeouts to control job duration.

### Command Line Specification

```bash
# Set execution timeout to 30 minutes (1800 seconds)
bacalhau docker run --timeout 1800 ubuntu:latest -- <long-running-command>

# Set queue timeout (how long to wait for resources)
bacalhau docker run --queue-timeout 600 ubuntu:latest -- <command>
```

### YAML Job Specification

```yaml
# timeout-job.yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Parameters:
          - sleep
          - "300"
    Timeouts:
      ExecutionTimeout: 1800  # 30 minutes in seconds
      QueueTimeout: 600       # 10 minutes in seconds
```

Submit using:

```bash
bacalhau job run timeout-job.yaml
```

### Timeout Behavior

Different timeout types affect job execution in different ways:

- **Execution Timeout**: When reached, the current execution is terminated. If the Total Timeout hasn't been reached, the job may be rescheduled on another available node.

- **Total Timeout**: When reached, the job is completely terminated across all nodes, no results are published, and the job status is marked as `Failed` with a timeout message.

- **Queue Timeout**: When reached, a job waiting for resources will fail rather than continue waiting indefinitely.

This approach provides resilience for intermittent failures while still protecting the system from problematic jobs.

## For Node Operators: Configuring Timeout Limits

Compute node operators can configure default and maximum timeout values for their nodes.

### Node Timeout Configuration

Node operators can set default and maximum timeouts in the `config.yaml` file:

```yaml
# config.yaml
JobDefaults:
  Batch:
    Task:
      Timeouts:
        # Default timeout for batch jobs (1 hour)
        ExecutionTimeout: "1h" 
        # Maximum allowed timeout (4 hours)
        TotalTimeout: "4h"
  Ops:
    Task:
      Timeouts:
        # Default timeout for ops jobs (30 minutes)
        ExecutionTimeout: "30m"
        # Maximum allowed timeout (2 hours)
        TotalTimeout: "2h"
```

### Configuration Format

Timeout values should be specified with a numeric value followed by a time unit:
- `s` for seconds
- `m` for minutes
- `h` for hours

For example: `30m`, `2h`, or `3600s`

### Job Type Support

Timeouts can be configured for these job types:
- Batch jobs
- Ops jobs

Note: Timeout configuration is not available for Daemon and Service jobs, which are designed to run continuously.

## Queue Timeouts

Queue timeouts control how long a job will wait for suitable resources before failing:

```bash
# Set queue timeout to 15 minutes
bacalhau docker run --queue-timeout 900 ubuntu -- <command>
```

In YAML:
```yaml
Timeouts:
  QueueTimeout: 900  # seconds
```

This is useful when:
- Your job has specific resource requirements
- You want to fail fast if resources aren't available
- You have time-sensitive workloads

## Balancing Timeout Values

Setting appropriate timeouts requires balancing several factors:

1. **Job Duration**: How long your job actually needs to run
2. **Resource Usage**: Longer timeouts tie up resources for extended periods
3. **Network Stability**: Account for possible interruptions or slowdowns
4. **Data Size**: Consider the size of input/output data when setting timeouts

## Best Practices

1. **Set Realistic Timeouts**: Allow enough time for your job to complete, plus a buffer
2. **Use Queue Timeouts**: For time-sensitive jobs, set reasonable queue timeouts
3. **Test and Adjust**: Monitor job execution times and refine timeout values
4. **Document Timeout Requirements**: Include timeout information in job documentation
5. **Consider Resource Impact**: Shorter timeouts help prevent resource monopolization

## Troubleshooting

If your jobs are timing out unexpectedly:

1. **Review Job Logs**: Check logs to understand where time is being spent
2. **Optimize Performance**: Look for ways to speed up your job
3. **Check Resource Allocation**: Insufficient resources can slow job execution
4. **Segment Large Jobs**: Break very large jobs into smaller, faster parts
5. **Verify Node Settings**: Node operators may have maximum timeout limits
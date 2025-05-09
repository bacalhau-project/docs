---
sidebar_position: 70
---
# Stopping a Job

Sometimes you need to terminate a running job before it completes naturally. Bacalhau provides a straightforward way to stop jobs in progress.

### Stopping a Running Job

To stop a job that's currently running:

```bash
bacalhau job stop <jobID>
```

#### How It Works

When you issue a stop command:

1. The Bacalhau orchestrator marks the job for termination
2. A signal is sent to all compute nodes running tasks for that job
3. The compute nodes terminate the running containers
4. Resources allocated to the job are released
5. The job's state is updated to `Stopped`

#### Verifying Termination

To confirm a job has been properly stopped:

```bash
bacalhau job describe <jobID>
```

Look for the `State` field, which should show `Stopped` once the termination is complete.

### When to Stop a Job

Common scenarios where stopping a job is necessary:

* **Stuck or Misconfigured Jobs**: Jobs that are stuck in a loop, using incorrect data, or producing errors
* **Resource Optimization**: When a job is too resource-intensive or taking too long
* **Prioritization Changes**: When higher-priority work arrives and you need to free up resources
* **Service Jobs**: For jobs designed to run continuously, the `stop` command is especially useful when the service is no longer needed

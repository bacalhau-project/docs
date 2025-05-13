---
sidebar_position: 50
---

# Retrieving Logs

After submitting a job to Bacalhau, you'll typically need to inspect its execution logs to monitor progress and troubleshoot issues. This guide explains how to access and manage logs from your Bacalhau jobs.

## What You'll Learn

- How to view job execution logs
- How to stream logs in real-time during job execution
- How to filter logs for specific executions

## Execution Logs

Execution logs contain the standard output (stdout) and standard error (stderr) from your job, which are invaluable for monitoring and debugging.

### Basic Log Retrieval

To view the logs for a completed or running job:

```bash
bacalhau job logs <jobID>
```

This displays stdout/stderr from the container execution, showing you exactly what your job printed during its run.

### Real-Time Log Streaming

For long-running jobs, you can stream logs as they're generated:

```bash
bacalhau job logs --follow <jobID>
```

This is similar to `tail -f` and will continuously show new log entries until you press Ctrl+C or the job completes.

### Filtering Logs

If your job has multiple parallel executions, you can focus on a specific one:

```bash
bacalhau job logs --execution-id <execID> <jobID>
```

You can find execution IDs by running `bacalhau job describe <jobID>`.

### Tailing Logs

To view only the most recent log entries:

```bash
bacalhau job logs --tail <jobID>
```

## Following Logs During Job Submission

When submitting a new job, you can immediately follow the logs by adding the `--follow` flag to your job run command:

```bash
bacalhau job run ./job.yaml --follow
```

This is convenient as it combines job submission and log following into a single command, eliminating the need to run a separate `job logs` command.

For docker run commands, you can similarly use:

```bash
bacalhau docker run --follow ubuntu:latest -- echo "Hello World"
```

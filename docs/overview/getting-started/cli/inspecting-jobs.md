# Inspecting Jobs

Once you've submitted jobs to Bacalhau and identified them through job listing, you'll often need to dig deeper into specific jobs. This guide covers the commands for getting detailed information about your jobs.

### What You'll Learn

* How to view comprehensive details about a specific job
* How to track a job's history and state changes
* How to examine individual job executions

### Describing a Job

To see complete details about a specific job, use:

```bash
bacalhau job describe <job-id>
```

Replace `<job-id>` with your actual job ID. You can use the full ID or just the first few characters (if they uniquely identify the job).

#### Sample Output

```
ID            = j-1efa8fb5-a3ce-4c15-8660-e6c5cd4fe981
Name          = hello-bacalhau
Namespace     = default
Type          = batch
State         = Completed
Count         = 1
Created Time  = 2025-03-01 16:11:20
Modified Time = 2025-03-01 16:11:20
Version       = 0

Summary
Completed = 1

Job History
 TIME                 TOPIC         EVENT
 2025-03-01 16:11:20  Submission    Job submitted
 2025-03-01 16:11:20  State Update  Running
 2025-03-01 16:11:20  State Update  Completed

Executions
 ID          NODE ID     STATE      DESIRED  REV.  CREATED     MODIFIED    COMMENT
 e-5f62dd5d  n-1af42f75  Completed  Stopped  4     14m19s ago  14m18s ago  Running

Execution e-5f62dd5d History
 TIME                 TOPIC       EVENT
 2025-03-01 16:11:20  Scheduling  Requested execution on n-1af42f75
 2025-03-01 16:11:20  Execution   Running
 2025-03-01 16:11:20  Execution   Completed successfully

Standard Output
Hello from a YAML spec!

```

The output shows you:

* Basic job information (ID, name, type, state)
* Summary of job completion status
* Job history timeline
* Execution details on which nodes ran the job
* Execution history showing state changes
* Standard output from the job execution

### Customizing the Output Format

Change the output format for easier parsing or integration with other tools:

```bash
# Get YAML output
bacalhau job describe <job-id> --output yaml

# Get pretty-printed JSON
bacalhau job describe <job-id> --output json --pretty
```

### Tracking Job History

To see how a job's state has changed over time:

```bash
bacalhau job history <job-id>
```

The history shows important events like state transitions and execution updates.

#### Filtering History Events

Filter history by event type:

```bash
# Show only job-level events
bacalhau job history <job-id> --event-type job

# Show only execution-level events
bacalhau job history <job-id> --event-type execution
```

Filter by a specific execution:

```bash
bacalhau job history <job-id> --execution-id <execution-id>
```

### Viewing Job Executions

For jobs that run on multiple nodes or have multiple attempts, check the executions:

```bash
bacalhau job executions <job-id>
```

Each execution represents an instance of your job running on a specific node.

#### Customizing Execution List

```bash
# Sort by state
bacalhau job executions <job-id> --order-by state

# Get full details without truncation
bacalhau job executions <job-id> --wide

# Get in alternative format
bacalhau job executions <job-id> --output yaml
```


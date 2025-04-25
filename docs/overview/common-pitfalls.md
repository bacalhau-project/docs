# Common Pitfalls

## Common Pitfalls

This page provides a quick reference for common issues encountered by Bacalhau users and their solutions. Identifying and avoiding these pitfalls will help you create more reliable jobs and workflows.

### What You'll Learn

* How to diagnose and resolve common Bacalhau job issues
* Strategies for debugging stuck, failed, or misbehaving jobs
* Best practices to prevent common problems

### Jobs Stuck in Pending State

One of the most common issues is jobs remaining in the "Pending" state and never executing.

#### Possible Causes

* **No available nodes**: No compute nodes are connected to the orchestrator
* **Resource constraints too high**: Requesting more CPU, memory, or GPU than any available node can provide
* **Mismatched node selector**: Job requirements don't match available node capabilities
* **Network partitioning**: Orchestrator can't communicate with compute nodes

#### Diagnosis

Check the job status and specifications for clues:

```bash
bacalhau job describe <jobID>
# For more detailed information in YAML format
bacalhau job describe <jobID> --output yaml
```

Look for status messages that might indicate scheduling issues.

Check available compute nodes:

```bash
bacalhau node list
```

Ensure there are active compute nodes with sufficient resources.

#### Solutions

1. **Reduce resource requests**: Lower CPU, memory, or GPU requirements
2. **Add more compute nodes**: Add capacity to your cluster
3. **Check network connectivity**: Ensure nodes can communicate with each other
4. **Modify job requirements**: Adjust constraints to match available resources

### Input Data Access Issues

Problems accessing or mounting input data are another common source of failures.

#### Possible Causes

* **Wrong path or URL**: Incorrect or inaccessible source location
* **Missing credentials**: No or invalid authentication for S3 or private URLs
* **Network limitations**: Compute node can't reach data source
* **Path mapping errors**: Incorrect source-to-destination mapping

#### Diagnosis

Check job specs and status:

```bash
bacalhau job describe <jobID> --output yaml
```

If the job started but failed during execution, check logs:

```bash
bacalhau job logs <jobID>
```

Look for messages like "file not found" or "access denied".

#### Solutions

1. **Validate paths**: Double-check that source paths, URLs, or S3 buckets exist and are accessible
2. **Check credentials**: Ensure proper environment variables or configuration for authenticated sources
3. **Test connectivity**: Verify the compute node can reach the data source
4. **Local testing**: Test data access locally before running on Bacalhau

Example of corrected input mounting:

```bash
# INCORRECT (missing file)
bacalhau docker run --input /path/does/not/exist:/data ubuntu:latest -- cat /data/file.txt

# CORRECT
bacalhau docker run --input /path/that/exists:/data ubuntu:latest -- cat /data/file.txt
```

### No Output Found

Jobs complete successfully, but expected output files are missing.

#### Possible Causes

* **Wrong output path**: Not writing to the `/outputs` directory
* **Command errors**: The job ran but the command failed to produce output
* **Permission issues**: Container user can't write to output location
* **Publisher configuration**: Publisher not configured correctly

#### Diagnosis

Check job specification and execution details:

```bash
bacalhau job describe <jobID> --output yaml
```

If the job executed, check logs for clues about what the job did:

```bash
bacalhau job logs <jobID>
```

Verify your job actually wrote to the `/outputs` directory.

#### Solutions

1. **Use absolute paths**: Always use absolute paths in your commands
2. **Write to `/outputs`**: Ensure your job writes to the `/outputs` directory specifically
3. **Add debugging**: Add commands to list directories and print current working directory
4. **Check permissions**: Ensure your process has permission to write to the output location

Example of corrected output writing:

```bash
# INCORRECT (writing to wrong location)
bacalhau docker run ubuntu:latest -- echo "Hello" > result.txt

# CORRECT
bacalhau docker run ubuntu:latest -- bash -c 'echo "Hello" > /outputs/result.txt'
```

### Container Errors

Issues with container execution or container image availability.

#### Possible Causes

* **Image not found**: The specified container image doesn't exist or is inaccessible
* **Command errors**: The command specified doesn't exist in the container
* **Resource limitations**: The container runs out of resources during execution
* **Exit codes**: The container process exits with a non-zero code

#### Diagnosis

Check job specification for container configuration:

```bash
bacalhau job describe <jobID> --output yaml
```

If the container started, check logs for execution errors:

```bash
bacalhau job logs <jobID>
```

Look for messages about image pulling or command execution.

#### Solutions

1. **Verify image exists**: Check that the image name is correct and accessible
2. **Test locally**: Try running the container locally with Docker first
3. **Check command**: Ensure the command exists in the container and has correct syntax
4. **Adjust resources**: Provide sufficient CPU, memory, and disk for your workload

Example of corrected container image:

```bash
# INCORRECT (typo in image name)
bacalhau docker run ubuntuu:latest -- echo "Hello"

# CORRECT
bacalhau docker run ubuntu:latest -- echo "Hello"
```

### Resource Exhaustion

Jobs fail because they run out of resources during execution.

#### Possible Causes

* **Out of memory (OOM)**: Job exceeds allocated memory
* **Disk space exhaustion**: Job writes more data than allocated disk space
* **CPU thrashing**: Insufficient CPU allocation causes extreme slowdown
* **GPU memory errors**: CUDA out of memory errors for GPU jobs

#### Diagnosis

Check job specification and status:

```bash
bacalhau job describe <jobID> --output yaml
```

If the job executed, check logs for error messages:

```bash
bacalhau job logs <jobID>
```

Look for error messages about memory, disk space, or resource limits.

#### Solutions

1. **Increase resources**: Allocate more memory, CPU, or disk space
2. **Optimize code**: Reduce resource usage in your application
3. **Process in batches**: Break large workloads into smaller chunks
4. **Clean up temporary files**: Remove unneeded files during processing

Example of increased resource allocation:

```bash
# Increased memory allocation
bacalhau docker run --memory 4GB python:3.9 -- python memory_intensive_script.py

# Increased disk space
bacalhau docker run --disk 20GB ubuntu:latest -- dd if=/dev/zero of=/outputs/large_file bs=1M count=15000
```

### Command Line Parsing Issues

Problems related to how commands and arguments are passed to containers.

#### Possible Causes

* **Missing separator**: No `--` between Bacalhau flags and container command
* **Quote handling**: Issues with shell quotes and argument passing
* **Special characters**: Problems with special characters in commands

#### Diagnosis

Check the exact command being executed:

```bash
bacalhau job describe <jobID> --output yaml
```

Look at the command fields to see what was actually executed.

#### Solutions

1. **Use the separator**: Always use `--` between Bacalhau flags and the container command
2. **Quote properly**: Be careful with nested quotes in shell commands
3. **Use bash -c**: For complex commands, wrap them in `bash -c '...'`
4. **Use yaml specs**: For very complex commands, use declarative YAML specifications

Example of corrected command syntax:

```bash
# INCORRECT (missing separator)
bacalhau docker run ubuntu:latest echo "Hello"

# CORRECT
bacalhau docker run ubuntu:latest -- echo "Hello"

# CORRECT (complex command)
bacalhau docker run ubuntu:latest -- bash -c 'for i in {1..5}; do echo "Number $i"; done > /outputs/result.txt'
```


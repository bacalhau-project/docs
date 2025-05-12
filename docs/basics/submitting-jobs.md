---
sidebar_position: 20
---
# Submitting Jobs

This guide introduces the basics of submitting jobs to Bacalhau. Whether you're running a quick task or setting up a more complex job, you'll learn the essential approaches.

## What You'll Learn

* How to run quick jobs with simple commands
* How to create reusable job specifications
* Basic job configuration options

## Quick Jobs: Command Line Approach

The fastest way to run a job is using the `bacalhau docker run` command. This is perfect for simple tasks or when you're just getting started.

```bash
bacalhau docker run \
  ubuntu:latest \
  -- echo "Hello from Bacalhau"
```

By default, this runs a batch job (one-time execution). You can also run ops jobs using `--target all`.

```bash
bacalhau docker run \
  --target all \
  ubuntu:latest \
  -- echo "Running as an ops job"
```

### Key Options

* `--cpu 0.5`: Request half a CPU core
* `--memory 512mb`: Request 512MB of memory
* `--id-only`: Show just the job ID (useful for scripts)

:::tip
Everything after the `--` is executed inside the container.
:::

## Reusable Jobs: YAML Specification

For jobs you'll run multiple times or want to save, create a YAML specification file:

```yaml
# hello-job.yaml
Name: "hello-bacalhau"
Type: batch
Count: 1
Tasks:
  - Name: "task1"
    Engine:
      Type: "docker"
      Params:
        Image: "ubuntu:latest"
        Entrypoint:
          - "echo"
          - "Hello from a YAML spec!"
```

Submit it with:

```bash
bacalhau job run hello-job.yaml
```

This approach helps you:

* Save job configurations for later use
* Share job definitions with teammates
* Make small changes without retyping everything

:::info
Find out more about the possibilities of jobs in [the job specification reference](/specifications/job/README.md).
:::

## Job Types and Choosing Methods

Bacalhau supports several job types:

* **batch**: One-time execution (default for command line)
* **ops**: Administrative tasks targeting specific nodes (use `--target all` to run on all nodes)
* **service**: Long-running services that run on any _N_ nodes
* **daemon**: Background processes that run continuously on all nodes

**Important:** Service and daemon jobs can only be created using YAML specifications as they're designed for repeatable or updatable workloads.

### When to Choose Each Method

* **Use the command line** for:
  * Quick, one-time batch jobs
  * Simple ops jobs with `--target all`
* **Use YAML files** when:
  * Running service or daemon jobs
  * Creating repeatable job configurations
  * Sharing job definitions with teammates

# Running Locally with Devstack

Bacalhau's devstack provides a quick way to spin up a local testing environment with multiple nodes. This is perfect for development, testing, or simply exploring Bacalhau's capabilities without setting up a full production environment.

## Prerequisites

- **Docker Engine**: Must be installed and running
- **Bacalhau**: Latest version installed

## Installation

If you haven't installed Bacalhau yet:

```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```

## Starting the Devstack

Starting a local devstack is as simple as:

```bash
bacalhau devstack
```

When initialization completes, you'll see a confirmation message:

```
Devstack is ready!
No. of requester only nodes: 1
No. of compute only nodes: 3
No. of hybrid nodes: 0
```

## Using Your Devstack

By default, devstack configures the orchestrator to run on the standard port (1234), so you can immediately use it without additional settings. Open a new terminal window and test your connection:

```bash
bacalhau node list
```

You should see the nodes in your devstack:

```
ID      TYPE       APPROVAL  STATUS     LABELS                                   
node-0  Requester  APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux
                                        env=devstack id=node-0 name=node-0       
node-1  Compute    APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux
                                        env=devstack id=node-1 name=node-1       
node-2  Compute    APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux
                                        env=devstack id=node-2 name=node-2       
node-3  Compute    APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux
                                        env=devstack id=node-3 name=node-3       
```

## Running a Simple Job

Submit a simple job to test your devstack:

```bash
bacalhau docker run alpine echo "hello devstack"
```

Note that no publisher is needed for basic testing - Bacalhau will handle the job execution without storing results to any external location.

## Advanced Configuration

Devstack accepts the same configuration options as the `bacalhau serve` command. Here are some useful configuration examples:

### Customizing Resource Limits

Limit the CPU and memory allocation for compute nodes:

```bash
bacalhau devstack -c Compute.AllocatedCapacity.CPU="50%" -c Compute.AllocatedCapacity.Memory="2Gi"
```

### Configuring Job Defaults

Set default resource requirements for all batch jobs:

```bash
bacalhau devstack -c JobDefaults.Batch.Task.Resources.CPU="250m" -c JobDefaults.Batch.Task.Resources.Memory="512Mb"
```

## Accessing the Web UI

The Web UI is enabled by default in devstack for easier monitoring and management. Access it by opening your browser and navigating to:

```
http://localhost:8438
```

The Web UI allows you to:
- View all running and completed jobs
- Inspect node status and resources
- Monitor job execution details and logs

## Stopping Devstack

When you're done, simply press `Ctrl+C` in the terminal where devstack is running to shut everything down.

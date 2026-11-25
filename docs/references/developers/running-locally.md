# Running Locally with Devstack

Bacalhau's devstack provides a quick way to spin up a local testing environment with multiple nodes. This is perfect for development, testing, or simply exploring Bacalhau's capabilities without setting up a full production environment.

## Prerequisites

- **Bacalhau**: Latest version installed
- **Docker Engine**: Installed, running, and reachable by the user that starts devstack. Docker is only needed for Docker jobs; without it, devstack still starts but its compute nodes can only run WebAssembly (WASM) jobs.

## Installation

If you haven't installed Bacalhau yet:

```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```

## Check Docker Before You Start

Each compute node checks for a Docker daemon once, when it starts. If it cannot reach one, the node only offers the WASM engine and keeps doing so until it is restarted, even if Docker comes up later. Docker jobs then fail with:

```
Error: not enough nodes to run job. requested: 1, available: 3, suitable: 0.
• 3 of 3 nodes: does not support docker, only wasm
```

Before starting devstack, confirm that Docker answers from the same shell:

```bash
docker info
```

If `docker info` fails, start Docker (for example, open Docker Desktop, or run `sudo systemctl start docker` on Linux) and try again. On Linux, also make sure your user can access the Docker socket without `sudo`, for example by adding it to the `docker` group.

Bacalhau connects to Docker through the standard `DOCKER_HOST` environment variable, or `unix:///var/run/docker.sock` when `DOCKER_HOST` is unset. It does not read Docker CLI contexts. If your Docker runtime listens on a different socket (Docker Desktop without the default socket enabled, Colima, OrbStack, Podman, or rootless Docker), point `DOCKER_HOST` at the socket of your current Docker context before starting devstack:

```bash
export DOCKER_HOST=$(docker context inspect --format '{{.Endpoints.docker.Host}}')
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
To use the devstack, run the following commands in your shell:

export BACALHAU_API_HOST=0.0.0.0
export BACALHAU_API_PORT=1234
```

Use `--orchestrators`, `--computes`, and `--hybrids` to change the number of each node type, for example `bacalhau devstack --orchestrators 0 --computes 0 --hybrids 1` for a single hybrid node.

## Using Your Devstack

By default, devstack configures the orchestrator to run on the standard port (1234), so you can immediately use it without additional settings. Open a new terminal window and test your connection:

```bash
bacalhau node list
```

You should see the nodes in your devstack:

```
 ID      TYPE       APPROVAL  STATUS     LABELS                                    CPU   MEMORY  DISK  GPU
 node-0  Requester  APPROVED  CONNECTED  env=devstack id=node-0 name=node-0 ...
 node-1  Compute    APPROVED  CONNECTED  env=devstack id=node-1 name=node-1 ...    ...   ...     ...   ...
 node-2  Compute    APPROVED  CONNECTED  env=devstack id=node-2 name=node-2 ...    ...   ...     ...   ...
 node-3  Compute    APPROVED  CONNECTED  env=devstack id=node-3 name=node-3 ...    ...   ...     ...   ...
```

Check which execution engines the compute nodes registered:

```bash
bacalhau node list --show features
```

The `ENGINES` column of each compute node must include `docker` before you submit Docker jobs. If it only shows `wasm`, stop devstack, fix Docker access as described in [Check Docker Before You Start](#check-docker-before-you-start), and start devstack again.

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

### Avoiding Port Conflicts

Devstack uses the standard ports (1234 for the API and 4222 for the orchestrator) so that the CLI works without extra settings. If another Bacalhau node already uses them, start devstack with `--random-ports` and export the `BACALHAU_API_HOST` and `BACALHAU_API_PORT` values it prints.

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

If devstack exits abnormally, the next start can fail with `found file .../bacalhau-devstack.port - Devstack likely already running`. When no devstack is running, delete the `bacalhau-devstack.port` and `bacalhau-devstack.pid` files from your system temporary directory (`$TMPDIR` on macOS, `/tmp` on Linux) and start it again.

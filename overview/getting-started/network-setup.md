# Network Setup

This guide explains how to set up Bacalhau networks for various deployment scenarios, from development environments to production deployments.

### Introduction

Bacalhau's architecture consists of two primary node types:

* **Orchestrator nodes** that schedule and manage jobs
* **Compute nodes** that execute workloads

Compute nodes connect to orchestrators, but don't need to be reachable by orchestrators or other compute nodes, making deployment simpler.

### Getting Started with Bacalhau

Choose the setup option that best matches your needs:

| Setup Option        | Best For                           | Key Benefit                                  |
| ------------------- | ---------------------------------- | -------------------------------------------- |
| Expanso Cloud       | Production deployments             | Fully managed orchestrator service           |
| DevStack            | Development & testing              | Quick local setup with minimal configuration |
| Self-Hosted Network | Custom infrastructure requirements | Complete control over all components         |

### Option 1: Expanso Cloud (Recommended for Production)

Expanso Cloud provides a managed orchestrator service, eliminating the need to set up and maintain your own orchestrator.

**Setting Up with Expanso Cloud**

1. **Sign up for Expanso Cloud** to receive:
   * An orchestrator endpoint
   * Authentication credentials
   * A configuration file
2. **Create a configuration file** (or use the one provided):

```yaml
# config.yaml
Compute:
  Enabled: true
  Orchestrators:
    - <orchestrator-endpoint>
  Auth:
    Token: <auth-token>
  TLS:
    RequireTLS: true
```

3. **Start your compute node**:

```bash
bacalhau serve --compute -c config.yaml
```

4. **Submit jobs** to the Expanso Cloud orchestrator:

```bash
bacalhau docker run \
  --api-host <expanso-endpoint> \
  ubuntu:latest \
  -- echo "Hello from Expanso Cloud!"
```

This is the simplest way to run a Bacalhau network with minimal setup and maintenance.

### Option 2: Local Testing with DevStack (Recommended for Development)

DevStack provides a pre-configured local environment perfect for development and testing.

```bash
# Launch a complete development environment
bacalhau devstack
```

This pre-configures a transient orchestrator and compute nodes by default, giving you a complete environment for testing with minimal setup.

You can submit jobs to your DevStack just like any other Bacalhau network:

```bash
bacalhau docker run ubuntu:latest -- echo "Hello from DevStack!"
```

### Option 3: Self-Hosted Network

If you need to host your own orchestrator, follow these steps for a custom deployment.

**Setting Up an Orchestrator Node**

On your designated orchestrator machine:

```bash
# Start an orchestrator-only node
bacalhau serve --orchestrator
```

Take note of this machine's IP address or hostname - you'll need it to connect compute nodes.

**Adding Compute Nodes**

On each machine that will execute jobs:

```bash
# Start a compute-only node connected to your orchestrator
bacalhau serve --compute -c Compute.Orchestrators=<orchestrator-ip>:4222
```

Replace `<orchestrator-ip>` with the actual IP address or hostname of your orchestrator.

**Verifying Your Cluster**

Check that all nodes are connected:

```bash
# List all nodes in your network
bacalhau node list
```

You should see your orchestrator and all compute nodes listed.

> **Note:** The setup described above creates an open network suitable for testing in trusted environments. For securing your network, refer to the Security Best Practices in the Reference section.

### Alternative Setup Methods

These methods provide additional ways to set up Bacalhau for specific use cases.

#### Single Hybrid Node

For the simplest local setup, you can run a single node that acts as both orchestrator and compute:

```bash
# Launch a combined orchestrator and compute node
bacalhau serve --orchestrator --compute
```

This starts Bacalhau in "hybrid mode" where:

* The orchestrator handles job scheduling
* The compute service executes containers
* Both components run in the same process

This option is useful for initial testing or for very small deployments.

#### Docker Deployment

Run Bacalhau in Docker for easier management:

```bash
# Run an orchestrator node
docker run -p 4222:4222 ghcr.io/bacalhau-project/bacalhau:latest serve --orchestrator

# Run a compute node using Docker-in-Docker
docker run --privileged -p 4222:4222 \
  ghcr.io/bacalhau-project/bacalhau:latest-dind \
  serve --compute -c Compute.Orchestrators=<orchestrator-ip>:4222
```

The `bacalhau:latest-dind` image includes Docker-in-Docker capabilities required for compute nodes.

#### Docker Compose Setup

For a quick multi-node setup, Bacalhau provides Docker Compose examples that create a complete network suitable for testing:

1.  **Clone Network Setups Repository**\
    Clone the repository containing the network setups:

    ```bash
    git clone https://github.com/bacalhau-project/bacalhau-network-setups.git
    ```
2.  **Navigate to a Specific Setup**\
    Change directory to your desired setup under `docker-compose`:

    ```bash
    cd bacalhau-network-setups/docker-compose/<setup-name>
    ```
3.  **Start the Network**\
    Use Docker Compose to bring up the network:

    ```bash
    docker compose up
    ```

These setups enable deployment and testing of Bacalhau across multiple nodes, including an orchestrator and persistent data storage.

### Next Steps

* Secure your network with our Security Guide
* Learn how to submit jobs to your network
* Explore common workflows for different use cases

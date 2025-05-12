# Node Management

## Overview

Bacalhau clusters consist of two types of nodes:

1. **Orchestrator nodes**: Orchestrate jobs and manage the cluster
2. **Compute nodes**: Execute workloads and report resource availability

This guide covers how orchestrator nodes manage compute node membership, monitor health, and maintain awareness of available resources across the cluster.

## Node Registration and Approval

Compute nodes register with orchestrator nodes when they join the cluster. By default, compute nodes are automatically approved when they join. However, orchestrator nodes can be configured to require manual approval for additional security.

### Viewing Node Status

To see all nodes in your cluster with their approval status:

```shell
bacalhau node list

ID      TYPE       APPROVAL  STATUS
node-0  Requester  APPROVED  CONNECTED
node-1  Compute    APPROVED  HEALTHY
node-2  Compute    APPROVED  HEALTHY
node-3  Compute    APPROVED  HEALTHY
```

If manual approval is enabled, new compute nodes will show as `PENDING` until approved.

### Approving and Rejecting Nodes

To approve a compute node:

```shell
bacalhau node approve node-1
Ok
```

To reject a compute node:

```shell
bacalhau node reject node-3 -m "Unauthorized node"
Ok
```

To permanently remove a node from the cluster:

```shell
bacalhau node delete node-2
```

## Monitoring Node Health

Orchestrator nodes continuously monitor the health of compute nodes through a heartbeat mechanism. Compute nodes send heartbeats every 15 seconds by default. If a node fails to send heartbeats for longer than the configured disconnect timeout (1 minute by default), it will be marked as `UNHEALTHY` and eventually as `UNKNOWN` if it remains unresponsive.

The health status affects job scheduling decisions, ensuring workloads are only assigned to healthy, responsive nodes.

## Resource Reporting

Compute nodes report several types of information to orchestrator nodes:

1. **Static information**: Hardware details, architecture, and other fixed attributes (reported every minute by default)
2. **Resource availability**: Current CPU, memory, disk, and GPU availability
3. **Health status**: Heartbeat signals indicating the node is operational (sent every 15 seconds by default)

This information enables intelligent job scheduling based on actual resource availability across the cluster.

## Configuration Options

### Compute Node Settings

| Configuration Key                      | Description                                   | Default    |
| -------------------------------------- | --------------------------------------------- | ---------- |
| `Compute.Heartbeat.InfoUpdateInterval` | How often node static information is reported | 1 minute   |
| `Compute.Heartbeat.Interval`           | How often heartbeats are sent                 | 15 seconds |

### Orchestrator Node Settings

| Configuration Key                            | Description                                                           | Default  |
| -------------------------------------------- | --------------------------------------------------------------------- | -------- |
| `Orchestrator.NodeManager.DisconnectTimeout` | Time after which a node without heartbeats is considered disconnected | 1 minute |
| `Orchestrator.NodeManager.ManualApproval`    | Whether to require manual approval for compute nodes                  | `false`  |

Example configuration to enable manual approval in `config.yaml`:

```yaml
Orchestrator:
  NodeManager:
    ManualApproval: true
```

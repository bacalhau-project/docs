---
title: Agent API
description: Query Bacalhau agent health, capabilities, node identity, and version through the HTTP API.
---

# Agent

The Bacalhau Agent APIs provide a convenient means to retrieve information about the Bacalhau node you are communicating with, whether it serves as the orchestrator or functions as a compute node. These APIs offer valuable insights into the node's health, capabilities, and deployed Bacalhau version.

## Is Alive

**Endpoint:** `GET /api/v1/agent/alive`

This API can be used to determine if the agent is operational and responding as expected.

**Response**:

```json
{
  "Status": "OK"
}
```

## Deployed Bacalhau Version

**Endpoint:** `GET /api/v1/agent/version`

This API provides details about the Bacalhau version, including major and minor version numbers, Git version, Git commit, build date, and platform information.

**Response**:

```json
{
  "Major": "1",
  "Minor": "9",
  "GitVersion": "v1.9.6",
  "GitCommit": "a8cd25beef99a56d9b4c23af398b701241ce79e1",
  "BuildDate": "2026-11-25T01:55:56Z",
  "GOOS": "linux",
  "GOARCH": "amd64"
}
```

## Node Info

**Endpoint:** `GET /api/v1/agent/node`

This API provides detailed information about the node, including its node ID, node type (e.g., Compute), labels, supported protocols, compute node capabilities, and the deployed Bacalhau version.

**Response**:

```json
{
  "NodeID": "node-1",
  "NodeType": "Compute",
  "Labels": {
    "name": "node-1",
    "os_arch": "amd64",
    "os_type": "linux",
    "region": "us-west"
  },
  "SupportedProtocols": [
    "bprotocol/v2",
    "ncl/v1"
  ],
  "ComputeNodeInfo": {
    "ExecutionEngines": [
      "wasm",
      "docker"
    ],
    "Publishers": [
      "local",
      "s3",
      "s3managed",
      "noop",
      "ipfs"
    ],
    "StorageSources": [
      "inline",
      "urldownload",
      "s3",
      "ipfs"
    ],
    "MaxCapacity": {
      "CPU": 12.8,
      "Memory": 53931121049,
      "Disk": 721417073459,
      "GPU": 1
    },
    "QueueCapacity": {},
    "AvailableCapacity": {
      "CPU": 12.8,
      "Memory": 53931121049,
      "Disk": 721417073459,
      "GPU": 1
    },
    "MaxJobRequirements": {
      "CPU": 12.8,
      "Memory": 53931121049,
      "Disk": 721417073459,
      "GPU": 1
    },
    "RunningExecutions": 0,
    "EnqueuedExecutions": 0,
    "address": ""
  },
  "BacalhauVersion": {
    "Major": "1",
    "Minor": "9",
    "GitVersion": "v1.9.6",
    "GitCommit": "a8cd25beef99a56d9b4c23af398b701241ce79e1",
    "BuildDate": "2026-11-25T01:55:56Z",
    "GOOS": "linux",
    "GOARCH": "amd64"
  }
}
```

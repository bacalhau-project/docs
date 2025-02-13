---
icon: screwdriver-wrench
---

# Write a SpecConfig

## Overview

A job specification defines how Bacalhau should execute your workload. This guide provides a complete reference of all supported options, configurations, and their valid values.

### Basic Structure

A job specification is a JSON document with the following structure:

```json
{
  "Name": "my-job",
  "Type": "batch",
  "Count": 1,
  "Tasks": [{
    "Name": "main",
    "Engine": {
      "Type": "docker",
      "Params": {
        "Image": "ubuntu:latest"
      }
    },
    "Resources": {
      "CPU": "1",
      "Memory": "1GB"
    }
  }]
}
```

### Field Reference

#### Job Level Fields

<table><thead><tr><th>Field</th><th>Type</th><th width="113">Required</th><th width="173">Default</th><th>Valid Values</th></tr></thead><tbody><tr><td><code>Name</code></td><td>string</td><td>Yes</td><td>-</td><td>Alphanumeric with <code>-</code> and <code>_</code></td></tr><tr><td><code>Type</code></td><td>string</td><td>Yes</td><td><code>batch</code></td><td><code>batch</code>, <code>service</code>, <code>daemon</code>, <code>ops</code></td></tr><tr><td><code>Count</code></td><td>integer</td><td>No</td><td>1</td><td>1 or greater</td></tr><tr><td><code>Priority</code></td><td>integer</td><td>No</td><td>0</td><td>0-100</td></tr><tr><td><code>Namespace</code></td><td>string</td><td>No</td><td><code>default</code></td><td>Valid DNS label</td></tr><tr><td><code>Labels</code></td><td>object</td><td>No</td><td><code>{}</code></td><td>Key-value string pairs</td></tr><tr><td><code>Tasks</code></td><td>array</td><td>Yes</td><td>-</td><td>Array of task objects</td></tr></tbody></table>

#### Types

These are the types of jobs:

* `batch`: Run once and complete
* `service`: Run continuously with specified replica count
* `daemon`: Run continuously on all matching nodes
* `ops`: Run once on all matching nodes

### Task Configuration

Tasks define the actual work to be performed. Each task requires:

1. Engine configuration (how to run)
2. Resource requirements (what it needs)
3. Data handling (inputs/outputs)

Inside tasks, there are a number of fields.&#x20;

#### Task Level Fields

<table><thead><tr><th width="178">Field</th><th>Type</th><th>Required</th><th>Default</th><th>Valid Values</th></tr></thead><tbody><tr><td><code>Name</code></td><td>string</td><td>Yes</td><td>-</td><td>Alphanumeric with <code>-</code> and <code>_</code></td></tr><tr><td><code>Engine</code></td><td>object</td><td>Yes</td><td>-</td><td>Engine configuration</td></tr><tr><td><code>Resources</code></td><td>object</td><td>Yes</td><td>-</td><td>Resource requirements</td></tr><tr><td><code>InputSources</code></td><td>array</td><td>No</td><td><code>[]</code></td><td>Array of input sources</td></tr><tr><td><code>ResultPaths</code></td><td>array</td><td>No</td><td><code>[]</code></td><td>Array of result paths</td></tr><tr><td><code>Network</code></td><td>object</td><td>No</td><td><code>{"Type": "none"}</code></td><td>Network configuration</td></tr><tr><td><code>Timeouts</code></td><td>object</td><td>No</td><td>-</td><td>Timeout settings</td></tr><tr><td><code>Env</code></td><td>object</td><td>No</td><td><code>{}</code></td><td>Key-value string pairs</td></tr><tr><td><code>Meta</code></td><td>object</td><td>No</td><td><code>{}</code></td><td>Key-value string pairs</td></tr></tbody></table>

Additionally, there are sub-fields to fill in.

#### Engine Types

* `docker`: Docker container execution
* `wasm`: WebAssembly module execution

#### Engine Configuration

**Docker Engine Parameters**

<table><thead><tr><th width="262">Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody><tr><td><code>Image</code></td><td>string</td><td>Yes</td><td>Docker image name</td></tr><tr><td><code>Entrypoint</code></td><td>array</td><td>No</td><td>Container entrypoint</td></tr><tr><td><code>Parameters</code></td><td>array</td><td>No</td><td>Command parameters</td></tr><tr><td><code>WorkingDirectory</code></td><td>string</td><td>No</td><td>Working directory</td></tr><tr><td><code>EnvironmentVariables</code></td><td>object</td><td>No</td><td>Environment variables</td></tr><tr><td><code>Ports</code></td><td>array</td><td>No</td><td>Port mappings</td></tr></tbody></table>

Example:

```json
"Engine": {
  "Type": "docker",
  "Params": {
    "Image": "python:3.9-slim",
    "Entrypoint": ["python"],
    "Parameters": ["-c", "print('hello')"],
    "WorkingDirectory": "/app",
    "EnvironmentVariables": {
      "PYTHONUNBUFFERED": "1"
    }
  }
}
```

Common Edge Cases:

* Images without default entrypoints require explicit entrypoint
* Environment variables with spaces or special characters need proper escaping
* Working directory must exist in container
* Large images may exceed node storage limits

**WASM Engine Parameters**

<table><thead><tr><th width="257">Parameter</th><th>Type</th><th width="81">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>EntryModule</code></td><td>string</td><td>Yes</td><td>WASM module path</td></tr><tr><td><code>EntryPoint</code></td><td>string</td><td>Yes</td><td>Exported function name</td></tr><tr><td><code>Parameters</code></td><td>array</td><td>No</td><td>Function arguments</td></tr><tr><td><code>EnvironmentVariables</code></td><td>object</td><td>No</td><td>Environment variables</td></tr></tbody></table>

Example:

```json
"Engine": {
  "Type": "wasm",
  "Params": {
    "EntryModule": "app.wasm",
    "EntryPoint": "_start",
    "Parameters": ["--verbose"],
    "EnvironmentVariables": {
      "MEMORY_LIMIT": "512MB"
    }
  }
}
```

#### Storage Types

* `ipfs`: IPFS content (you must provide your own IPFS endpoint)
* `s3`: Amazon S3 storage
* `local`: Local filesystem
* `urlDownload`: HTTP/HTTPS URLs
* `s3PreSigned`: Pre-signed S3 URLs

#### Network Types

* `none`: No network access (default)
* `http`: Limited HTTP/HTTPS access
* `full`: Unrestricted network access

#### Publisher Types

* `ipfs`: Publish to IPFS
* `s3`: Upload to S3
* `local`: Store locally
* `noop`: Discard results

#### Resource Requirements

**Resource Fields**

<table><thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Format</th><th width="179">Range</th></tr></thead><tbody><tr><td><code>CPU</code></td><td>string</td><td>Yes</td><td>Decimal</td><td>0.1 to node max</td></tr><tr><td><code>Memory</code></td><td>string</td><td>Yes</td><td>Size + Unit</td><td>1MB to node max</td></tr><tr><td><code>Disk</code></td><td>string</td><td>Yes</td><td>Size + Unit</td><td>10MB to node max</td></tr><tr><td><code>GPU</code></td><td>string</td><td>No</td><td>Integer</td><td>0 to node max</td></tr></tbody></table>

Example:

```json
"Resources": {
  "CPU": "1.5",
  "Memory": "2GB",
  "Disk": "10GB",
  "GPU": "1"
}
```

#### Data Handling

**Input Source Fields**

<table><thead><tr><th>Field</th><th width="94">Type</th><th width="108">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>Source.Type</code></td><td>string</td><td>Yes</td><td>One of: ipfs, s3, local, urlDownload, s3PreSigned, inline</td></tr><tr><td><code>Source.Params</code></td><td>object</td><td>Yes</td><td>Source-specific parameters</td></tr><tr><td><code>Target</code></td><td>string</td><td>Yes</td><td>Absolute mount path</td></tr><tr><td><code>Alias</code></td><td>string</td><td>No</td><td>Friendly identifier</td></tr></tbody></table>

**Source Type Parameters**

IPFS:

```json
{
  "CID": "string",
  "Gateway": "string"
}
```

S3:

```json
{
  "Bucket": "string",
  "Key": "string",
  "Region": "string",
  "Endpoint": "string",
  "AccessKeyID": "string",
  "SecretAccessKey": "string"
}
```

URL:

```json
{
  "URL": "string",
  "Headers": {
    "string": "string"
  }
}
```

Inline:

```json
{
  "Content": "string"
}
```

Example:

```json
"InputSources": [
  {
    "Source": {
      "Type": "ipfs",
      "Params": {
        "CID": "QmHash..."
      }
    },
    "Target": "/inputs/data",
    "Alias": "dataset"
  }
]
```

This can accept multiple sources - for example:

```json
"InputSources": [
  {
    "Source": {"Type": "ipfs", ...},
    "Target": "/inputs/data1"
  },
  {
    "Source": {"Type": "s3", ...},
    "Target": "/inputs/data2"
  }
]
```

#### Network Configuration

```json
"Network": {
  "Type": "http",
  "Domains": ["api.example.com"],
  "EnableIPv6": true,
  "DNS": ["8.8.8.8"],
  "Policies": {
    "Egress": {
      "Ports": ["80", "443"]
    }
  }
}
```

#### Timeout Configuration

```json
"Timeouts": {
  "ExecutionTimeout": 3600,
  "QueueTimeout": 300,
  "TotalTimeout": 4000
}
```

### Validation and Testing

#### Pre-Submission Validation

You can test your job schema by running the `validate`command. E.g.

```bash
bacalhau validate job.json
```

#### Test Runs

Bacalhau also supports `--dry-run`for testing, though this is only done locally. It does not test against the network.

```bash
bacalhau run --dry-run job.json
```

### Troubleshooting Guide

#### Common Error Messages

1.  Resource Errors

    ```
    Error: insufficient resources: CPU request exceeds node capacity
    ```

    Solution: Check node capabilities and adjust requests
2.  Network Errors

    ```
    Error: network access denied: domain not in allowlist
    ```

    Solution: Verify network policy and domain lists
3.  Timeout Errors

    ```
    Error: job exceeded ExecutionTimeout
    ```

    Solution: Adjust timeouts or optimize job

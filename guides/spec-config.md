---
icon: screwdriver-wrench
---

# Write a SpecConfig

## Overview

A job specification defines how Bacalhau should execute your workload. This guide provides a complete reference of all supported options, configurations, and their valid values.

### Supported Values

#### Job Types

* `batch`: Run once and complete
* `service`: Run continuously with specified replica count
* `daemon`: Run continuously on all matching nodes
* `ops`: Run once on all matching nodes

#### Engine Types

* `docker`: Docker container execution
* `wasm`: WebAssembly module execution

#### Storage Types

* `ipfs`: IPFS content
* `s3`: Amazon S3 storage
* `local`: Local filesystem
* `urlDownload`: HTTP/HTTPS URLs
* `s3PreSigned`: Pre-signed S3 URLs
* `inline`: Inline content

#### Network Types

* `none`: No network access (default)
* `http`: Limited HTTP/HTTPS access
* `full`: Unrestricted network access

#### Publisher Types

* `ipfs`: Publish to IPFS
* `s3`: Upload to S3
* `local`: Store locally
* `noop`: Discard results

#### Result Types

* `file`: Single file output
* `directory`: Directory of files
* `stdout`: Standard output
* `stderr`: Standard error
* `exitCode`: Process exit code

#### Compression Types

* `none`: No compression
* `gzip`: GZIP compression
* `zstd`: Zstandard compression

#### Format Types

* `raw`: Binary data
* `text`: Plain text
* `json`: JSON data
* `csv`: CSV data

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

| Field       | Type    | Required | Default   | Valid Values                        |
| ----------- | ------- | -------- | --------- | ----------------------------------- |
| `Name`      | string  | Yes      | -         | Alphanumeric with `-` and `_`       |
| `Type`      | string  | Yes      | `batch`   | `batch`, `service`, `daemon`, `ops` |
| `Count`     | integer | No       | 1         | 1 or greater                        |
| `Priority`  | integer | No       | 0         | 0-100                               |
| `Namespace` | string  | No       | `default` | Valid DNS label                     |
| `Labels`    | object  | No       | `{}`      | Key-value string pairs              |
| `Meta`      | object  | No       | `{}`      | Key-value string pairs              |
| `Tasks`     | array   | Yes      | -         | Array of task objects               |

#### Task Level Fields

| Field   | Required | Description                         | Edge Cases                                                                              |
| ------- | -------- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| `Name`  | Yes      | Job identifier                      | Must be unique within namespace. Avoid spaces and special characters except `-` and `_` |
| `Type`  | Yes      | Job type (batch/service/daemon/ops) | Services without proper health checks may restart continuously                          |
| `Count` | No       | Number of replicas                  | For batch jobs, each replica runs once. For services, maintains Count running replicas  |
| `Tasks` | Yes      | Array of task definitions           | Order matters for multi-task jobs. First task failure stops subsequent tasks            |

### Task Configuration

Tasks define the actual work to be performed. Each task requires:

1. Engine configuration (how to run)
2. Resource requirements (what it needs)
3. Data handling (inputs/outputs)

#### Task Level Fields

| Field          | Type   | Required | Default            | Valid Values                  |
| -------------- | ------ | -------- | ------------------ | ----------------------------- |
| `Name`         | string | Yes      | -                  | Alphanumeric with `-` and `_` |
| `Engine`       | object | Yes      | -                  | Engine configuration          |
| `Resources`    | object | Yes      | -                  | Resource requirements         |
| `InputSources` | array  | No       | `[]`               | Array of input sources        |
| `ResultPaths`  | array  | No       | `[]`               | Array of result paths         |
| `Network`      | object | No       | `{"Type": "none"}` | Network configuration         |
| `Timeouts`     | object | No       | -                  | Timeout settings              |
| `Env`          | object | No       | `{}`               | Key-value string pairs        |
| `Meta`         | object | No       | `{}`               | Key-value string pairs        |

#### Engine Configuration

**Docker Engine Parameters**

| Parameter              | Type   | Required | Description           |
| ---------------------- | ------ | -------- | --------------------- |
| `Image`                | string | Yes      | Docker image name     |
| `Entrypoint`           | array  | No       | Container entrypoint  |
| `Parameters`           | array  | No       | Command parameters    |
| `WorkingDirectory`     | string | No       | Working directory     |
| `EnvironmentVariables` | object | No       | Environment variables |
| `Ports`                | array  | No       | Port mappings         |

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

| Parameter              | Type   | Required | Description            |
| ---------------------- | ------ | -------- | ---------------------- |
| `EntryModule`          | string | Yes      | WASM module path       |
| `EntryPoint`           | string | Yes      | Exported function name |
| `Parameters`           | array  | No       | Function arguments     |
| `EnvironmentVariables` | object | No       | Environment variables  |

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

Common Edge Cases:

* WASM modules must explicitly export entry point function
* Memory limits must be within node capabilities
* Binary data handling requires careful type conversion

#### Resource Requirements

**Resource Fields**

| Field    | Type   | Required | Format      | Range            |
| -------- | ------ | -------- | ----------- | ---------------- |
| `CPU`    | string | Yes      | Decimal     | 0.1 to 128.0     |
| `Memory` | string | Yes      | Size + Unit | 1MB to node max  |
| `Disk`   | string | Yes      | Size + Unit | 10MB to node max |
| `GPU`    | string | No       | Integer     | 0 to node max    |

Units:

* Memory/Disk: B, KB, MB, GB, TB
* CPU: Decimal cores (e.g., "0.5", "2.0")
* GPU: Whole numbers only

Example:

```json
"Resources": {
  "CPU": "1.5",
  "Memory": "2GB",
  "Disk": "10GB",
  "GPU": "1"
}
```

* CPU can be fractional (e.g., "0.1" to "128.0")
* Memory/Disk require units (B, KB, MB, GB, TB)
* GPU allocation is integer-only
* Over-requesting resources reduces node availability

Edge Cases:

1.  Minimum Allocations

    ```json
    "Resources": {
      "CPU": "0.1",    // Minimum CPU allocation
      "Memory": "1MB",  // Minimum memory allocation
      "Disk": "10MB"   // Minimum disk allocation
    }
    ```
2.  Maximum Values

    ```json
    "Resources": {
      "CPU": "128",      // Maximum varies by node
      "Memory": "256GB",  // Node dependent
      "GPU": "8"         // Must match node capacity
    }
    ```

#### Data Handling

**Input Source Fields**

| Field           | Type   | Required | Description                                               |
| --------------- | ------ | -------- | --------------------------------------------------------- |
| `Source.Type`   | string | Yes      | One of: ipfs, s3, local, urlDownload, s3PreSigned, inline |
| `Source.Params` | object | Yes      | Source-specific parameters                                |
| `Target`        | string | Yes      | Absolute mount path                                       |
| `Alias`         | string | No       | Friendly identifier                                       |

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

Common Pitfalls:

* Target paths must be absolute
* Parent directories must exist
* Path collisions between sources
* Missing access permissions

Edge Cases:

1.  Multiple Source Types

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
2.  Inline Content with Special Characters

    ```json
    "Source": {
      "Type": "inline",
      "Params": {
        "Content": "#!/bin/bash\necho \"Special chars: $PATH\""
      }
    }
    ```

**Result Path Fields**

| Field              | Type    | Required | Description                                       |
| ------------------ | ------- | -------- | ------------------------------------------------- |
| `Name`             | string  | Yes      | Result identifier                                 |
| `Path`             | string  | Yes      | Absolute path                                     |
| `Type`             | string  | Yes      | One of: file, directory, stdout, stderr, exitCode |
| `Format`           | string  | No       | One of: raw, text, json, csv                      |
| `Compression`      | string  | No       | One of: none, gzip, zstd                          |
| `CompressionLevel` | integer | No       | Compression level (1-9)                           |

Example:

```json
"ResultPaths": [
  {
    "Name": "output",
    "Path": "/outputs/results",
    "Type": "directory",
    "Format": "raw",
    "Compression": "zstd",
    "CompressionLevel": 3
  }
]
```

Important Considerations:

* Missing output paths fail the job
* Large outputs need compression
* Some formats require specific file extensions
* Path patterns support wildcards

Edge Cases:

1.  Special File Types

    ```json
    "ResultPaths": [
      {
        "Name": "stdout",
        "Path": "/stdout",
        "Type": "file"
      },
      {
        "Name": "core",
        "Path": "/core.*",
        "Type": "file"
      }
    ]
    ```
2.  Compression Levels

    ```json
    "ResultPaths": [
      {
        "Name": "data",
        "Path": "/data",
        "Type": "directory",
        "Compression": "zstd",
        "CompressionLevel": 3
      }
    ]
    ```

### Advanced Configurations

#### Job Types and Behaviors

1.  Batch Jobs

    ```json
    {
      "Type": "batch",
      "Count": 5,
      "ExecutionPlan": "parallel"
    }
    ```

    Edge Cases:

    * Partial completion handling
    * Resource competition
    * Output collisions
2.  Service Jobs

    ```json
    {
      "Type": "service",
      "Count": 3,
      "UpdateStrategy": {
        "Type": "rolling",
        "MaxUnavailable": 1
      }
    }
    ```

    Edge Cases:

    * Network port conflicts
    * State persistence
    * Update coordination
3.  Daemon Jobs

    ```json
    {
      "Type": "daemon",
      "RestartPolicy": {
        "Mode": "always",
        "MaxAttempts": 5
      }
    }
    ```

    Edge Cases:

    * Node failure handling
    * Resource cleanup
    * State recovery

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

Edge Cases:

1. Domain Resolution
   * Wildcards and subdomains
   * IP address ranges
   * Internal service discovery
2.  Network Isolation

    ```json
    "Network": {
      "Type": "none",
      "AllowLoopback": true
    }
    ```
3.  Complex Routing

    ```json
    "Network": {
      "Type": "http",
      "Domains": ["*.service.local"],
      "Routes": [
        {
          "Match": "service.local",
          "Target": "internal.svc.cluster"
        }
      ]
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

Edge Cases:

1.  Long-Running Jobs

    ```json
    "Timeouts": {
     "ExecutionTimeout": 0,     // No timeout
     "QueueTimeout": 3600,      // 1 hour queue
     "TotalTimeout": 2592000    // 30 days total
    }
    ```
2.  Quick-Fail Jobs

    ```json
    "Timeouts": {
     "ExecutionTimeout": 60,    // 1 minute execution
     "QueueTimeout": 10,        // 10 seconds queue
     "TotalTimeout": 70         // 70 seconds total
    }
    ```

### Common Patterns and Anti-Patterns

#### Good Patterns

1.  Resource Gradual Scaling

    ```json
    {
      "Name": "gradual-scale",
      "Type": "batch",
      "Count": 1,
      "Tasks": [{
        "Resources": {
          "CPU": "0.5",
          "Memory": "512MB"
        },
        "Timeouts": {
          "ExecutionTimeout": 300
        }
      }]
    }
    ```
2.  Proper Error Handling

    ```json
    {
      "Name": "robust-job",
      "Type": "batch",
      "ErrorHandling": {
        "MaxAttempts": 3,
        "OnFailure": "retry",
        "BackoffStrategy": "exponential"
      }
    }
    ```

#### Anti-Patterns

1.  Over-Provisioning

    ```json
    // Bad: Requesting more than needed
    "Resources": {
      "CPU": "8",
      "Memory": "16GB",
      "GPU": "1"
    }
    ```
2.  Insufficient Timeouts

    ```json
    // Bad: Too tight timeouts
    "Timeouts": {
      "ExecutionTimeout": 60,
      "QueueTimeout": 10
    }
    ```

### Validation and Testing

#### Pre-Submission Validation

```bash
bacalhau validate job.json
```

Common Issues:

1. Schema Validation
   * Missing required fields
   * Invalid field types
   * Unknown properties
2. Resource Validation
   * Invalid resource quantities
   * Incompatible combinations
   * Exceeded limits
3. Network Validation
   * Invalid domain patterns
   * Port conflicts
   * Policy violations

#### Test Runs

```bash
bacalhau run --dry-run job.json
```

This helps catch:

* Resource availability issues
* Network access problems
* Input source validity
* Publisher configuration errors

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

#### Debug Techniques

1.  Resource Monitoring

    ```bash
    bacalhau job inspect <job-id> --resources
    ```
2.  Network Diagnostics

    ```bash
    bacalhau job logs <job-id> --network
    ```
3.  State Inspection

    ```bash
    bacalhau job describe <job-id> --events
    ```

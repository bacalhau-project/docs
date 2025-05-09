---
sidebar_position: 10
---
# Overview & Global Flags

This page explains how the Bacalhau CLI is structured and which global flags are most commonly used. Understanding these fundamentals will help you work efficiently with all Bacalhau commands.

### What You'll Learn

* The general structure and organization of Bacalhau commands
* How global flags affect command behavior regardless of the specific command
* How to customize output formats and control connection settings
* How to specify configuration files and data directories
* Where to find more detailed command references

### CLI Structure

Bacalhau commands follow a consistent pattern that makes them intuitive and predictable:

```bash
bacalhau <top-level-command> <subcommand> [flags]
```

### Top-Level Commands

Bacalhau's CLI groups commands into logical categories:

* `agent`: Client-side commands for checking health, version, and node information
* `job`: Core job management (create, list, describe, stop, retrieve logs, etc.)
* `node`: Cluster node management and inspection
* `config`: Client configuration management
* `docker`: Imperative command for running Docker-based jobs&#x20;

### Command Examples

```bash
# Get version information
bacalhau agent version

# List recent jobs
bacalhau job list

# Submit a Docker job (imperative style)
bacalhau docker run ubuntu:latest -- echo "Hello World"

# View compute nodes in the cluster
bacalhau node list
```

### Global Flags

These flags work with any command and provide consistent behavior across the CLI. They're especially useful for scripting and automation.

#### Connection Settings

| Flag                | Description                   | Default     |
| ------------------- | ----------------------------- | ----------- |
| `--api-host string` | Hostname for the Bacalhau API | `localhost` |
| `--api-port int`    | Port for the Bacalhau API     | `1234`      |

Example:

```bash
bacalhau job list --api-host mycluster.example.com --api-port 8080
```

#### Configuration Management

| Flag                  | Description                                              | Default       |
| --------------------- | -------------------------------------------------------- | ------------- |
| `-c, --config string` | Config file(s) or dot separated path(s) to config values | -             |
| `--data-dir string`   | The filesystem path where Bacalhau stores its data       | `~/.bacalhau` |

Examples:

```bash
# Use a custom config file
bacalhau job list --config /path/to/custom/config.yaml

# Specify a custom data directory
bacalhau job list --data-dir /path/to/bacalhau/data

# Configure a specific value using dot notation
bacalhau serve --orchestrator -c WebUI.Enabled=true
```

#### Output Formatting

| Flag              | Description                                | Example Values          |
| ----------------- | ------------------------------------------ | ----------------------- |
| `--output format` | Output format style                        | `json`, `yaml`, `table` |
| `--pretty`        | Format JSON or YAML output for readability | -                       |

Examples:

```bash
# Get machine-readable job list
bacalhau job list --output json

# Get pretty-printed JSON
bacalhau job list --output json --pretty

# Get YAML output
bacalhau job list --output yaml
```



### Getting Help

For detailed information about any command's available flags:

```bash
bacalhau <command> --help
```

This will show all available options, including both global flags and command-specific flags.

**Tip:** For full details on each command's available flags, see the CLI Reference or type `bacalhau <command> --help`.

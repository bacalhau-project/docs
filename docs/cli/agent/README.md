---
title: Agent Commands
description: Use the bacalhau agent command group to inspect agent health, version, and node information.
---

# Agent

The `bacalhau agent` command is a parent command that offers sub-commands to query information about the Bacalhau agent. This can be useful for debugging, monitoring, or managing the agent's behavior and health.

## Usage

```bash
bacalhau agent [command]
```

## Available Commands

1. [**alive**](alive.md):

   - Description: Retrieves the agent's liveness and health information. This can be helpful to determine if the agent is running and healthy.
   - Usage:

     ```bash
     bacalhau agent alive
     ```

2. **config**:

   - Description: Retrieves the configuration the agent is running with, in YAML (default) or JSON.
   - Usage:

     ```bash
     bacalhau agent config
     ```

3. [**node**](node.md):

   - Description: Gathers the agent's node-related information. This might include details about the machine or environment where the agent is running, available resources, supported engines, etc.
   - Usage:

     ```bash
     bacalhau agent node
     ```

4. [**version**](version.md):

   - Description: Retrieves the Bacalhau version of the agent. This can be beneficial for ensuring compatibility or checking for updates.
   - Usage:

     ```bash
     bacalhau agent version
     ```

For more detailed information on any of the sub-commands, you can use the command:

```bash
bacalhau agent [command] --help
```

## Flags

- `-h`, `--help`:
  - Description: Displays help information for the `agent` command.
- `--profile string`:
  - Description: Use a specific profile for this command.

## Global Flags

1. `--api-host string`:
   - Description: The host for the client and server to communicate on (via REST). Ignored if the `BACALHAU_API_HOST` environment variable is set.
   - Default: `0.0.0.0`
2. `--api-port int`:
   - Description: The port for the client and server to communicate on (via REST). Ignored if the `BACALHAU_API_PORT` environment variable is set.
   - Default: `1234`
3. `-c`, `--config string`:
   - Description: Config file(s) or dot-separated path(s) to config values, for example `-c API.Host=10.0.0.1`.
4. `--data-dir string`:
   - Description: The filesystem path where Bacalhau initializes or opens its repo.
   - Default: `$HOME/.bacalhau`

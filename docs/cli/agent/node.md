---
title: Agent Node Command
description: Retrieve the local Bacalhau agent node information in table, JSON, or YAML format.
---

# Node

## Description

The `bacalhau agent node` command retrieves information about the agent's node, providing insights into the agent's environment and aiding in debugging.

## Usage

```bash
bacalhau agent node [flags]
```

## Flags

- `-h`, `--help`:
  - Displays help information for the `node` sub-command.
- `--output format`:
  - Defines the output format (either JSON or YAML).
  - Options: `json`, `yaml`
  - Default: `yaml`
- `--pretty`:
  - Beautifies the output when using JSON or YAML formats.

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
5. `--profile string`:
   - Description: Use a specific profile for this command.

## Examples

1.  **Retrieve Node Information in Default Format (YAML)**

    ```bash
    bacalhau agent node
    ```

2.  **Retrieve Node Information in JSON Format**

    ```bash
    bacalhau agent node --output json
    ```

3.  **Retrieve Node Information in Pretty-printed JSON Format**

    ```bash
    bacalhau agent node --output json --pretty
    ```

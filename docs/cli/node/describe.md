---
title: Describe a Node
description: Retrieve detailed state, capabilities, and configuration information for a Bacalhau node by its identifier.
---

# Describe

The `bacalhau node describe` command offers users the ability to retrieve detailed information about a specific node using its unique identifier.

## Description

Using the `describe` sub-command under the `bacalhau node` umbrella, users can get comprehensive details of a node by providing its ID. This information is crucial for system administrators and network managers to understand the state, specifications, and other attributes of nodes in their infrastructure.

## Usage

```bash
bacalhau node describe [id] [flags]
```

## Flags

- `[id]`:
  - The unique identifier of the node you wish to describe.
- `-h`, `--help`:
  - Displays the help documentation for the `describe` command.
- `--output format`:
  - Defines the desired format for the command's output.
  - Options: `"json"` or `"yaml"`
  - Default: `"yaml"`
- `--pretty`:
  - When this flag is used, the command will pretty print the output. This is applicable only for outputs in `json` and `yaml` formats.

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

1.  Describing a Node with ID `nodeID123`:

    ```bash
    bacalhau node describe nodeID123
    ```

2.  Describing a Node with Output in JSON Format:

    ```bash
    bacalhau node describe nodeID123 --output json
    ```

3.  Pretty Printing the Description of a Node:

    ```bash
    bacalhau node describe nodeID123 --pretty
    ```

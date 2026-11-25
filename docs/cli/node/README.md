---
title: Node Commands
description: Use the bacalhau node command group to list, inspect, approve, reject, and delete compute nodes.
---

# Node

The `bacalhau node` command provides a set of sub-commands to query and manage node-related information within Bacalhau. With these tools, users can access specific details about nodes, list all network nodes, and more.

## Usage

```bash
bacalhau node [command]
```

## Available Commands

1. [**approve**](approve.md):

   - Description: Approves a single node to join the cluster.
   - Usage:

     ```bash
     bacalhau node approve
     ```

2. [**delete**](delete.md):

   - Description: Deletes a node from the cluster using its ID.
   - Usage:

     ```bash
     bacalhau node delete
     ```

3. [**describe**](describe.md):

   - Description: Retrieves detailed information of a node using its ID.
   - Usage:

     ```bash
     bacalhau node describe
     ```

4. [**list**](list.md):

   - Description: Lists the details of all nodes present in the network.
   - Usage:

     ```bash
     bacalhau node list
     ```

5. [**reject**](reject.md):

- Description: Reject a specific node's request to join the cluster.
- Usage:

  ```bash
  bacalhau node reject
  ```

For comprehensive details on any of the sub-commands, run:

```bash
bacalhau node [command] --help
```

## Flags

- `-h`, `--help`:
  - Description: Shows the help information for the `node` command.
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

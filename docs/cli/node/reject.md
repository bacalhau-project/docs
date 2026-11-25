# Reject

The `bacalhau node reject` command offers administrators the ability to reject a compute node's request to join the cluster.

## Description

Using the `reject` sub-command, administrators can reject a node in the pending state from joining the cluster and receiving work. This feature is crucial for system administrators to manage the cluster and will stop the node from taking part in the cluster until approved.

## Usage

```bash
bacalhau node reject [id] [flags]
```

## Flags

- `-h`, `--help`:
  - Description: Displays the help documentation for the `reject` command.
- `-m`, `--message string`:
  - Description: A message to attach to the reject action.

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

1.  Reject a Node with ID `nodeID123`:

    ```bash
    bacalhau node reject nodeID123
    ```

2.  Reject a Node with an audit message:

    ```bash
    bacalhau node reject nodeID123 -m "potentially bad"
    ```

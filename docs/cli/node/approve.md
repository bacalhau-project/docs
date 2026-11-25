# Approve

The `bacalhau node approve` command offers administrators the ability to approve the cluster membership for a node using its name.

## Description

Using the `approve` sub-command under the `bacalhau node` umbrella, users can allow a node in the pending state to join the cluster and receive work. This feature is crucial for system administrators to manage the cluster.

## Usage

```bash
bacalhau node approve [id] [flags]
```

## Flags

- `-h`, `--help`:
  - Description: Displays the help documentation for the `approve` command.
- `-m`, `--message string`:
  - Description: A message to attach to the approve action.

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

1.  Approve a Node with ID `nodeID123`:

    ```bash
    bacalhau node approve nodeID123
    ```

2.  Approve a Node with an audit message:

    ```bash
    bacalhau node approve nodeID123 -m "okay"
    ```

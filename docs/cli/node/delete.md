# Delete

The `bacalhau node delete` command offers administrators the ability to remove a node from the cluster using its name.

## Description

Using the `delete` sub-command, administrators can remove a node from the list of available compute nodes in the cluster. This feature is necessary for the management of the infrastructure.

## Usage

```bash
bacalhau node delete [id] [flags]
```

## Flags

- `-h`, `--help`:
  - Description: Displays the help documentation for the `delete` command.
- `-m`, `--message string`:
  - Description: A message to attach to the delete action.

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

1.  Delete the Node with ID `nodeID123`:

    ```bash
    bacalhau node delete nodeID123
    ```

2.  Delete a Node with an audit message:

    ```bash
    bacalhau node delete nodeID123 -m "bad actor"
    ```

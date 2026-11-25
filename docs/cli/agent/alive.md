---
description: Check whether a Bacalhau agent is responding and retrieve its current liveness and health information.
---

# Alive

## Description

The `bacalhau agent alive` command provides information about the agent's liveness and health. This is essential for monitoring and ensuring that the agent is active and functioning correctly.

## Usage

```bash
bacalhau agent alive [flags]
```

## Flags

- `-h`, `--help`:
  - Description: Displays help information for the `alive` sub-command.
- `--output format`:
  - Description: Determines the format in which the output is displayed. Available formats include JSON and YAML.
  - Options: `json`, `yaml`
  - Default: `yaml`
- `--pretty`:
  - Description: Formats the output for enhanced readability. This flag is relevant only when using JSON or YAML output formats.

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

### Checking the Agent's Liveness and Health Info

1.  **Basic Usage**:

    **Command**:

    ```bash
    bacalhau agent alive
    ```

    **Output**:

    ```
    status: OK
    ```

2.  **Output in JSON format**:

    **Command**:

    ```bash
    bacalhau agent alive --output json --pretty
    ```

    **Output**:

    ```json
    {
      "Status": "OK"
    }
    ```

---
description: List the executions and states associated with a Bacalhau job.
---

# Executions

## Description

The `bacalhau job executions` command retrieves a list of executions for a specific job based on its ID. This can be essential when tracking the various runs and their respective states for a particular job.

## Usage

```bash
bacalhau job executions [id] [flags]
```

## Flags

- `--all-versions`:
  - Description: Return results for all job versions. By default, only the latest job version is included. `--version` takes precedence if both are set.
- `-h`, `--help`:
  - Description: Display help for the `executions` command.
- `--hide-header`:
  - Description: Do not print the column headers when displaying the results.
- `--limit uint32`:
  - Description: Restricts the number of results returned.
  - Default: `20`
- `--namespace string`:
  - Description: Job namespace. If not provided, the default namespace is used.
- `--next-token string`:
  - Description: Uses the specified token for pagination. Useful for fetching the next set of results.
- `--no-style`:
  - Description: Removes all styling from the table output, displaying raw data.
- `--order-by string`:
  - Description: Orders results based on a specific field. Valid fields are `modified_at` and `created_at`.
- `--order-reversed`:
  - Description: Reverses the order of the results. Useful in conjunction with `--order-by`.
- `--output format`:
  - Description: Specifies the desired output format for the command. Supported values are `table`, `csv`, `json`, and `yaml`.
  - Default: `table`
- `--pretty`:
  - Description: Pretty prints the output. This option is applicable only to `json` and `yaml` output formats.
- `-v`, `--version uint`:
  - Description: The job version to filter by. By default, the latest version is used.
- `--wide`:
  - Description: Prints full values in the table results without truncating any information.

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

1.  **List executions for a specific Job**:

    ```bash
    bacalhau job executions j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881
    ```

    Expected output:

    ```bash
    CREATED   MODIFIED  ID          NODE ID   REV.  COMPUTE    DESIRED  COMMENT
                                                    STATE      STATE
    16:46:03  16:46:04  e-99362435  QmTSJgdN  6     Completed  Stopped
    16:46:03  16:46:04  e-75dd20bb  QmXRdLru  6     Completed  Stopped
    16:46:03  16:46:04  e-03870df5  QmVXwmdZ  6     Completed  Stopped
    ```

2.  **Order executions by creation time for a specific job**:

    Execute the command:

    ```bash
    bacalhau job executions j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881 --order-by created_at
    ```

    Expected output:

    ```bash
    CREATED   MODIFIED  ID          NODE ID   REV.  COMPUTE    DESIRED  COMMENT
                                                    STATE      STATE
    16:46:03  16:46:04  e-03870df5  QmVXwmdZ  6     Completed  Stopped
    16:46:03  16:46:04  e-75dd20bb  QmXRdLru  6     Completed  Stopped
    16:46:03  16:46:04  e-99362435  QmTSJgdN  6     Completed  Stopped
    ```

3.  **List executions with YAML output**:

    ```bash
    bacalhau job executions j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881 --output yaml
    ```

    Expected output:

    ```yaml
    ... [The YAML formatted output] ...
    ```

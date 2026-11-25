---
description: Inspect the ordered history of state changes and execution events for a Bacalhau job.
---

# History

## Description

The `bacalhau job history` command lists the history events of a specific job based on its ID. This feature allows users to track changes, executions, and other significant milestones associated with a particular job.

## Usage

```bash
bacalhau job history [id] [flags]
```

## Flags

- `--all-versions`:
  - Description: Return results for all job versions. By default, only the latest job version is included. `--version` takes precedence if both are set.
- `--event-type string`:
  - Description: Specifies the type of history events to retrieve. Available options include `all`, `job`, and `execution`.
  - Default: `all`
- `--execution-id string`:
  - Description: Filters results by a specific execution ID.
- `-h`, `--help`:
  - Description: Display help for the `history` command.
- `--hide-header`:
  - Description: Opts out of printing the column headers in the results.
- `--limit uint32`:
  - Description: Limits the number of results returned.
- `--namespace string`:
  - Description: Job namespace. If not provided, the default namespace is used.
- `--next-token string`:
  - Description: Uses the provided token for pagination.
- `--no-style`:
  - Description: Strips all styling from the table output.
- `--order-by string`:
  - Description: Organizes results based on a chosen field.
- `--order-reversed`:
  - Description: Reverses the order of the displayed results.
- `--output format`:
  - Description: Dictates the desired output format for the command. Options are `table`, `csv`, `json`, and `yaml`.
  - Default: `table`
- `--pretty`:
  - Description: Offers a more visually pleasing output for `json` and `yaml` formats.
- `-v`, `--version uint`:
  - Description: The job version to filter by. By default, the latest version is used.
- `--wide`:
  - Description: Presents full values in the table results, preventing truncation.

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

1.  **Retrieve the history of a specific job**:

    Execute the command to get the job history:

    ```bash
    bacalhau job history j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881
    ```

    Expected output:

    ```plaintext
    TIME      LEVEL           EXEC. ID    ...     NEW STATE          COMMENT
    ... [The output rows like the ones you've shown] ...
    16:46:04  JobLevel                              2     Pending            Completed
    ```

2.  **Filter the history by event type**:

    Filter the job history by the event type:

    ```bash
    bacalhau job history j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881 --event-type job
    ```

    Expected output:

    ```plaintext
    TIME      LEVEL     EXEC. ID  NODE ID  REV.  PREVIOUS STATE  NEW STATE  COMMENT
    16:46:03  JobLevel                     1     Pending         Pending    Job created
    16:46:04  JobLevel                     2     Pending         Completed
    ```

3.  **Filter the history by execution ID**:

    Filter the job history by a specific execution ID:

    ```bash
    bacalhau job history j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881 --execution-id e-99362435
    ```

    Expected output:

    ```plaintext
    TIME      LEVEL           EXEC. ID    ...     NEW STATE          COMMENT
    ... [The output rows for the specific execution ID] ...
    16:46:04  ExecutionLevel  e-99362435  QmTSJgdN  6     BidAccepted        Completed
    ```

4.  **Retrieve the history in YAML format**:

    Get the job history in YAML format:

    ```bash
    bacalhau job history j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881 --output yaml
    ```

    Expected output:

    ```yaml
    ... [The YAML formatted output] ...
    ```

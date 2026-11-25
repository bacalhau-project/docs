---
description: Retrieve logs from a running or completed Bacalhau job for monitoring and debugging.
---

# Logs

## Description

The `bacalhau job logs` command allows users to retrieve logs from a job that has been previously submitted. This command is useful for tracking and debugging the progress and state of a running or completed job.

## Usage

```bash
bacalhau job logs [id] [flags]
```

## Flags

1. `-e`, `--execution-id string`:
   - Description: Retrieve logs from a specific execution of the job.
2. `-f`, `--follow`:
   - Description: Follow the logs in real time after fetching the current logs, similar to `tail -f` in Unix-like systems.
3. `-h`, `--help`:
   - Description: Display help information for the `logs` command.
4. `--namespace string`:
   - Description: Job namespace. If not provided, the default namespace is used.
5. `-t`, `--tail`:
   - Description: Tail the logs from the end of the log stream.
6. `-v`, `--version uint`:
   - Description: The job version to filter by. By default, the latest version is used.

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

1.  **Display Logs for a Previously Submitted Job with Full ID**:

    **Command:**

    ```bash
    bacalhau job logs j-51225160-807e-48b8-88c9-28311c7899e1
    ```

    **Expected Output:**

    ```bash
    [2023-09-24 09:01:32] INFO - Application started successfully.
    [2023-09-24 09:01:33] DEBUG - Initializing database connections.
    [2023-09-24 09:01:35] WARN - API rate limit approaching.
    [2023-09-24 09:02:01] ERROR - Failed to retrieve data from endpoint: /api/v1/data.
    [2023-09-24 09:05:00] INFO - Data sync completed with 4500 new records.
    ```

2.  **Follow Logs in Real-Time**:

    **Command:**

    ```bash
    bacalhau job logs --follow j-51225160-807e-48b8-88c9-28311c7899e1
    ```

    **Expected Output**:

    ```bash
    [2023-09-24 11:30:02] INFO - User 'john_doe' logged in successfully.
    [2023-09-24 11:30:15] DEBUG - Fetching data from cache for key: userSettings_john_doe.
    [2023-09-24 11:31:05] WARN - High memory usage detected: 85% of allocated resources.
    ... [Logs continue to appear in real-time] ...
    ```

3.  **Display Logs Using a Shortened ID**:

    **Command:**

    ```bash
    bacalhau job logs j-ebd9bf2f
    ```

    **Expected Output:**

    ```bash
    [2023-09-24 10:15:12] INFO - Application initialization sequence started.
    [2023-09-24 10:15:13] DEBUG - Loading configurations from /config/app.json.
    [2023-09-24 10:15:14] INFO - Connected to message broker successfully.
    [2023-09-24 10:16:00] ERROR - Failed to send email notification to user@example.com.
    ```

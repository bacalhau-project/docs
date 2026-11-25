---
description: Stop a previously submitted Bacalhau job by its identifier.
---

# Stop

## Description

The `bacalhau job stop` command allows users to terminate a previously submitted job. This is useful in scenarios where there's a need to halt a running job, perhaps due to misconfiguration or changed priorities.

## Usage

```bash
bacalhau job stop [id] [flags]
```

## Flags

- `-h`, `--help`:
  - Description: Displays help information for the `stop` command.
- `--namespace string`:
  - Description: Job namespace. If not provided, the default namespace is used.
- `--quiet`:
  - Description: If provided, the command will not display any output, neither to the standard output (stdout) nor to the standard error (stderr).

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

1.  **Stop a Specific Job**:

    If you wish to halt the execution of a job, you can utilize the `stop` command. Here's how you can achieve that:

    **Command:**

    ```bash
    bacalhau job stop j-10eb97de-14cd-4db4-96ec-561bb943309a
    ```

    **Expected Output:**

    ```plaintext
    Checking job status

    	Connecting to network  ................  done ✅  0.0s
    	  Verifying job state  ................  done ✅  0.2s
    	          Stopping job ................  done ✅  0.1s

    Job stop successfully submitted with evaluation ID: 397fd425-8b1a-491e-952a-0632492e7ece
    ```

2.  **Silently Stop a Job**:

    If you prefer to terminate a job without seeing any verbose feedback or messages, the `--quiet` option can be used.

    **Command:**

    ```bash
    bacalhau job stop j-63b5ec0c-b5bf-4398-a152-b46c07abe52a --quiet
    ```

    **Expected Output:**

    ```plaintext
    [No output displayed as the operation is run quietly.]
    ```

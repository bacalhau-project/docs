# Job

The `bacalhau job` command provides a suite of sub-commands to submit, query, and manage jobs within Bacalhau. Users can deploy jobs, obtain job details, track execution logs, and more.

## Usage

```bash
bacalhau job [command]
```

## Available Commands

1. [**describe**](./describe.md):

   - Description: Retrieves detailed information of a job using its ID.
   - Usage:

     ```bash
     bacalhau job describe
     ```

2. [**executions**](./executions.md):

   - Description: Lists all executions associated with a job, identified by its ID.
   - Usage:

     ```bash
     bacalhau job executions
     ```

3. [**get**](./get.md):

   - Description: Get the results of a job, identified by its ID.
   - Usage:

     ```bash
     bacalhau job get
     ```

4. [**history**](./history.md):

   - Description: Enumerates the historical events related to a job, identified by its ID.
   - Usage:

     ```bash
     bacalhau job history
     ```

5. [**list**](./list.md):

   - Description: Provides an overview of all submitted jobs.
   - Usage:

     ```bash
     bacalhau job list
     ```

6. [**logs**](./logs.md):

   - Description: Fetches and streams the logs from a currently executing job.
   - Usage:

     ```bash
     bacalhau job logs
     ```

7. **rerun**:

   - Description: Reruns an existing job, identified by its ID or name. Use `--version` to rerun a specific job version.
   - Usage:

     ```bash
     bacalhau job rerun <job-id-or-name>
     ```

8. [**run**](./run.md):

   - Description: Submits a job for execution using either a JSON or YAML configuration file.
   - Usage:

     ```bash
     bacalhau job run
     ```

9. [**stop**](./stop.md):

   - Description: Halts a previously submitted job.
   - Usage:

     ```bash
     bacalhau job stop
     ```

10. **validate**:

    - Description: Validates a JSON or YAML job specification without submitting it.
    - Usage:

      ```bash
      bacalhau job validate ./job.yaml
      ```

11. **versions**:

    - Description: Lists the versions of a job, identified by its ID or name.
    - Usage:

      ```bash
      bacalhau job versions <job-id-or-name>
      ```

For comprehensive details on any of the sub-commands, run:

```bash
bacalhau job [command] --help
```

## Flags

- `-h`, `--help`:
  - Description: Shows the help information for the `job` command.
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

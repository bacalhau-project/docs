# Job

The `bacalhau job` command provides a suite of sub-commands to submit, query, and manage jobs within Bacalhau. Users can deploy jobs, obtain job details, track execution logs, and more.

## Usage

```bash
bacalhau job [command]
```

## Available Commands

1. [**describe**](cli/job/describe.md):
   * Description: Retrieves detailed information of a job using its ID.
   *   Usage:

       ```bash
       bacalhau job describe
       ```
2. [**executions**](cli/job/executions.md):
   * Description: Lists all executions associated with a job, identified by its ID.
   *   Usage:

       ```bash
       bacalhau job executions
       ```
3. [**history**](cli/job/history.md):
   * Description: Enumerates the historical events related to a job, identified by its ID.
   *   Usage:

       ```bash
       bacalhau job history
       ```
4. [**list**](cli/job/list.md):
   * Description: Provides an overview of all submitted jobs.
   *   Usage:

       ```bash
       bacalhau job list
       ```
5. [**logs**](cli/job/logs.md):
   * Description: Fetches and streams the logs from a currently executing job.
   *   Usage:

       ```bash
       bacalhau job logs
       ```
6. [**run**](cli/job/run.md):
   * Description: Submits a job for execution using either a JSON or YAML configuration file.
   *   Usage:

       ```bash
       bacalhau job run
       ```
7. [**stop**](cli/job/stop.md):
   * Description: Halts a previously submitted job.
   *   Usage:

       ```bash
       bacalhau job stop
       ```

For comprehensive details on any of the sub-commands, run:

```bash
bacalhau job [command] --help
```

## Flags

* `-h`, `--help`:
  * Description: Shows the help information for the `job` command.

## Global Flags

1. `--api-host string`:
   * Description: Determines the host for RESTful communication between the client and server. This flag is overlooked if the `BACALHAU_API_HOST` environment variable is set.
   * Default: `bootstrap.production.bacalhau.org`
2. `--api-port int`:
   * Description: Designates the port for RESTful communication. This flag is bypassed if the `BACALHAU_API_PORT` environment variable is active.
   * Default: `1234`
3. `--log-mode logging-mode`:
   * Description: Chooses the preferred log format. Available choices are: `default`, `station`, `json`, `combined`, and `event`.
   * Default: `default`
4. `--repo string`:
   * Description: Specifies the path to the bacalhau repository.
   * Default: `$HOME/.bacalhau`

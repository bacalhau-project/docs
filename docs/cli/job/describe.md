---
title: Describe a Job
description: Retrieve the complete specification and current status of a Bacalhau job by its identifier.
---

# Describe

## Description

The `bacalhau job describe` command provides a detailed description of a specific job in YAML format. This description can be particularly useful when wanting to understand the attributes and current status of a specific job. To list all available jobs, the `bacalhau job list` command can be used.

## Usage

```bash
bacalhau job describe [id] [flags]
```

## Flags

- `-h`, `--help`:
  - Description: Display help for the `describe` command.
- `--namespace string`:
  - Description: Job namespace. If not provided, the default namespace is used.
- `--output format`:
  - Description: Specifies the desired output format for the command. Supported values are `json` and `yaml`.
  - Default: `yaml`
- `--pretty`:
  - Description: Pretty prints the output. This option is applicable only to `json` and `yaml` output formats.
- `-v`, `--version uint`:
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

1.  **Describe a Job with Full ID**:

    ```bash
    bacalhau job describe j-e3f8c209-d683-4a41-b840-f09b88d087b9
    ```

2.  **Describe a Job with Shortened ID**:

    ```bash
    bacalhau job describe j-47805f5c
    ```

3.  **Describe a Job with JSON Output**:

    ```bash
    bacalhau job describe --output json --pretty j-b6ad164a
    ```

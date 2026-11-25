---
description: Download a Bacalhau job's published results and retrieve its standard output and standard error streams.
---

# Get

## Description

The `bacalhau job get` command is used to get the results of the job, including stdout and stderr.

## Usage

```bash
bacalhau job get [id] [flags]
```

## Flags

- `--download-timeout-secs duration`:
  - Description: Timeout duration for IPFS downloads.
  - Default: `5m0s`
- `-h`, `--help`:
  - Description: Display help for the `get` command.
- `--namespace string`:
  - Description: Job namespace. If not provided, the default namespace is used.
- `--output-dir string`:
  - Description: Directory to write the output to.
- `--raw`:
  - Description: Download raw result CIDs instead of merging multiple CIDs into a single result.

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

1.  **Get the results of a job**:

    `bacalhau job get 51225160-807e-48b8-88c9-28311c7899e1`

2. **Get the results of a job, using a short ID**:

    `bacalhau job get 51225160`

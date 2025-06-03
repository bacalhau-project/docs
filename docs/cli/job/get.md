# Get

## Description

The `bacalhau job get` command is used to get the results of the job, including stdout and stderr.

## Usage

```bash
bacalhau job get [id] [flags]
```

## Flags

- `--download-timeout-secs duration`:
  - Description: Timeout duration for IPFS downloads. (default 5m0s)
- `-h`, `--help`:
  - Description: Display help for the `list` command.
- `output-dir string`:
  - Description: Directory to write the output to.
- `--raw`:
  - Description: Download raw result CIDs instead of merging multiple CIDs into a single result.

## Global Flags

- `--api-host string`:
  - Description: Defines the host for client-server communication via REST. Overridden by the `BACALHAU_API_HOST` environment variable, if set.
  - Default: `bootstrap.production.bacalhau.org`
- `--api-port int`:
  - Description: Sets the port for RESTful communication between the client and server. The `BACALHAU_API_PORT` environment variable takes precedence if set.
  - Default: `1234`
- `--log-mode logging-mode`:
  - Description: Designates the desired log format. Options include `default`, `station`, `json`, `combined`, and `event`.
  - Default: `default`
- `--repo string`:
  - Description: Points to the bacalhau repository location.
  - Default: `$HOME/.bacalhau`

## Examples

1.  **Get the results of a job**:

    `bacalhau job get 51225160-807e-48b8-88c9-28311c7899e1`

2. **Get the results of a job, using a short ID**:

    `bacalhau job get 51225160`
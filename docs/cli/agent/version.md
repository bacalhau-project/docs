# Version

The `bacalhau agent version` command is used to obtain the version of the bacalhau agent.

## Description:

Using this command, users can quickly retrieve the version of the agent, allowing them to confirm the specific release of the software they are using.

## Usage:

```bash
bacalhau agent version [flags]
```

## Flags:

- **`-h`, `--help`**:
  - Show help for the `version` command.
- **`--output format`**:
  - Defines the output format of the command's results. Accepted formats include "json" and "yaml".
- **`--pretty`**:
  - Used for pretty printing the output, enhancing readability. This flag is applicable only for the "json" and "yaml" output formats.

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

1.  **Retrieve the agent version**:

    Execute the command to get the agent version:

    ```bash
    bacalhau agent version
    ```

    Expected output:

    ```bash
    Bacalhau v1.9.6
    BuildDate 2026-11-25 01:55:56 +0000 UTC
    GitCommit a8cd25beef99a56d9b4c23af398b701241ce79e1
    ```

2.  **Retrieve the agent version in JSON format**:

    ```bash
    bacalhau agent version --output json
    ```

    Expected output:

    ```bash
    {"Major":"1","Minor":"9","GitVersion":"v1.9.6","GitCommit":"a8cd25beef99a56d9b4c23af398b701241ce79e1","BuildDate":"2026-11-25T01:55:56Z","GOOS":"linux","GOARCH":"amd64"}
    ```

3.  **Retrieve the agent version in Pretty-printed JSON format**:

    ```bash
    bacalhau agent version --output json --pretty
    ```

    Expected output:

    ```bash
    {
      "Major": "1",
      "Minor": "9",
      "GitVersion": "v1.9.6",
      "GitCommit": "a8cd25beef99a56d9b4c23af398b701241ce79e1",
      "BuildDate": "2026-11-25T01:55:56Z",
      "GOOS": "linux",
      "GOARCH": "amd64"
    }
    ```

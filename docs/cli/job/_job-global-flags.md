## Global Flags

- `--api-host string`:
  - Description: Specifies the host for the client and server to communicate through via REST. If the `BACALHAU_API_HOST` environment variable is set, this flag will be ignored.
  - Default: `bootstrap.production.bacalhau.org`
- `--api-port int`:
  - Description: Determines the port for the client and server to communicate on using REST. If the `BACALHAU_API_PORT` environment variable is set, this flag will be ignored.
  - Default: `1234`
- `--log-mode logging-mode`:
  - Description: Specifies the desired log format. Supported values include `default`, `station`, `json`, `combined`, and `event`.
  - Default: `default`
- `--repo string`:
  - Description: Defines the path to the bacalhau repository.
  - Default: `$HOME/.bacalhau`
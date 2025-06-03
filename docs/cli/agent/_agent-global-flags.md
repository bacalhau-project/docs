## Global Flags

- `--api-host string`:
  - Description: Specifies the host used for RESTful communication between the client and server. The flag is disregarded if the `BACALHAU_API_HOST` environment variable is set.
  - Default: `bootstrap.production.bacalhau.org`
- `--api-port int`:
  - Description: Specifies the port for REST communication. If the `BACALHAU_API_PORT` environment variable is set, this flag will be ignored.
  - Default: `1234`
- `--log-mode logging-mode`:
  - Description: Sets the desired log format. Options are: `default`, `station`, `json`, `combined`, and `event`.
  - Default: `default`
- `--repo string`:
  - Description: Defines the path to the bacalhau repository.
  - Default: \`\`$HOME/.bacalhau\`
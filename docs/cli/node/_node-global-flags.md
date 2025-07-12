## Global Flags

- `--api-host string`:
  - Specifies the host for client-server communication through REST. This flag is overridden if the `BACALHAU_API_HOST` environment variable is set.
  - Default: `"bootstrap.production.bacalhau.org"`
- `--api-port int`:
  - Designates the port for REST-based communication between client and server. This flag is overlooked if the `BACALHAU_API_PORT` environment variable is defined.
  - Default: `1234`
- `--log-mode logging-mode`:
  - Determines the log format preference.
  - Options: `'default','station','json','combined','event'`
  - Default: `'default'`
- `--repo string`:
  - Points to the bacalhau repository's path.
  - Default: `"`$HOME/.bacalhau"\`
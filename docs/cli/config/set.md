---
description: Set and validate a node configuration value. Learn the command syntax, key handling, examples, and when a node restart is required.
---

# Config Set

## Description:

The `bacalhau config set` command sets a value in the bacalhau node's configuration file. This command is used to modify the configuration file that the bacalhau node will reference for its settings. Key names in the configuration are case-insensitive. Additionally, the command validates the value being set based on the type of the configuration key, ensuring that only appropriate and valid configurations are applied.

:::note
Changes made using this command will be applied to the configuration file, but they do not immediately affect the running configuration of an active bacalhau node. The modifications will take effect only after the node is restarted.
:::

## Usage

```bash
bacalhau config set <key>=<value> [flags]
```

The older space-separated form, `bacalhau config set <key> <value>`, still works but is deprecated.

## Flags

- `-c`, `--config string`:
  - Description: Path to the config file to modify.
  - Default: `$BACALHAU_DIR/config.yaml`
- `-h`, `--help`:
  - Description: Displays help information for the `set` sub-command.

## Examples

### Configuring the API Port Value

```bash
bacalhau config set API.Port=9999

bacalhau config list | grep API.Port
 API.Port      9999      Port specifies the port number on which the API server listens ...

cat ~/.bacalhau/config.yaml
api:
    port: 9999
```

### Configuring the Logging Mode Value

```bash
bacalhau config set Logging.Mode=json

cat ~/.bacalhau/config.yaml
logging:
    mode: json
```

### Multiple Set commands append to the file

```bash
bacalhau config set API.Port=9999
bacalhau config set API.Host=0.0.0.0
bacalhau config set Logging.Mode=json

cat ~/.bacalhau/config.yaml
api:
    host: 0.0.0.0
    port: 9999
logging:
    mode: json
```

### Setting list and map values

Separate multiple values with commas:

```bash
bacalhau config set Compute.Orchestrators=nats://10.0.0.1:4222,nats://10.0.0.2:4222
bacalhau config set Labels=region=us-west,env=prod
```

### Set command value validation

#### Example of an unknown key

```bash
bacalhau config set Node.LoggingMode=json

Error: "node.loggingmode" is not a valid config key
Hint:  Run 'bacalhau config list' for the complete list of valid config keys
```

#### Example of invalid time duration value

```bash
bacalhau config set Compute.Heartbeat.Interval=10days

Error: config key: "compute.heartbeat.interval" expects a valid duration value, received: "10days"
Hint:  Accepted formats: 'h' (hours), 'm' (minutes), 's' (seconds), 'ms' (milliseconds), etc. Example: '2h45m', '30s', '100ms
```

# Config

The `bacalhau config` command is a parent command that offers sub-commands to modify and query information about the Bacalhau config. This can be useful for debugging, monitoring, or managing the nodes configuration.

## Usage

```bash
bacalhau config [command]
```

## Available Commands

1. [**list**](list.md):

   - Description: Lists the configuration keys and values of the bacalhau node. This command is useful for understanding how configuration keys map to their respective values, aiding in the use of the `bacalhau config set` command.
   - Usage:

     ```bash
     bacalhau config list
     ```

2. [**set**](set.md):

   - Description: Sets a value in the bacalhau node's configuration file. This command is used to modify the configuration file that the bacalhau node will reference for its settings.
   - Usage:

     ```bash
     bacalhau config set <key> <value>
     ```

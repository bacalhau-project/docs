# Config Overview

## Description

The `bacalhau config` command is a parent command that offers sub-commands to modify and query information about the Bacalhau config. This can be useful for debugging, monitoring, or managing the nodes configuration.

## Usage

```bash
bacalhau config [command]
```

## Available Commands

1. [**list**](https://github.com/bacalhau-project/docs/blob/main/dev/cli-reference/cli/config/list/README.md):
   * Description: Lists the configuration keys and values of the bacalhau node. This command is useful for understanding how configuration keys map to their respective values, aiding in the use of the `bacalhau config set` command.
   *   Usage:

       ```bash
       bacalhau config list
       ```
2. [**set**](https://github.com/bacalhau-project/docs/blob/main/dev/cli-reference/cli/config/set/README.md):
   * Description: Sets a value in the bacalhau node's configuration file. This command is used to modify the configuration file that the bacalhau node will reference for its settings.
   *   Usage:

       ```bash
       bacalhau config set <key> <value>
       ```
3. [**default**](https://github.com/bacalhau-project/docs/blob/main/dev/cli-reference/cli/config/default/README.md):
   * Description: Prints the default configuration of a bacalhau node to the standard output (stdout). This command is beneficial for viewing the baseline settings a bacalhau node will use before any user-defined configuration changes are applied.
   *   Usage:

       ```bash
       bacalhau config default
       ```
4. [**auto-resources**](https://github.com/bacalhau-project/docs/blob/main/dev/cli-reference/cli/config/auto-resources/README.md):
   * Description: Automatically sets compute resource values in the bacalhau node's configuration file based on the hardware resources of the user's machine. This command simplifies the process of allocating resources for jobs by dynamically adjusting the settings to match the machine's capabilities.
   *   Usage:

       ```bash
       bacalhau config auto-resources
       ```

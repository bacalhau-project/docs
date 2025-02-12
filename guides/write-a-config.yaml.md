---
icon: sliders-up
description: How to write the config.yaml file to configure your nodes
---

# Write a config.yaml

On installation, Bacalhau creates a `.bacalhau` directory that includes a `config.yaml` file tailored for your specific settings. This configuration file is the central repository for custom settings for your Bacalhau nodes.

When initializing a Bacalhau node, the system determines its configuration by following a specific hierarchy. First, it checks the default settings, then the `config.yaml` file, followed by environment variables, and finally, any command line flags specified during execution. Configurations are set and overridden in that sequence. This layered approach allows the  default Bacalhau settings to provide a baseline, while environment variables and command-line flags offer added flexibility. However, the `config.yaml` file offers a reliable way to predefine all necessary settings before node creation across environments, ensuring consistency and ease of management.

{% hint style="warning" %}
Modifications to the `config.yaml` file are not dynamically applied to existing nodes. A restart of the Bacalhau node is required for any changes to take effect.
{% endhint %}

Your `config.yaml` file starts off empty. However, you can see all available settings using the following command

```bash
bacalhau config list
```

This command showcases over a hundred configuration parameters related to users, security, metrics, updates, and node configuration, providing a comprehensive overview of the customization options available for your Bacalhau setup.

Let’s go through the different options and how your configuration file is structured.

### Config.yaml Structure&#x20;

The `bacalhau config list` command displays your configuration paths, segmented with periods to indicate each part you are configuring.&#x20;

Consider these configuration settings: `NameProvider` and `Labels`. These settings help set name and labels for your Bacalhau node.

In your `config.yaml`, these settings will be formatted like this:

```yaml
labels:
    NodeType: WebServer
    OS: Linux
nameprovider: puuid
```

### Configuration Options

Here are your Bacalhau configuration options in alphabetical order:

|   |   |   |
| - | - | - |
|   |   |   |
|   |   |   |
|   |   |   |

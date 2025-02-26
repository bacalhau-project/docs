---
icon: gear
---

# Configuration Management

## Intro to Bacalhau Configuration Management

To view the configuration that bacalhau will receive when a command is executed against it, users can run the [bacalhau config list](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/cli/config) command. Users who wish to see Bacalhau’s config represented as YAML may run `bacalhau config list --output=yaml`.

{% hint style="info" %}
In Bacalhau v1.5.0, there have been changes to how Bacalhau handles configuration:

1. The bacalhau repo `~/.bacalhau` is not the default for the Bacalhau config file.
2. Bacalhau searches for a default config file. The location is OS-dependent:&#x20;
   1. Linux: `~/.config/bacalhau/config.yaml`
   2. OSX: `~/.config/Application\ Support/bacalhau/config.yaml`
   3. Windows: `$AppData\bacalhau\config.yaml`. Usually, this is something like `C:\Users\username\bacalhau\config.yaml`
{% endhint %}

## Making Changes to the Default Config File

&#x20;As described above, bacalhau still has the concept of a default config file, which, for the sake of simplicity, we’ll say lives in `~/.config/bacalhau/config.yaml`. There are two ways this file can be modified:

1. A text editor `vim ~/.config/bacalhau/config.yaml`.
2. The [bacalhau config set](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/cli/config) command.

## Using a Non-Default Config File.&#x20;

The `--config` (or `-c` ) flag allows flexible configuration of bacalhau through various methods. You can use this flag multiple times to combine different configuration sources. To specify a config file to bacalhau, users may use the `--config` flag, passing a path to a config file for bacalhau to use. When this flag is provided bacalhau **will not** search for a default config, and will instead use the configuration provided to it by the [`--config` flag](./#using-keys-with-config-set-config-list-and-config).

## Bacalhau Configuration Keys

In Bacalhau, **configuration keys** are structured identifiers used to configure and customize the behavior of the application. They represent specific settings that control various aspects of Bacalhau's functionality, such as network parameters, API endpoints, node operations, and user interface options. The configuration file is organized in a tree-like structure using nested mappings (dictionaries) in YAML format. Each level of indentation represents a deeper level in the hierarchy.

Example: part of the config file

```yaml
API:
  Host: 0.0.0.0
  Port: 1234
  Auth:
    Methods:
      ClientKey:
      Type: challenge
NameProvider: puuid
DataDir: /home/frrist/.bacalhau
Orchestrator:
  Host: 0.0.0.0
  Port: 4222
  NodeManager:
    DisconnectTimeout: 1m0s
```

In this YAML configuration file:&#x20;

1. Top-Level Keys (Categories): `API`, `Orchestrator`&#x20;
2. Sub-Level Keys (Subcategories): Under `API`, we have `Host` and `Port`; Under `Orchestrator` we have `Host`, `Port` and `NodeManager`
3. Leaf Nodes (Settings): `Host`, `Port`, `NameProvider`, `DataDir`, `DisconnectTimeout` — these contain the actual configuration values.&#x20;

Config keys use dot notation to represent the path from the root of the configuration hierarchy down to a specific leaf node. Each segment in the key corresponds to a level in the hierarchy. Syntax is `Category.Subcategory(s)...LeafNode`

### Using Keys With `config set`, `config list` and `--config`

The `bacalhau config list` returns all keys and their corresponding value. The `bacalhau config set` command accepts a key and a value to set it to. The `--config` flag accepts a key and a value that will be applied to Bacalhau when it runs.

### Example Interaction With the Bacalhau Configuration System&#x20;

#### How to Modify the `API Host` Using `bacalhau config set` in the Default Config File:

1. Run `bacalhau config list` to find the appropriate key&#x20;

```bash
bacalhau config list
 KEY VALUE DESCRIPTION
 ... ... ...
 api.host 0.0.0.0 Host specifies the hostname or IP address o
 ... ... ...
```

2. Run the `bacalhau config set` command

```bash
bacalhau config set api.host 192.186.0.1
```

3. Observe how `bacalhau config list` reflects the new setting

```bash
bacalhau config list
 KEY VALUE DESCRIPTION
 ... ... ...
 api.host 192.168.0.1 Host specifies the hostname or IP address
 ... ... ...
```

4. Observe the change has been reflected in the default config file

```bash
cat ~/.config/bacalhau/config.yaml
api:
    host: 192.168.0.1
```

How to Modify the API Host Using `bacalhau config set` a Custom Config File

1. Run the config set command with the flag&#x20;

```bash
bacalhau config set --config=custom.yaml api.host 10.0.0.1
```

2. Observe the created config file

```bash
cat custom.yaml
api:
 host: 10.0.0.1
```

Observe the default config and output of `bacalhau config list` does not reflect this change.

How to Start Bacalhau With a Custom Config File

```bash
bacalhau --config=custom.yaml serve
```

## Usage of the `--config` Flag&#x20;

The `--config` (or `-c`) flag allows flexible configuration of bacalhau through various methods. You can use this flag multiple times to combine different configuration sources.&#x20;

#### Usage&#x20;

```bash
bacalhau [command] --config <option> [--config <option> ...] 
```

or using the short form:&#x20;

```bash
bacalhau [command] -c <option> [-c <option> ...]
```

### &#x20;Configuration Options

1. **YAML Config Files**: Specify paths to YAML configuration files. Example:

```bash
--config path/to/config.yaml
```

2. **Key-Value Pairs**: Set specific configuration values using dot notation. Example:

```bash
--config WebUI.Enabled=true
```

3. **Boolean Flags**: Enable boolean options by specifying the key alone. Example:

<pre class="language-bash"><code class="lang-bash"><strong>--config WebUI.Enabled
</strong></code></pre>

### Precedence&#x20;

When multiple configuration options are provided, they are applied in the following order of precedence (highest to lowest):

1. Command-line key-value pairs and boolean flags
2. YAML configuration files
3. Default values&#x20;

Within each category, options specified later override earlier ones.&#x20;

### Examples&#x20;

Using a single config file: &#x20;

```bash
bacalhau serve --config my-config.yaml
```

Merging multiple config files:&#x20;

```bash
bacalhau serve -c base-config.yaml -c override-config.yaml
```

&#x20;Overriding specific values:&#x20;

```bash
bacalhau serve \
-c config.yaml \
-c WebUI.Listen=0.0.0.0:9999 \
-c NameProvider=hostname
```

&#x20;Combining file and multiple overrides:&#x20;

```bash
bacalhau serve \
-c config.yaml \
-c WebUI.Enabled \
-c API.Host=192.168.1.5
```

&#x20;In the last example, `WebUI.Enabled` will be set to `true`, `API.Host` will be `192.168.1.5`, and other values will be loaded from `config.yaml` if present.&#x20;

Remember, later options override earlier ones, allowing for flexible configuration management.

## Usage of the `bacalhau completion` Command

The `bacalhau completion` command will generate shell completion for your shell. You can use the command like:&#x20;

```bash
bacalhau completion <bash|fish|powershell|zsh> > /tmp/bacalhau_completion && source /tmp/bacalhau_completion 
```

After running the above command, commands like `bacalhau config set` and `bacalhau --config` will have auto-completion for all possible configuration values along with their descriptions

## Support <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

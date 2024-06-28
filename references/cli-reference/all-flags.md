# CLI Commands Overview

The following commands refer to bacalhau cli version `v1.3.2`. For installing or upgrading a client, follow the instructions in the [installation page](../../getting-started/installation.md). Run `bacalhau version` in a terminal to check what version you have.

Let’s run the `bacalhau -- help` command in the terminal to find out information about available commands and flags:

```
bacalhau --help
Compute over data

Usage:
  bacalhau [command]

Available Commands:
  agent       Commands to query agent information.
  cancel      Cancel a previously submitted job
  completion  Generate the autocompletion script for the specified shell
  config      Interact with the bacalhau configuration system.
  create      Create a job using a json or yaml file.
  describe    Describe a job on the network
  devstack    Start a cluster of bacalhau nodes for testing and development
  docker      Run a docker job on the network (see run subcommand)
  exec        Execute a specific job type
  get         Get the results of a job
  help        Help about any command
  id          Show bacalhau node id info
  job         Commands to submit, query and update jobs.
  list        List jobs on the network
  logs        Follow logs from a currently executing job
  node        Commands to query and update nodes information.
  serve       Start the bacalhau compute node
  validate    validate a job using a json or yaml file.
  version     Get the client and server version.
  wasm        Run and prepare WASM jobs on the network

Flags:
      --api-host string         The host for the client and server to communicate on (via REST).
                                Ignored if BACALHAU_API_HOST environment variable is set. (default "bootstrap.production.bacalhau.org")
      --api-port int            The port for the client and server to communicate on (via REST).
                                Ignored if BACALHAU_API_PORT environment variable is set. (default 1234)
      --cacert string           The location of a CA certificate file when self-signed certificates
                                        are used by the server
  -h, --help                    help for bacalhau
      --insecure                Enables TLS but does not verify certificates
      --log-mode logging-mode   Log format: 'default','station','json','combined','event' (default default)
      --repo string             path to bacalhau repo (default "/home/user/.bacalhau")
      --tls                     Instructs the client to use TLS

Use "bacalhau [command] --help" for more information about a command.
```



{% hint style="info" %}
Global flags

<details>

<summary><code>--api-host string</code></summary>

Determines the host for RESTful communication between the client and server. This flag is ignored if the `BACALHAU_API_HOST` environment variable is set.\
Default: `bootstrap.production.bacalhau.org`

</details>

<details>

<summary><code>--api-port int</code></summary>

Determines the port for RESTful communication between the client and server. This flag is ignored if the `BACALHAU_API_PORT` environment variable is active.\
Default: `1234`

</details>

<details>

<summary><code>--log-mode logging-mode</code></summary>

Determines the preferred log format. Available log formats are: `default`, `station`, `json`, `combined`, `event`.\
Default: `default`

</details>

<details>

<summary><code>--repo string</code></summary>

Specifies the path to the bacalhau repository.\
Default: `$HOME/.bacalhau`

</details>
{% endhint %}

## Agent[​](http://localhost:3000/dev/cli-reference/all-flags#agent) <a href="#agent" id="agent"></a>

The `bacalhau agent` command is a parent command that offers sub-commands to query information about the Bacalhau agent. This can be useful for debugging, monitoring, or managing the agent's behavior and health.

Usage:

```bash
bacalhau agent [command]
```

Available Commands:

### alive[​](http://localhost:3000/dev/cli-reference/all-flags#alive) <a href="#alive" id="alive"></a>

```bash
bacalhau agent alive [flags]
```

The `bacalhau agent alive` command retrieves the agent's liveness and health information. This can be helpful to determine if the agent is running and healthy.

```bash
Flags:

 -h, --help            help for alive
     --output format   The output format for the command (one of ["json" "yaml"]) (default yaml)
     --pretty          Pretty print the output. Only applies to json and yaml output formats.
```

{% hint style="info" %}
<details>

<summary><code>--output format</code></summary>

Determines the format in which the output is displayed. Available formats include `JSON` and `YAML`. Default: `yaml`

</details>

<details>

<summary><code>--pretty</code></summary>

Formats the output for enhanced readability. This flag is relevant only when using JSON or YAML output formats.

</details>
{% endhint %}

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples)

Let's have a look at the basic usage output:

```bash
bacalhau agent alive

Expected Output:
Status: OK
```

Compare the output in JSON format:

```bash
bacalhau agent alive --output json --pretty

Expected Output:
{
  "Status": "OK"
}
```

### node[​](http://localhost:3000/dev/cli-reference/all-flags#node) <a href="#node" id="node"></a>

```bash
bacalhau agent node [flags]
```

The `bacalhau agent node` command gathers the agent's node-related information. This might include details about the machine or environment where the agent is running, available resources, supported engines, etc.

```bash
Flags:
  -h, --help            help for node
      --output format   The output format for the command (one of ["json" "yaml"]) (default yaml)
      --pretty          Pretty print the output. Only applies to json and yaml output formats.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-1)

To retrieve Node Information in Default Format (YAML), run:

```bash
bacalhau agent node
```

To retrieve Node Information in JSON Format, run:

```bash
bacalhau agent node --output json
```

To retrieve Node Information in Pretty-printed JSON Format, run:

```bash
bacalhau agent node --output json --pretty
```

### version[​](http://localhost:3000/dev/cli-reference/all-flags#version) <a href="#version" id="version"></a>

```bash
bacalhau agent version [flags]
```

The `bacalhau agent version` command is used to obtain the version of the bacalhau agent.

```bash
 Flags:
  -h, --help            help for version
      --output format   The output format for the command (one of ["json" "yaml"])
      --pretty          Pretty print the output. Only applies to json and yaml output formats.
```

#### **Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-2)

Let's have a look at the command execution in the terminal:

```bash
bacalhau agent version

Expected Output:
Bacalhau v1.2.0
BuildDate 2023-12-11 18:46:13 +0000 UTC
GitCommit 4252ba4406c40c3d01bdcf58709f8d7a705fdc75
```

To retrieve the agent version in JSON format, run:

```bash
bacalhau agent version --output json

Expected Output:
{"Major":"1","Minor":"2","GitVersion":"v1.2.0","GitCommit":"4252ba4406c40c3d01bdcf58709f8d7a705fdc75","BuildDate":"2023-12-11T18:46:13Z","GOOS":"linux","GOARCH":"amd64"}
```

To retrieve the agent version in Pretty-printed JSON format, run:

```bash
bacalhau agent version --output json --pretty

Expected Output:
{
  "Major": "1",
  "Minor": "2",
  "GitVersion": "v1.2.0",
  "GitCommit": "4252ba4406c40c3d01bdcf58709f8d7a705fdc75",
  "BuildDate": "2023-12-11T18:46:13Z",
  "GOOS": "linux",
  "GOARCH": "amd64"
}
```

## Cancel[​](http://localhost:3000/dev/cli-reference/all-flags#cancel) <a href="#cancel" id="cancel"></a>

The `bacalhau cancel` command cancels a job that was previously submitted and stops it running if it has not yet completed.

Usage:

```bash
bacalhau cancel [id] [flags]
```

```bash
Flags:
  -h, --help    help for cancel
      --quiet   Do not print anything to stdout or stderr
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-3)

To cancel a previously submitted job, run:

```bash
 bacalhau cancel 51225160-807e-48b8-88c9-28311c7899e1
```

To cancel a job using a short ID, run:

```bash
 bacalhau cancel 51225160
```

## Completion[​](http://localhost:3000/dev/cli-reference/all-flags#completion) <a href="#completion" id="completion"></a>

The `bacalhau completion` command generates the autocompletion script for bacalhau for the specified shell.

Usage:

```bash
bacalhau completion [command]
```

Available Commands:

### bash[​](http://localhost:3000/dev/cli-reference/all-flags#bash) <a href="#bash" id="bash"></a>

```bash
bacalhau completion bash [flags]
```

The `bacalhau completion bash` command generates the autocompletion script for bash.

```bash
Flags:
  -h, --help              help for bash
      --no-descriptions   disable completion descriptions
```

{% hint style="info" %}
This script depends on the 'bash-completion' package. If it is not installed already, you can install it via your OS's package manager.
{% endhint %}

### fish[​](http://localhost:3000/dev/cli-reference/all-flags#fish) <a href="#fish" id="fish"></a>

```bash
bacalhau completion fish [flags]
```

The `bacalhau completion fish` command generates the autocompletion script for the fish shell.

```bash
Flags:
  -h, --help              help for fish
      --no-descriptions   disable completion descriptions
```

{% hint style="info" %}
To load completions in your current shell session:\
`bacalhau completion fish | source`\
To load completions for every new session, execute once:\
`bacalhau completion fish > ~/.config/fish/completions/bacalhau.fish`\
You will need to start a new shell for this setup to take effect.
{% endhint %}

### powershell[​](http://localhost:3000/dev/cli-reference/all-flags#powershell) <a href="#powershell" id="powershell"></a>

```
bacalhau completion powershell [flags]
```

The `bacalhau completion powershell` command generates the autocompletion script for powershell.

```bash
Flags:
  -h, --help              help for powershell
      --no-descriptions   disable completion descriptions
```

{% hint style="info" %}
To load completions in your current shell session:\
`bacalhau completion powershell | Out-String | Invoke-Expression`\
To load completions for every new session, add the output of the above command to your powershell profile.
{% endhint %}

### zsh[​](http://localhost:3000/dev/cli-reference/all-flags#zsh) <a href="#zsh" id="zsh"></a>

```bash
bacalhau completion zsh [flags]
```

The `bacalhau completion zsh` command generates the autocompletion script for the zsh shell.

```bash
Flags:
  -h, --help              help for zsh
      --no-descriptions   disable completion descriptions
```

{% hint style="info" %}
If shell completion is not already enabled in your environment you will need to enable it. You can execute the following once:\
`echo "autoload -U compinit; compinit" >> ~/.zshrc`
{% endhint %}

## Config[​](http://localhost:3000/dev/cli-reference/all-flags#config) <a href="#config" id="config"></a>

The `bacalhau config` command is a parent command that offers sub-commands to modify and query information about the Bacalhau config. This can be useful for debugging, monitoring, or managing the nodes configuration.

Usage:

```bash
bacalhau config [command]
```

Available Commands:

### auto-resources[​](http://localhost:3000/dev/cli-reference/all-flags#auto-resources) <a href="#auto-resources" id="auto-resources"></a>

```bash
bacalhau config auto-resources [flags]
```

The `bacalhau config auto-resources` command automatically configures compute resource values in the bacalhau node's configuration file based on the hardware resources of the user's machine. This command streamlines the process of resource allocation for jobs, dynamically adjusting settings to align with the capabilities of the machine. It is designed to simplify the task of resource management, ensuring that the node operates efficiently and effectively within the hardware's limits.

{% hint style="info" %}
The `bacalhau config auto-resources` command intelligently adjusts resource allocation settings based on the specific hardware configuration of your machine, promoting optimal utilization for bacalhau jobs. Due to the dynamic nature of this command, the specific values set in the configuration will vary depending on the available hardware resources of the machine in use. This functionality is particularly beneficial for users who seek to optimize their node's performance without the need for manual calculations of resource limits. It is important for users to understand that these settings will directly impact the number and types of jobs their node can manage at any given time, based on the machine's resource capacity.
{% endhint %}

```bash
Flags:
      --default-job-percentage int   Percentage expressed as a number from 1 to 100 representing default per job amount of resources jobs will get when they don't specify any resource limits themselves (values over 100 will be rejected (default 75)
  -h, --help                         help for auto-resources
      --job-percentage int           Percentage expressed as a number from 1 to 100 representing per job amount of resource the system can be using at one time for a single job (values over 100 will be rejected) (default 75)
      --queue-job-percentage int     Percentage expressed as a number from 1 to 100 representing the total amount of resource the system can queue at one time in aggregate for all jobs (values over 100 are accepted) (default 150)
      --total-percentage int         Percentage expressed as a number from 1 to 100 representing total amount of resource the system can be using at one time in aggregate for all jobs (values over 100 will be rejected) (default 75)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-4)

Ran on an Apple M1 Max with 10 Cores and 64GB RAM

1. Basic Usage:

```bash
bacalhau config auto-resources
```

Config File:

```yaml
  node:
      compute:
          capacity:
              defaultjobresourcelimits:
                  cpu: 7500m
                  disk: 568 GB
                  gpu: "0"
                  memory: 52 GB
              jobresourcelimits:
                  cpu: 7500m
                  disk: 568 GB
                  gpu: "0"
                  memory: 52 GB
              queueresourcelimits:
                  cpu: 15000m
                  disk: 1.1 TB
                  gpu: "0"
                  memory: 103 GB
              totalresourcelimits:
                  cpu: 7500m
                  disk: 568 GB
                  gpu: "0"
                  memory: 52 GB
```

2. Queue 500% system resources:

```bash
bacalhau config auto-resources --queue-job-percentage=500
```

Config File:

```yaml
   node:
       compute:
           capacity:
               defaultjobresourcelimits:
                   cpu: 7500m
                   disk: 568 GB
                   gpu: "0"
                   memory: 52 GB
               jobresourcelimits:
                   cpu: 7500m
                   disk: 568 GB
                   gpu: "0"
                   memory: 52 GB
               queueresourcelimits:
                   cpu: 50000m
                   disk: 3.8 TB
                   gpu: "0"
                   memory: 344 GB
               totalresourcelimits:
                   cpu: 7500m
                   disk: 568 GB
                   gpu: "0"
                   memory: 52 GB
```

### default[​](http://localhost:3000/dev/cli-reference/all-flags#default) <a href="#default" id="default"></a>

```bash
bacalhau config default [flags]
```

The `bacalhau config default` command prints the default configuration of a bacalhau node to the standard output (stdout). This command is advantageous for users to view the baseline settings a bacalhau node will use in the absence of any user-defined configuration changes. It provides a clear view of the default operational parameters of the node, aiding users in understanding and customizing their configuration from a known baseline.

{% hint style="info" %}
The output of this command shows the initial default settings for a new bacalhau node and is useful for understanding the foundational settings for customization. To apply these default settings, you can redirect the output to your configuration file using `bacalhau config default > ~/.bacalhau/config.yaml`, which overwrites your current configuration file with the default settings. However, if you wish to always use the latest default settings, especially if the defaults are updated over time, consider deleting your existing configuration file (e.g., `~/.bacalhau/config.yaml`). This approach ensures that your bacalhau node uses the most current defaults, circumventing potential discrepancies between the latest defaults and those captured in an older configuration file created with `bacalhau config default`.
{% endhint %}

```bash
Flags:
  -h, --help          help for default
      --path string   sets path dependent config fields (default $HOME/.bacalhau)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-5)

```bash
bacalhau config default > ~/.bacalhau/config.yaml
```

This command redirects the default configuration output directly into the bacalhau configuration file at `~/.bacalhau/config.yaml`, effectively resetting it to default settings.

### list[​](http://localhost:3000/dev/cli-reference/all-flags#list) <a href="#list" id="list"></a>

```bash
bacalhau config list [flags]
```

The `bacalhau config list` command lists the configuration keys and values of the bacalhau node. This command is useful for understanding how configuration keys map to their respective values, aiding in the use of the bacalhau config set command.

{% hint style="info" %}
Configuration values displayed by this command represent the settings that will be applied when the bacalhau node is next restarted. It is important to note that these values may not reflect the current operational configuration of an active bacalhau node. The displayed configuration is relevant and accurate for a node that is either not currently running or that has been restarted after the execution of this command.
{% endhint %}

```bash
Flags:
  -h, --help            help for the list sub-command
      --hide-header     do not print the column headers (default false)
      --no-style        remove all styling from table output (default false)
      --output format   The output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty          Pretty print the output. Only applies to json and yaml output formats (default true)
      --wide            Print full values in the table results (default false)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-6)

Basic Usage:

```bash
bacalhau config list

KEY                                                             VALUE
 metrics.eventtracerpath                                         /dev/null
 metrics.libp2ptracerpath                                        /dev/null
 node.allowlistedlocalpaths                                      []
 node.bootstrapaddresses                                         [/ip4/35.245.161.250/tcp/1235/p2p/QmbxGS
                                                                 sM6saCTyKkiWSxhJCt6Fgj7M9cns1vzYtfDbB5Ws
                                                                 /ip4/34.86.254.26/tcp/1235/p2p/QmeXjeQDi
                                                                 nxm7zRiEo8ekrJdbs7585BM6j7ZeLVFrA7GPe /i
                                                                 p4/35.245.215.155/tcp/1235/p2p/QmPLPUUja
                                                                 VE3wQNSSkxmYoaBPHVAWdjBjDYmMkWvtMZxAf]
 node.clientapi.host                                             bootstrap.production.bacalhau.org
 node.clientapi.port                                             1234
 
 ...
```

### set[​](http://localhost:3000/dev/cli-reference/all-flags#set) <a href="#set" id="set"></a>

```
bacalhau config set <key> <value>
```

The `bacalhau config set` command sets a value in the bacalhau node's configuration file. This command is used to modify the configuration file that the bacalhau node will reference for its settings. Key names in the configuration are case-insensitive. Additionally, the command validates the value being set based on the type of the configuration key, ensuring that only appropriate and valid configurations are applied.

{% hint style="info" %}
Changes made using this command will be applied to the configuration file, but they do not immediately affect the running configuration of an active bacalhau node. The modifications will take effect only after the node is restarted.
{% endhint %}

```bash
Flags:
  -h, --help   help for set
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-7)

1. Configuring the Server API Port Value

```bash
bacalhau config set node.serverapi.port 9999
```

Verifying that the parameter was successfully set

```bash
bacalhau config list | grep serverapi.port
 node.serverapi.port                                             9999                                     
cat ~/.bacalhau/config.yaml
node:
    serverapi:
        port: 9999
```

2. Configuring multiple values

```bash
bacalhau config set node.serverapi.port 9999
bacalhau config set node.serverapi.host 0.0.0.0
bacalhau config set node.loggingmode json
```

Verifying that the parameters were successfully set

```bash
cat ~/.bacalhau/config.yaml
node:
    loggingmode: json
    serverapi:
        host: 0.0.0.0
        port: 9999
```

## Create[​](http://localhost:3000/dev/cli-reference/all-flags#create) <a href="#create" id="create"></a>

The `bacalhau create` command is used to submit a job to the network in a declarative way by writing a jobspec instead of writing a command. JSON and YAML formats are accepted.

Usage:

```bash
bacalhau create [flags]
```

```bash
Flags:
      --download                         Download the results and print stdout once the job has completed
      --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
      --dry-run                          Do not submit the job, but instead print out what will be submitted
  -f, --follow                           When specified will follow the output from the job as it runs
  -g, --gettimeout int                   Timeout for getting the results of a job in --wait (default 10)
  -h, --help                             help for create
      --id-only                          Print out only the Job ID on successful submission.
      --node-details                     Print out details of all nodes (overridden by --id-only).
      --output-dir string                Directory to write the output to.
      --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
      --wait                             Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
      --wait-timeout-secs int            When using --wait, how many seconds to wait for the job to complete before giving up. (default 600)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-8)

1. To create a job using the data in `job.yaml`, run:

```bash
bacalhau create ./job.yaml
```

2. To create a new job from an already executed job, run:

```bash
bacalhau describe 6e51df50 | bacalhau create
```

### YAML format[​](http://localhost:3000/dev/cli-reference/all-flags#yaml-format) <a href="#yaml-format" id="yaml-format"></a>

Let's have a look at a job example in **YAML format**:

```yaml
spec:
    engine: Docker
    verifier: Noop
    publisher: IPFS
    docker:
        image: ubuntu
        entryPoint:
            - echo
        parameters:
            - Hello
            - World
    outputs:
        - name: outputs
          path: /outputs
deal:
    concurrency: 1
```

This example shows how a YAML file can be structured to describe a job and its parameters, which can then be used in Bacalhau to perform executions.

### UCAN Invocation format[​](http://localhost:3000/dev/cli-reference/all-flags#ucan-invocation-format) <a href="#ucan-invocation-format" id="ucan-invocation-format"></a>

You can also specify a job to run using a [UCAN Invocation](https://github.com/ucan-wg/invocation) object in JSON format. For the fields supported by Bacalhau, see the [IPLD schema](https://github.com/bacalhau-project/bacalhau/blob/main/pkg/model/schemas/bacalhau.ipldsch).

There is no support for sharding, concurrency or minimum bidding for these jobs.

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-9)

Refers to example models at balcalhau repository under [pkg/model/tasks](https://github.com/bacalhau-project/bacalhau/tree/main/pkg/model/tasks)

An example UCAN Invocation that runs the same job as the above example would look like:

```bash
{
  "with": "ubuntu",
  "do": "docker/run",
  "inputs": {
    "entrypoint": ["echo"],
    "parameters": ["hello", "world"],
    "workdir": "/",
    "mounts": {},
    "outputs": {
      "/outputs": ""
    }
  },
  "meta": {
    "bacalhau/config": {
      "verifier": 1,
      "publisher": 4,
      "annotations": ["hello"],
      "resources": {
        "cpu": 1,
        "disk": 1073741824,
        "memory": 1073741824,
        "gpu": 0
      },
      "timeout": 300e9,
      "dnt": false
    }
  }
}
```

An example UCAN Invocation that runs a WebAssembly job might look like:

```json
{
	"with": "ipfs://bafybeig7mdkzcgpacpozamv7yhhaelztfrnb6ozsupqqh7e5uyqdkijegi",
	"do": "wasm32-wasi/run",
	"inputs": {
		"entrypoint": "_start",
		"parameters": ["/inputs/data.tar.gz"],
		"mounts": {
			"/inputs": "https://www.example.com/data.tar.gz"
		},
		"outputs": {
			"/outputs": ""
		},
		"env": {
			"HELLO": "world"
		}
	},
	"meta": {
    }
  }
}
```

Using a UCAN Invocation object allows you to customize the parameters of job execution in Bacalhau in a more flexible and detailed way.

## Describe[​](http://localhost:3000/dev/cli-reference/all-flags#describe) <a href="#describe" id="describe"></a>

The `bacalhau describe` command provides a full description of a job in YAML format. Short form and long form of the job id are accepted.

Usage:

```bash
bacalhau describe [id] [flags]
```

```bash
Flags:
  -h, --help             help for describe
      --include-events   Include events in the description (could be noisy)
      --json             Output description as JSON (if not included will be outputted as YAML by default)
      --spec             Output Jobspec to stdout
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-10)

1. To describe a job with the full ID, run:

```bash
bacalhau describe e3f8c209-d683-4a41-b840-f09b88d087b9
```

2. To describe a job with the shortened ID, run:

```bash
bacalhau describe e3f8c209
```

3. To describe a job and include all server and local events, run:

```bash
bacalhau describe e3f8c209 --include-events  
```

## Devstack[​](http://localhost:3000/dev/cli-reference/all-flags#devstack) <a href="#devstack" id="devstack"></a>

The `bacalhau devstack` command is used to start a cluster of nodes and run a job on them.

Usage:

```bash
bacalhau devstack [flags]
```

```bash
Flags:
      --Noop                                             Use the noop executor for all jobs
      --allow-listed-local-paths strings                 Local paths that are allowed to be mounted into jobs. Multiple paths can be specified by using this flag multiple times.
      --autocert string                                  Specifies a host name for which ACME is used to obtain a TLS Certificate.
                                                         Using this option results in the API serving over HTTPS
      --bad-compute-actors int                           How many compute nodes should be bad actors
      --bad-requester-actors int                         How many requester nodes should be bad actors
      --compute-nodes int                                How many compute only nodes should be started in the cluster (default 3)
      --cpu-profiling-file string                        File to save CPU profiling to
      --default-job-execution-timeout duration           default value for the execution timeout this compute node will assign to jobs with no timeout requirement defined. (default 10m0s)
      --disable-engine strings                           Engine types to disable
      --disable-storage strings                          Storage types to disable
      --disabled-publisher strings                       Publisher types to disable
  -h, --help                                             help for devstack
      --hybrid-nodes int                                 How many hybrid (requester and compute) nodes should be started in the cluster
      --ignore-physical-resource-limits                  When set the compute node will ignore is physical resource limits
      --job-execution-timeout-bypass-client-id strings   List of IDs of clients that are allowed to bypass the job execution timeout check
      --job-negotiation-timeout duration                 Timeout value to hold a bid for a job. (default 3m0s)
      --job-selection-accept-networked                   Accept jobs that require network access.
      --job-selection-data-locality local|anywhere       Only accept jobs that reference data we have locally ("local") or anywhere ("anywhere"). (default Anywhere)
      --job-selection-probe-exec string                  Use the result of a exec an external program to decide if we should take on the job.
      --job-selection-probe-http string                  Use the result of a HTTP POST to decide if we should take on the job.
      --job-selection-reject-stateless                   Reject jobs that don't specify any data.
      --limit-job-cpu string                             Job CPU core limit to run all jobs (e.g. 500m, 2, 8).
      --limit-job-gpu string                             Job GPU limit to run all jobs (e.g. 1, 2, or 8).
      --limit-job-memory string                          Job Memory limit to run all jobs  (e.g. 500Mb, 2Gb, 8Gb).
      --limit-total-cpu string                           Total CPU core limit to run all jobs (e.g. 500m, 2, 8).
      --limit-total-gpu string                           Total GPU limit to run all jobs (e.g. 1, 2, or 8).
      --limit-total-memory string                        Total Memory limit to run all jobs  (e.g. 500Mb, 2Gb, 8Gb).
      --max-job-execution-timeout duration               The maximum execution timeout this compute node supports. Jobs with higher timeout requirements will not be bid on. (default 2562047h47m16s)
      --memory-profiling-file string                     File to save memory profiling to
      --min-job-execution-timeout duration               The minimum execution timeout this compute node supports. Jobs with lower timeout requirements will not be bid on. (default 500ms)
      --peer string                                      Connect node 0 to another network node
      --pluggable-executors                              Will use pluggable executors when set to true
      --public-ipfs                                      Connect devstack to public IPFS
      --requester-nodes int                              How many requester only nodes should be started in the cluster (default 1)
      --stack-repo string                                Folder to act as the devstack configuration repo
      --tlscert string                                   Specifies a TLS certificate file to be used by the requester node
      --tlskey string                                    Specifies a TLS key file matching the certificate to be used by the requester node
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-11)

1. To create a devstack cluster with a single requester node and 3 compute nodes (default values), run:

```bash
bacalhau devstack
```

2. To create a devstack cluster with 2 requester nodes and 10 compute nodes, run:

```bash
bacalhau devstack  --requester-nodes 2 --compute-nodes 10
```

3. To create a devstack cluster with a single hybrid (requester and compute) node, run:

```bash
bacalhau devstack  --requester-nodes 0 --compute-nodes 0 --hybrid-nodes 1
```

4. To run a devstack and create (or use) the config repo in a specific folder, run:

```bash
bacalhau devstack  --stack-repo ./my-devstack-configuration
```

## Docker run[​](http://localhost:3000/dev/cli-reference/all-flags#docker-run) <a href="#docker-run" id="docker-run"></a>

The `bacalhau docker run` command runs a job using the Docker executor on the node.

Usage:

```bash
bacalhau docker run [flags] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

```bash
Flags:
      --concurrency int                  How many nodes should run the job (default 1)
      --cpu string                       Job CPU cores (e.g. 500m, 2, 8).
      --disk string                      Job Disk requirement (e.g. 500Gb, 2Tb, 8Tb).
      --domain stringArray               Domain(s) that the job needs to access (for HTTP networking)
      --download                         Should we download the results once the job is complete?
      --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
      --dry-run                          Do not submit the job, but instead print out what will be submitted
      --entrypoint strings               Override the default ENTRYPOINT of the image
  -e, --env strings                      The environment variables to supply to the job (e.g. --env FOO=bar --env BAR=baz)
  -f, --follow                           When specified will follow the output from the job as it runs
  -g, --gettimeout int                   Timeout for getting the results of a job in --wait (default 10)
      --gpu string                       Job GPU requirement (e.g. 1, 2, 8).
  -h, --help                             help for run
      --id-only                          Print out only the Job ID on successful submission.
  -i, --input storage                    Mount URIs as inputs to the job. Can be specified multiple times. Format: src=URI,dst=PATH[,opt=key=value]
                                         Examples:
                                         # Mount IPFS CID to /inputs directory
                                         -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72
                                         # Mount S3 object to a specific path
                                         -i s3://bucket/key,dst=/my/input/path
                                         # Mount S3 object with specific endpoint and region
                                         -i src=s3://bucket/key,dst=/my/input/path,opt=endpoint=https://s3.example.com,opt=region=us-east-1
      --ipfs-connect string              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
      --ipfs-serve-path string           path local Ipfs node will persist data to
      --ipfs-swarm-addrs strings         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
      --ipfs-swarm-key string            Optional IPFS swarm key required to connect to a private IPFS swarm
  -l, --labels strings                   List of labels for the job. Enter multiple in the format '-l a -l 2'. All characters not matching /a-zA-Z0-9_:|-/ and all emojis will be stripped.
      --memory string                    Job Memory requirement (e.g. 500Mb, 2Gb, 8Gb).
      --network network-type             Networking capability required by the job. None, HTTP, or Full (default None)
      --node-details                     Print out details of all nodes (overridden by --id-only).
  -o, --output strings                   name:path of the output data volumes. 'outputs:/outputs' is always added unless '/outputs' is mapped to a different name. (default [outputs:/outputs])
      --output-dir string                Directory to write the output to.
      --private-internal-ipfs            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
  -p, --publisher publisher              Where to publish the result of the job (default ipfs)
      --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
  -s, --selector string                  Selector (label query) to filter nodes on which this job can be executed, supports '=', '==', and '!='.(e.g. -s key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints.
      --target all|any                   Whether to target the minimum number of matching nodes ("any") (default) or all matching nodes ("all") (default any)
      --timeout int                      Job execution timeout in seconds (e.g. 300 for 5 minutes)
      --wait                             Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
      --wait-timeout-secs int            When using --wait, how many seconds to wait for the job to complete before giving up. (default 600)
  -w, --workdir string                   Working directory inside the container. Overrides the working directory shipped with the image (e.g. via WORKDIR in Dockerfile).
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-12)

1. Let's run a Docker job, using the image `dpokidov/imagemagick`, with a CID mounted at `/input_images` and an output volume mounted at `/outputs` in the container. All flags after the `--` are passed directly into the container for execution:

```bash
bacalhau docker run \
  -i src=ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72,dst=/input_images \
  dpokidov/imagemagick:7.1.0-47-ubuntu \
  -- magick mogrify -resize 100x100 -quality 100 -path /outputs '/input_images/*.jpg'
```

This command allows you to start a job in a Docker container using the specified image, mount an external CID resource from IPFS inside the container to handle images, and execute a command inside the container to process files.

2. To check the job specification before submitting it to the bacalhau network, run:

```bash
bacalhau docker run --dry-run ubuntu echo hello
```

The command does not run the job itself, but only displays information about how it would be run so you can make sure that all job parameters and commands are correctly specified before sending it to the Bacalhau network for execution

3. To save the job specification to a YAML file, run:

```bash
bacalhau docker run --dry-run ubuntu echo hello > job.yaml
```

4. To specify an image tag (default is `latest` - using a specific tag other than `latest` is recommended for reproducibility), run:

```bash
bacalhau docker run ubuntu:bionic echo hello
```

5. To specify an image digest, run:

```bash
bacalhau docker run ubuntu@sha256:35b4f89ec2ee42e7e12db3d107fe6a487137650a2af379bbd49165a1494246ea echo hello
```

The command starts an Ubuntu image container using a specific version of the image identified by its SHA256 hash. This ensures the accuracy of the image source, independent of its tag and possible future changes, since the image digest remains constant for a particular version.

## Exec[​](http://localhost:3000/dev/cli-reference/all-flags#exec) <a href="#exec" id="exec"></a>

The `bacalhau exec` command is used to execute a specific job type.

Usage:

```bash
bacalhau exec [jobtype] [flags]
```

```bash
Flags:
      --code string             Specifies the file, or directory of code to send with the request
      --dry-run                 Do not submit the job, but instead print out what will be submitted
  -e, --env strings             The environment variables to supply to the job (e.g. --env FOO=bar --env BAR=baz)
  -f, --follow                  When specified will follow the output from the job as it runs
  -h, --help                    help for exec
      --id-only                 Print out only the Job ID on successful submission.
  -i, --input storage           Mount URIs as inputs to the job. Can be specified multiple times. Format: src=URI,dst=PATH[,opt=key=value]
                                Examples:
                                # Mount IPFS CID to /inputs directory
                                -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72
                                # Mount S3 object to a specific path
                                -i s3://bucket/key,dst=/my/input/path
                                # Mount S3 object with specific endpoint and region
                                -i src=s3://bucket/key,dst=/my/input/path,opt=endpoint=https://s3.example.com,opt=region=us-east-1
  -l, --labels strings          List of labels for the job. Enter multiple in the format '-l a -l 2'. All characters not matching /a-zA-Z0-9_:|-/ and all emojis will be stripped.
      --node-details            Print out details of all nodes (overridden by --id-only).
  -o, --output strings          name:path of the output data volumes. 'outputs:/outputs' is always added unless '/outputs' is mapped to a different name. (default [outputs:/outputs])
  -p, --publisher publisher     Where to publish the result of the job (default ipfs)
  -s, --selector string         Selector (label query) to filter nodes on which this job can be executed, supports '=', '==', and '!='.(e.g. -s key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints.
      --timeout int             Job execution timeout in seconds (e.g. 300 for 5 minutes)
      --wait                    Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
      --wait-timeout-secs int   When using --wait, how many seconds to wait for the job to complete before giving up. (default 600)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-13)

1. To execute the `app.py` script with Python, run:

```bash
bacalhau exec python app.py
```

2. To run a duckdb query against a `CSV` file:

```bash
bacalhau exec -i src=...,dst=/inputs/data.csv duckdb "select * from /inputs/data.csv"e
```

## Get[​](http://localhost:3000/dev/cli-reference/all-flags#get) <a href="#get" id="get"></a>

The `bacalhau get` command is used to get the results of the job, including stdout and stderr.

Usage:

```bash
 bacalhau get [id] [flags]
```

```bash
Flags:
      --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
  -h, --help                             help for get
      --ipfs-connect string              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
      --ipfs-serve-path string           path local Ipfs node will persist data to
      --ipfs-swarm-addrs strings         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
      --ipfs-swarm-key string            Optional IPFS swarm key required to connect to a private IPFS swarm
      --output-dir string                Directory to write the output to.
      --private-internal-ipfs            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
      --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-14)

1. To get the results of a job, run:

```bash
bacalhau get 51225160-807e-48b8-88c9-28311c7899e1
```

2. To get the results of a job, using a short ID, run:

```bash
bacalhau get 51225160
```

## Help[​](http://localhost:3000/dev/cli-reference/all-flags#help) <a href="#help" id="help"></a>

The `bacalhau help` command provides help for any command in the application.

Usage:

```bash
bacalhau help [command] [flags]
```

```bash
Flags:
  -h, --help   help for help
```

## ID[​](http://localhost:3000/dev/cli-reference/all-flags#id) <a href="#id" id="id"></a>

The `bacalhau id` command shows bacalhau node id info.

Usage:

```bash
bacalhau id [flags]
```

```bash
Flags:
  -h, --help             help for id
      --hide-header      do not print the column headers.
      --no-style         remove all styling from table output.
      --output format    The output format for the command (one of ["table" "csv" "json" "yaml"]) (default json)
      --peer string      A comma-separated list of libp2p multiaddress to connect to. Use "none" to avoid connecting to any peer, "env" to connect to the default peer list of your active environment (see BACALHAU_ENVIRONMENT env var). (default "none")
      --pretty           Pretty print the output. Only applies to json and yaml output formats.
      --swarm-port int   The port to listen on for swarm connections. (default 1235)
      --wide             Print full values in the table results
```

## Job[​](http://localhost:3000/dev/cli-reference/all-flags#job) <a href="#job" id="job"></a>

The `bacalhau job` command provides a suite of sub-commands to submit, query, and manage jobs within Bacalhau. Users can deploy jobs, obtain job details, track execution logs, and more.

Usage:

```bash
 bacalhau job [command]
```

Available Commands:

### describe[​](http://localhost:3000/dev/cli-reference/all-flags#describe-1) <a href="#describe-1" id="describe-1"></a>

```bash
bacalhau job describe [id] [flags]
```

The `bacalhau job describe` command provides a detailed description of a specific job in YAML format. This description can be particularly useful when wanting to understand the attributes and current status of a specific job. To list all available jobs, the `bacalhau job list` command can be used.

```bash
Flags:
  -h, --help            help for describe
      --output format   The output format for the command (one of ["json" "yaml"]) (default yaml)
      --pretty          Pretty print the output. Only applies to json and yaml output formats.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-15)

1. To describe a job with the full ID, run:

```bash
bacalhau job describe j-e3f8c209-d683-4a41-b840-f09b88d087b9
```

2. To describe a job with the shortened ID, run:

```bash
bacalhau job describe j-e3f8c209
```

3. To describe a job with json output, run:

```bash
bacalhau job describe j-e3f8c209 --output json --pretty
```

### executions[​](http://localhost:3000/dev/cli-reference/all-flags#executions) <a href="#executions" id="executions"></a>

```bash
bacalhau job executions [id] [flags]
```

The `bacalhau job executions` command retrieves a list of executions for a specific job based on its ID. This can be essential when tracking the various runs and their respective states for a particular job.

```bash
Flags:
  -h, --help                help for executions
      --hide-header         do not print the column headers when displaying the results.
      --limit uint32        Limit the number of results returned (default 20)
      --next-token string   Uses the specified token for pagination. Useful for fetching the next set of results.
      --no-style            remove all styling from table output displaying raw data.
      --order-by string     Order results based on a specific field. Valid fields are: modify_time, create_time, id, state
      --order-reversed      Reverse the order of the results. Useful in conjunction with --order-by.
      --output format       Specify the output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty              Pretty print the output. Only applies to json and yaml output formats.
      --wide                Print full values in the table result without truncating any information.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-16)

1. To get all executions for a specific job, run:

```bash
bacalhau job executions j-e3f8c209-d683-4a41-b840-f09b88d087b9

Expected Output:
CREATED   MODIFIED  ID          NODE ID   REV.  COMPUTE    DESIRED  COMMENT
                                                STATE      STATE
16:46:03  16:46:04  e-99362435  QmTSJgdN  6     Completed  Stopped
16:46:03  16:46:04  e-75dd20bb  QmXRdLru  6     Completed  Stopped
16:46:03  16:46:04  e-03870df5  QmVXwmdZ  6     Completed  Stopped
```

2. To get executions with YAML output, run:

```bash
bacalhau job executions j-4faae6f0-17b3-4a6d-991e-c82a677c7228 --output yaml

Expected Output:
- AllocatedResources:
    Tasks: {}
  ComputeState:
    StateType: 7
  CreateTime: 1704468726831851981
  DesiredState:
    Message: execution completed
    StateType: 2
    ...
```

### history[​](http://localhost:3000/dev/cli-reference/all-flags#history) <a href="#history" id="history"></a>

```bash
bacalhau job history [id] [flags]
```

The `bacalhau job history` command lists the history events of a specific job based on its ID. This feature allows users to track changes, executions, and other significant milestones associated with a particular job.

```bash
Flags:
      --event-type string     The type of history events to return. One of: all, job, execution (default "all")
      --execution-id string   Filters results by a specific execution ID.
  -h, --help                  help for history
      --hide-header           do not print the column headers.
      --limit uint32          Limit the number of results returned
      --next-token string     Uses the specified token for pagination.
      --no-style              remove all styling from table output.
      --node-id string        Filters the results by a specific node ID.
      --order-by string       Order results by a field
      --order-reversed        Reverse the order of the results
      --output format         The output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty                Pretty print the output. Only applies to json and yaml output formats.
      --wide                  Print full values in the table results without truncating any information.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-17)

1. To retrieve the history of a specific job, run:

```bash
bacalhau job history j-4faae6f0-17b3-4a6d-991e-c82a677c7228

Expected Output:
TIME      LEVEL           EXEC. ID    NODE ID   REV.  PREVIOUS STATE     NEW STATE          COMMENT
 15:32:06  JobLevel                              1     Pending            Pending            Job created
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  1     New                New
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  2     New                AskForBid
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  3     AskForBid          AskForBidAccepted
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  4     AskForBidAccepted  AskForBidAccepted
 15:32:06  JobLevel                              2     Pending            Running
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  5     AskForBidAccepted  BidAccepted
 15:32:07  ExecutionLevel  e-228bbb88  QmeXjeQD  6     BidAccepted        Completed
 15:32:07  JobLevel                              3     Running            Completed
```

2. To filter the history by event type, run:

```bash
bacalhau job history j-6f2bf0ea-ebcd-4490-899a-9de9d8d95881 --event-type job

Expected Output:
TIME      LEVEL     EXEC. ID  NODE ID  REV.  PREVIOUS STATE  NEW STATE  COMMENT
16:46:03  JobLevel                     1     Pending         Pending    Job created
16:46:04  JobLevel                     2     Pending         Completed
```

3. To filter the history by execution ID, run:

```bash
bacalhau job history j-4faae6f0-17b3-4a6d-991e-c82a677c7228 --execution-id e-228bbb88

Expected Output:
 TIME      LEVEL           EXEC. ID    NODE ID   REV.  PREVIOUS STATE     NEW STATE          COMMENT
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  1     New                New
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  2     New                AskForBid
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  3     AskForBid          AskForBidAccepted
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  4     AskForBidAccepted  AskForBidAccepted
 15:32:06  ExecutionLevel  e-228bbb88  QmeXjeQD  5     AskForBidAccepted  BidAccepted
 15:32:07  ExecutionLevel  e-228bbb88  QmeXjeQD  6     BidAccepted        Completed
```

### list[​](http://localhost:3000/dev/cli-reference/all-flags#list-1) <a href="#list-1" id="list-1"></a>

```bash
bacalhau job list [flags]
```

The `bacalhau job list` command provides a listing of all submitted jobs. This command offers an overview of all tasks and processes registered in the system, allowing users to monitor and manage their jobs effectively.

```bash
Flags:
  -h, --help                help for list
      --hide-header         do not print the column headers.
      --labels string       Filter nodes by labels. See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more information. (default "bacalhau_canary != true")
      --limit uint32        Limit the number of results returned (default 10)
      --next-token string   Uses the specified token for pagination.
      --no-style            remove all styling from table output.
      --order-by string     Order results by a field. Valid fields are: id, created_at
      --order-reversed      Reverse the order of the results
      --output format       The output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty              Pretty print the output. Only applies to json and yaml output formats.
      --wide                Print full values in the table results without truncating any information.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-18)

1. To list all jobs, run:

```bash
bacalhau job list

Expected Output:
CREATED   ID          JOB     TYPE   STATE
 01:10:20  fd7dcb28    docker  batch  Completed
 15:10:24  2e2dd082    docker  batch  Completed
 03:05:23  56c2d0ef    docker  batch  Completed
 01:25:57  d32e92cc    docker  batch  Completed
 12:30:57  fa01c947    docker  batch  Completed
 09:01:04  da9d8f5a    docker  batch  Completed
 14:51:13  093a7746    docker  batch  Completed
 13:56:05  379cdbf7    docker  batch  Completed
 04:01:13  4a72e10b    docker  batch  Completed
 09:02:51  a50b8ea3    docker  batch  Completed
```

2. To limit the list to the last 2 jobs, run:

```bash
bacalhau job list --limit 2

Expected Output:
 CREATED   ID          JOB     TYPE   STATE
 09:45:57  437728bf    docker  batch  Completed
 09:55:42  523b6447    docker  batch  Completed
```

3. To order the list by creation date in descending order, run:

```bash
 bacalhau job list --order-by created_at --order-reversed

Expected Output:
 CREATED   ID          JOB     TYPE   STATE
 16:51:13  3490b0bd    docker  batch  Completed
 16:51:04  3b02b691    docker  batch  Completed
 16:51:00  c5b5b8b4    docker  batch  Completed
 16:50:57  8c062944    docker  batch  Completed
 16:50:51  062517b2    docker  batch  Completed
 16:50:45  4e0728a6    docker  batch  Completed
 16:50:42  50c27dd0    docker  batch  Completed
 16:50:23  8be21cd0    docker  batch  Completed
 16:50:20  162bb215    docker  batch  Completed
 16:47:51  33e98bd9    docker  batch  Completed
```

4. To filter the jobs by specific labels (`region in (us-east-1, us-east-2)` and `env = prod`), run:

```bash
bacalhau job list --labels "region in (us-east-1, us-east-2),env = prod"
```

5. To get the list in JSON format with pretty printing, run:

```bash
bacalhau job list --limit 1 --output json --pretty

[
  {
    "ID": "3ecf5eac-2250-4444-9bd1-455c6b6e5dd2",
    "Name": "3ecf5eac-2250-4444-9bd1-455c6b6e5dd2",
    "Namespace": "eeb90e1730b2240b3e16e70d383fb9c6cbe40969e8b7ff71e805edeffff3d81d",
    "Type": "batch",
    "Priority": 0,
    "Count": 1,
    "Constraints": [
      {
        "Key": "favour_owner",
        "Operator": "!=",
        "Values": [
          "bacalhau"
        ]
      }
    ],
    "Meta":
    ...
```

### logs[​](http://localhost:3000/dev/cli-reference/all-flags#logs) <a href="#logs" id="logs"></a>

```bash
bacalhau job logs [id] [flags]
```

The `bacalhau job logs` command allows users to retrieve logs from a job that has been previously submitted. This command is useful for tracking and debugging the progress and state of a running or completed job.

```bash
  Flags:
  -f, --follow   Follow the logs in real-time after retrieving the current logs.
  -h, --help     help for logs
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-19)

1. To display Logs for a Previously Submitted Job using Full Job ID, run:

```bash
bacalhau job logs j-51225160-807e-48b8-88c9-28311c7899e1

Expected Output:
[2023-09-24 09:01:32] INFO - Application started successfully.
[2023-09-24 09:01:33] DEBUG - Initializing database connections.
[2023-09-24 09:01:35] WARN - API rate limit approaching.
[2023-09-24 09:02:01] ERROR - Failed to retrieve data from endpoint: /api/v1/data.
[2023-09-24 09:05:00] INFO - Data sync completed with 4500 new records.
```

2. To follow Logs in Real-Time, run:

```bash
bacalhau job logs --follow j-51225160-807e-48b8-88c9-28311c7899e1

Expected Output:
[2023-09-24 11:30:02] INFO - User 'john_doe' logged in successfully.
[2023-09-24 11:30:15] DEBUG - Fetching data from cache for key: userSettings_john_doe.
[2023-09-24 11:31:05] WARN - High memory usage detected: 85% of allocated resources.
... [Logs continue to appear in real-time] ...
```

### run[​](http://localhost:3000/dev/cli-reference/all-flags#run) <a href="#run" id="run"></a>

```bash
bacalhau job run [flags]
```

The `bacalhau job run` command facilitates the initiation of a job from a file or directly from the standard input (stdin). The command supports both JSON and YAML data formats. This command is particularly useful for quickly executing a job without the need for manual configurations.

```bash
Flags:
      --dry-run                        Do not submit the job, but instead print out what will be submitted
  -f, --follow                         When specified will continuously display the output from the job as it runs
  -h, --help                           help for run
      --id-only                        Print out only the Job ID on successful submission.
      --no-template                    Disable the templating feature. When this flag is set, the job spec will be used as-is, without any placeholder replacements
      --node-details                   Print out details of all nodes (Note that this flag is overridden if --id-only is provided).
      --show-warnings                  Shows any warnings that occur during the job submission
  -E, --template-envs string           Specify a regular expression pattern for selecting environment variables to be included as template variables in the job spec.
                                       e.g. --template-envs ".*" will include all environment variables.
  -V, --template-vars stringToString   Replace a placeholder in the job spec with a value. e.g. --template-vars foo=bar
      --wait                           Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
      --wait-timeout-secs int          If --wait is provided, this flag sets the maximum time (in seconds) the command will wait for the job to finish before it terminates. (default 600)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-20)

A sample job used in the following examples is provided below:

```bash
cat job.yaml
```

```yaml
name: A Simple Docker Job
type: batch
count: 1
tasks:
  - name: My main task
    engine:
      type: docker
      params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo Hello Bacalhau!
```

This configuration describes a batch job that runs a Docker task. It utilizes the `ubuntu:latest` image and executes the `echo Hello Bacalhau!` command.

1. To run a job with a configuration provided in a `job.yaml` file:

```bash
bacalhau job run job.yaml

Expected Output:
Job successfully submitted. Job ID: j-2d0f513a-9eb1-49c2-8bc8-246c6fb41520
  Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

   Communicating with the network  ................  done ✅  0.1s
                  Job in progress  ................  done ✅  0.6s

  To get more details about the run, execute:
   bacalhau job describe j-2d0f513a-9eb1-49c2-8bc8-246c6fb41520

  To get more details about the run executions, execute:
   bacalhau job executions j-2d0f513a-9eb1-49c2-8bc8-246c6fb41520
```

2. To run a Job and follow its Logs:

```bash
bacalhau job run job.yaml --follow

Expected Output:
Job successfully submitted. Job ID: j-b89df816-7564-4f04-b270-e6cda89eda72
Waiting for logs... (Enter Ctrl+C to exit at any time, your job will continue running):

Hello Bacalhau!
```

3. To run a Job Without Waiting:

```bash
bacalhau job run job.yaml --wait=false

Expected Output:
j-3fd396b3-e92e-42ca-bd87-0dc9eb15e6f9
```

4. To fetch Only the Job ID Upon Submission:

```bash
bacalhau job run job.yaml --id-only

Expected Output:
j-5976ffb6-3465-4fec-8b3b-2c822cbaf417
```

5. To fetch Only the Job ID and Wait for Completion:

```bash
bacalhau job run job.yaml --id-only --wait

Expected Output:
j-293f1302-3298-4aca-b06d-33fd1e3f9d2c
```

6. To run a Job with Node Details:

```bash
bacalhau job run job.yaml --node-details

Expected Output:
Job successfully submitted. Job ID: j-3634acc2-c92c-494d-9413-ddd8629d0e74
Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):
	Communicating with the network  ................  done ✅  0.1s
	               Job in progress  ................  done ✅  0.7s
Job Results By Node:
• Node QmSD38wH:
	Hello Bacalhau!
	
To get more details about the run, execute:
	bacalhau job describe j-3634acc2-c92c-494d-9413-ddd8629d0e74
To get more details about the run executions, execute:
	bacalhau job executions j-3634acc2-c92c-494d-9413-ddd8629d0e74
```

7. To rerun a previously submitting job:

```bash
bacalhau job describe j-3634acc2-c92c-494d-9413-ddd8629d0e74 | bacalhau job run

Expected Output:
Reading from /dev/stdin; send Ctrl-d to stop.Job successfully submitted. Job ID: j-c3441e11-0620-480f-b5d7-a35727398d9a
Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):
	Communicating with the network  ................  done ✅  0.2s
	               Job in progress  ................  done ✅  0.7s
To get more details about the run, execute:
	bacalhau job describe j-c3441e11-0620-480f-b5d7-a35727398d9a
To get more details about the run executions, execute:
	bacalhau job executions j-c3441e11-0620-480f-b5d7-a35727398d9a
```

### stop[​](http://localhost:3000/dev/cli-reference/all-flags#stop) <a href="#stop" id="stop"></a>

```bash
bacalhau job stop [id] [flags]
```

The `bacalhau job stop` command allows users to terminate a previously submitted job. This is useful in scenarios where there's a need to halt a running job, perhaps due to misconfiguration or changed priorities.

```bash
Flags:
  -h, --help    help for stop
      --quiet   Do not print anything to stdout or stderr
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-21)

1. To Stop a Specific Job, run:

```bash
bacalhau job stop j-10eb97de-14cd-4db4-96ec-561bb943309a

Expected Output:
Checking job status

   	Connecting to network  ................  done ✅  0.0s
   	  Verifying job state  ................  done ✅  0.2s
   	          Stopping job ................  done ✅  0.1s

   Job stop successfully submitted with evaluation ID: 397fd425-8b1a-491e-952a-0632492e7ece
```

2. To terminate a job without seeing any verbose feedback or messages, run:

```bash
bacalhau job stop j-63b5ec0c-b5bf-4398-a152-b46c07abe52a --quiet

Expected Output:
[No output displayed as the operation is run quietly.]
```

## List[​](http://localhost:3000/dev/cli-reference/all-flags#list-2) <a href="#list-2" id="list-2"></a>

The `bacalhau list` command lists jobs on the network.

Usage:

```bash
bacalhau list [flags]
```

```bash
Flags:
      --all                   Fetch all jobs from the network (default is to filter those belonging to the user). This option may take a long time to return, please use with caution.
      --exclude-tag strings   Only return jobs that do not have the passed tag in their annotations (default [canary])
  -h, --help                  help for list
      --hide-header           do not print the column headers.
      --id-filter string      filter by Job List to IDs matching substring.
      --include-tag strings   Only return jobs that have the passed tag in their annotations
      --no-style              remove all styling from table output.
  -n, --number int            print the first NUM jobs instead of the first 10. (default 10)
      --output format         The output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty                Pretty print the output. Only applies to json and yaml output formats.
      --reverse               reverse order of table - for time sorting, this will be newest first. Use '--reverse=false' to sort oldest first (single quotes are required). (default true)
      --sort-by Column        sort by field, defaults to creation time, with newest first [Allowed "id", "created_at"]. (default created_at)
      --wide                  Print full values in the table results
```

**Example**[**​**](http://localhost:3000/dev/cli-reference/all-flags#example)

1. To List jobs on the network, run:

```bash
bacalhau list
```

2. To List jobs and output as json, run:

```bash
bacalhau list --output json
```

## Logs[​](http://localhost:3000/dev/cli-reference/all-flags#logs-1) <a href="#logs-1" id="logs-1"></a>

The `bacalhau logs` command retrieves the log output (stdout, and stderr) from a job. If the job is still running it is possible to follow the logs after the previously generated logs are retrieved.

Usage:

```bash
bacalhau logs [id] [flags]
```

```bash
Flags:
  -f, --follow   Follow the logs in real-time after retrieving the current logs.
  -h, --help     help for logs
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-22)

1. To follow logs for a previously submitted job, run:

```bash
bacalhau logs -f 51225160-807e-48b8-88c9-28311c7899e1
```

2. To retrieve the log output with a short ID, but don't follow any newly generated logs,run:

```bash
bacalhau logs ebd9bf2f
```

## Node[​](http://localhost:3000/dev/cli-reference/all-flags#node-1) <a href="#node-1" id="node-1"></a>

The `bacalhau node` command provides a set of sub-commands to query and manage node-related information within Bacalhau. With these tools, users can access specific details about nodes, list all network nodes, and more.

Usage:

```bash
bacalhau node [command]
```

Available Commands:

### describe[​](http://localhost:3000/dev/cli-reference/all-flags#describe-2) <a href="#describe-2" id="describe-2"></a>

```bash
bacalhau node describe [id] [flags]
```

The `bacalhau node describe` command offers users the ability to retrieve detailed information about a specific node using its unique identifier. This information is crucial for system administrators and network managers to understand the state, specifications, and other attributes of nodes in their infrastructure.

```bash
Flags:
  -h, --help            help for describe
      --output format   The output format for the command (one of ["json" "yaml"]) (default yaml)
      --pretty          Pretty print the output. Only applies to json and yaml output formats.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-23)

1. To Describe a Node with the `QmSD38wH` ID, run:

```bash
bacalhau node describe QmSD38wH

Expected Output:
BacalhauVersion:
  BuildDate: "2023-12-11T18:46:13Z"
  GOARCH: amd64
  GOOS: linux
  GitCommit: 4252ba4406c40c3d01bdcf58709f8d7a705fdc75
  GitVersion: v1.2.0
  Major: "1"
  Minor: "2"
ComputeNodeInfo:
  AvailableCapacity:
    CPU: 3.2
    Disk: 1689504687718
    GPU: 1
    GPUs:
    - Index: 0
      Memory: 15360
      Name: Tesla T4
      PCIAddress: ""
      Vendor: NVIDIA
    Memory: 12561032806
  EnqueuedExecutions: 0
  ExecutionEngines:
  - docker
  - wasm
  MaxCapacity:
    CPU: 3.2
    Disk: 1689504687718
    GPU: 1
    GPUs:
    - Index: 0
      Memory: 15360
      Name: Tesla T4
      PCIAddress: ""
      Vendor: NVIDIA
    Memory: 12561032806
    ...
```

2. To describe a Node with Output in JSON Format, run:

```bash
bacalhau node describe QmSD38wH --output json

Expected Output:
{"PeerInfo":{"ID":"QmSD38wHdeoLrfysEejQnqpmNx4iUPh83Dh4vfYRHML9aC","Addrs":["/ip4/35.245.41.51/tcp/1235"]},"NodeType":"Compute","Labels":{"Architecture":"amd64","GPU-0":"Tesla-T4","GPU-0-Memory":"15360-MiB","Operating-System":"linux","git-lfs":"True","owner":"bacalhau"},"ComputeNodeInfo":{"ExecutionEngines":["docker","wasm"],"Publishers":["ipfs","s3","noop"],"StorageSources":["urldownload","inline","repoclone","repoclonelfs","s3","ipfs"],"MaxCapacity":{"CPU":3.2,"Memory":12561032806,"Disk":1689504687718,"GPU":1,"GPUs":[{"Index":0,"Name":"Tesla T4","Vendor":"NVIDIA","Memory":15360,"PCIAddress":""}]},"AvailableCapacity":{"CPU":3.2,"Memory":12561032806,"Disk":1689504687718,"GPU":1,"GPUs":[{"Index":0,"Name":"Tesla T4","Vendor":"NVIDIA","Memory":15360,"PCIAddress":""}]},"MaxJobRequirements":{"CPU":3.2,"Memory":12561032806,"Disk":1689504687718,"GPU":1,"GPUs":[{"Index":0,"Name":"Tesla T4","Vendor":"NVIDIA","Memory":15360,"PCIAddress":""}]},"RunningExecutions":0,"EnqueuedExecutions":0},"BacalhauVersion":{"Major":"1","Minor":"2","GitVersion":"v1.2.0","GitCommit":"4252ba4406c40c3d01bdcf58709f8d7a705fdc75","BuildDate":"2023-12-11T18:46:13Z","GOOS":"linux","GOARCH":"amd64"}}
```

### list[​](http://localhost:3000/dev/cli-reference/all-flags#list-3) <a href="#list-3" id="list-3"></a>

```bash
 bacalhau node list [flags] 
```

The `bacalhau node list` command is designed to provide users with a comprehensive list of network nodes along with details based on specified flags. It supports various filtering, ordering, and output formatting options, allowing users to tailor the output to their needs.

```bash
Flags:
  -h, --help                help for list
      --hide-header         do not print the column headers.
      --labels string       Filter nodes by labels. See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more information.
      --limit uint32        Limit the number of results returned
      --next-token string   Next token to use for pagination
      --no-style            remove all styling from table output.
      --order-by string     Order results by a field. Valid fields are: id, type, available_cpu, available_memory, available_disk, available_gpu
      --order-reversed      Reverse the order of the results
      --output format       The output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty              Pretty print the output. Only applies to json and yaml output formats.
      --show strings        What column groups to show. Zero or more of: ["features" "capacity" "labels" "version"] (default [labels,capacity])
      --wide                Print full values in the table results without truncation.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-24)

1. To retrieve the list of nodes, run:

```bash
bacalhau node list

Expected Output:
ID        TYPE     LABELS                                              CPU     MEMORY      DISK         GPU
 QmPLPUUj  Compute  Architecture=amd64 Operating-System=linux           12.8 /  50.2 GB /   1.5 TB /     0 /
                    git-lfs=True owner=bacalhau                         12.8    50.2 GB     1.5 TB       0
 QmRHRr8c  Compute  Architecture=amd64 GPU-0-Memory=15360-MiB           3.2 /   11.7 GB /   1.5 TB /     1 /
                    GPU-0=Tesla-T4 Operating-System=linux git-lfs=True  3.2     11.7 GB     1.5 TB       1
                    owner=bacalhau
 QmSD38wH  Compute  Architecture=amd64 GPU-0-Memory=15360-MiB           3.2 /   11.7 GB /   1.5 TB /     1 /
                    GPU-0=Tesla-T4 Operating-System=linux git-lfs=True  3.2     11.7 GB     1.5 TB       1
                    owner=bacalhau
  ...
```

2. To Filter the list of nodes by labels (`Operating-System` and `owner`), run:

```bash
bacalhau node list --labels "Operating-System=linux,owner=bacalhau"

Expected Output:
 ID        TYPE     LABELS                                              CPU     MEMORY      DISK         GPU
 QmPLPUUj  Compute  Architecture=amd64 Operating-System=linux           12.8 /  50.2 GB /   1.5 TB /     0 /
                    git-lfs=True owner=bacalhau                         12.8    50.2 GB     1.5 TB       0
  ...
```

3. To Order the list of nodes by available memory, run:

```bash
bacalhau node list --order-by available_memory

Expected Output:
ID        TYPE       LABELS                                              CPU     MEMORY      DISK         GPU
 QmcC3xif  Compute    Architecture=amd64 GPU-0-Memory=24576-MiB           102.0   745.1 GB /  524.0 GB /   2 /
                      GPU-0=NVIDIA-GeForce-RTX-3090                       /       745.1 GB    524.0 GB     2
                      GPU-1-Memory=24576-MiB                              102.0
                      GPU-1=NVIDIA-GeForce-RTX-3090
                      Operating-System=linux env=prod git-lfs=False
                      name=saturnia_len20
 QmbxGSsM  Compute    Architecture=amd64 Operating-System=linux           12.8 /  50.2 GB /   1.5 TB /     0 /
                      git-lfs=True owner=bacalhau                         12.8    50.2 GB     1.5 TB       0
 QmeXjeQD  Compute    Architecture=amd64 Operating-System=linux           12.8 /  50.2 GB /   1.5 TB /     0 /
                      git-lfs=True owner=bacalhau                         12.8    50.2 GB     1.5 TB       0
 QmPLPUUj  Compute    Architecture=amd64 Operating-System=linux           12.8 /  50.2 GB /   1.5 TB /     0 /
                      git-lfs=True owner=bacalhau                         12.8    50.2 GB     1.5 TB       0
 QmRHRr8c  Compute    Architecture=amd64 GPU-0-Memory=15360-MiB           3.2 /   11.7 GB /   1.5 TB /     1 /
                      GPU-0=Tesla-T4 Operating-System=linux git-lfs=True  3.2     11.7 GB     1.5 TB       1
                      owner=bacalhau
 QmSD38wH  Compute    Architecture=amd64 GPU-0-Memory=15360-MiB           3.2 /   11.7 GB /   1.5 TB /     1 /
                      GPU-0=Tesla-T4 Operating-System=linux git-lfs=True  3.2     11.7 GB     1.5 TB       1
                      owner=bacalhau
 QmWsayXK  Requester  Architecture=arm64 Operating-System=linux
                      git-lfs=False
```

4. To get a limited list of nodes (3) in JSON format, run:

```bash
bacalhau node list  --limit 3 --output json --pretty

Expected Output:
[
  {
    "PeerInfo": {
      "ID": "QmPLPUUjaVE3wQNSSkxmYoaBPHVAWdjBjDYmMkWvtMZxAf",
      "Addrs": [
        "/ip4/35.245.215.155/tcp/1235"
      ]
    },
    "NodeType": "Compute",
    "Labels": {
      "Architecture": "amd64",
      "Operating-System": "linux",
      "git-lfs": "True",
      "owner": "bacalhau"
    },
   ... 
```

## Serve[​](http://localhost:3000/dev/cli-reference/all-flags#serve) <a href="#serve" id="serve"></a>

The `bacalhau serve` command starts a bacalhau node.

Usage:

```bash
bacalhau serve [flags]
```

```bash
Flags:
      --allow-listed-local-paths strings                 Local paths that are allowed to be mounted into jobs
      --autocert string                                  Specifies a host name for which ACME is used to obtain a TLS Certificate.
                                                         Using this option results in the API serving over HTTPS
      --compute-execution-store-path string              The path used for the compute execution store when using BoltDB
      --compute-execution-store-type storage-type        The type of store used by the compute node (BoltDB or InMemory) (default BoltDB)
      --default-job-execution-timeout duration           default value for the execution timeout this compute node will assign to jobs with no timeout requirement defined. (default 10m0s)
      --disable-engine strings                           Engine types to disable
      --disable-storage strings                          Storage types to disable
      --disabled-publisher strings                       Publisher types to disable
  -h, --help                                             help for serve
      --host string                                      The host to serve on. (default "0.0.0.0")
      --ignore-physical-resource-limits                  When set the compute node will ignore is physical resource limits
      --ipfs-connect string                              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
      --ipfs-serve-path string                           path local Ipfs node will persist data to
      --ipfs-swarm-addrs strings                         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
      --ipfs-swarm-key string                            Optional IPFS swarm key required to connect to a private IPFS swarm
      --job-execution-timeout-bypass-client-id strings   List of IDs of clients that are allowed to bypass the job execution timeout check
      --job-negotiation-timeout duration                 Timeout value to hold a bid for a job. (default 3m0s)
      --job-selection-accept-networked                   Accept jobs that require network access.
      --job-selection-data-locality local|anywhere       Only accept jobs that reference data we have locally ("local") or anywhere ("anywhere"). (default Anywhere)
      --job-selection-probe-exec string                  Use the result of a exec an external program to decide if we should take on the job.
      --job-selection-probe-http string                  Use the result of a HTTP POST to decide if we should take on the job.
      --job-selection-reject-stateless                   Reject jobs that don't specify any data.
      --labels stringToString                            Labels to be associated with the node that can be used for node selection and filtering. (e.g. --labels key1=value1,key2=value2) (default [])
      --limit-job-cpu string                             Job CPU core limit to run all jobs (e.g. 500m, 2, 8).
      --limit-job-gpu string                             Job GPU limit to run all jobs (e.g. 1, 2, or 8).
      --limit-job-memory string                          Job Memory limit to run all jobs  (e.g. 500Mb, 2Gb, 8Gb).
      --limit-total-cpu string                           Total CPU core limit to run all jobs (e.g. 500m, 2, 8).
      --limit-total-gpu string                           Total GPU limit to run all jobs (e.g. 1, 2, or 8).
      --limit-total-memory string                        Total Memory limit to run all jobs  (e.g. 500Mb, 2Gb, 8Gb).
      --max-job-execution-timeout duration               The maximum execution timeout this compute node supports. Jobs with higher timeout requirements will not be bid on. (default 2562047h47m16s)
      --min-job-execution-timeout duration               The minimum execution timeout this compute node supports. Jobs with lower timeout requirements will not be bid on. (default 500ms)
      --node-type strings                                Whether the node is a compute, requester or both. (default [requester])
      --peer string                                      A comma-separated list of libp2p multiaddress to connect to. Use "none" to avoid connecting to any peer, "env" to connect to the default peer list of your active environment (see BACALHAU_ENVIRONMENT env var). (default "none")
      --port int                                         The port to server on. (default 1234)
      --private-internal-ipfs                            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
      --requester-job-store-path string                  The path used for the requester job store store when using BoltDB
      --requester-job-store-type storage-type            The type of job store used by the requester node (BoltDB or InMemory) (default BoltDB)
      --swarm-port int                                   The port to listen on for swarm connections. (default 1235)
      --tlscert string                                   Specifies a TLS certificate file to be used by the requester node
      --tlskey string                                    Specifies a TLS key file matching the certificate to be used by the requester node
      --web-ui                                           Whether to start the web UI alongside the bacalhau node.
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-25)

1. To Start a private bacalhau requester node, you can run either of these two commands:

```bash
bacalhau serve

or

bacalhau serve --node-type requester
```

2. To Start a private bacalhau hybrid node that acts as both compute and requester, you can run either of these two commands:

```bash
bacalhau serve --node-type compute --node-type requester

or

bacalhau serve --node-type compute,requester
```

3. To Start a private bacalhau node with a persistent local IPFS node, run:

```bash
BACALHAU_SERVE_IPFS_PATH=/data/ipfs bacalhau serve
```

The command creates and starts a Bacalhau private node using the local IPFS node and specifies the path to save the IPFS data.

4. To Start a public bacalhau requester node, run:

```bash
bacalhau serve --peer env --private-internal-ipfs=false
```

5. To Start a public bacalhau node with the WebUI, run:

```bash
bacalhau serve --webui
```

## Validate[​](http://localhost:3000/dev/cli-reference/all-flags#validate) <a href="#validate" id="validate"></a>

The `bacalhau validate` command allows you to validate job files in JSON or YAML formats before sending them to the Bacalhau system. It is used to confirm that the structure and contents of the job description file conform to the expected format.

Usage:

```bash
bacalhau validate [flags]
```

```bash
Flags:
  -h, --help            help for validate
      --output-schema   Output the JSON schema for a Job to stdout then exit
```

**Example**[**​**](http://localhost:3000/dev/cli-reference/all-flags#example-1)

To Validate the `job.yaml` file, run:

```bash
bacalhau validate ./job.yaml
```

## Version[​](http://localhost:3000/dev/cli-reference/all-flags#version-1) <a href="#version-1" id="version-1"></a>

The `bacalhau version` command allows you to get the client and server version.

Usage:

```bash
bacalhau version [flags]
```

```bash
Flags:
      --client          If true, shows client version only (no server required).
  -h, --help            help for version
      --hide-header     do not print the column headers.
      --no-style        remove all styling from table output.
      --output format   The output format for the command (one of ["table" "csv" "json" "yaml"]) (default table)
      --pretty          Pretty print the output. Only applies to json and yaml output formats.
      --wide            Print full values in the table results
```

## Wasm[​](http://localhost:3000/dev/cli-reference/all-flags#wasm) <a href="#wasm" id="wasm"></a>

The `bacalhau wasm` command Runs and prepares WASM jobs on the network

Usage:

```bash
bacalhau wasm [command]
```

Available Commands:

### run[​](http://localhost:3000/dev/cli-reference/all-flags#run-1) <a href="#run-1" id="run-1"></a>

```bash
bacalhau wasm run {cid-of-wasm | <local.wasm>} [--entry-point <string>] [wasm-args ...] [flags]
```

The `bacalhau wasm run` command Runs a job that was compiled to WASM.

```bash
Flags:
      --concurrency int                  How many nodes should run the job (default 1)
      --cpu string                       Job CPU cores (e.g. 500m, 2, 8).
      --disk string                      Job Disk requirement (e.g. 500Gb, 2Tb, 8Tb).
      --domain stringArray               Domain(s) that the job needs to access (for HTTP networking)
      --download                         Should we download the results once the job is complete?
      --download-timeout-secs duration   Timeout duration for IPFS downloads. (default 5m0s)
      --dry-run                          Do not submit the job, but instead print out what will be submitted
      --entry-point string               The name of the WASM function in the entry module to call. This should be a zero-parameter zero-result function that
                                         		will execute the job. (default "_start")
  -e, --env strings                      The environment variables to supply to the job (e.g. --env FOO=bar --env BAR=baz)
  -f, --follow                           When specified will follow the output from the job as it runs
  -g, --gettimeout int                   Timeout for getting the results of a job in --wait (default 10)
      --gpu string                       Job GPU requirement (e.g. 1, 2, 8).
  -h, --help                             help for run
      --id-only                          Print out only the Job ID on successful submission.
  -U, --import-module-urls url           URL of the WASM modules to import from a URL source. URL accept any valid URL supported by the 'wget' command, and supports both HTTP and HTTPS.
  -I, --import-module-volumes cid:path   CID:path of the WASM modules to import from IPFS, if you need to set the path of the mounted data.
  -i, --input storage                    Mount URIs as inputs to the job. Can be specified multiple times. Format: src=URI,dst=PATH[,opt=key=value]
                                         Examples:
                                         # Mount IPFS CID to /inputs directory
                                         -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72
                                         # Mount S3 object to a specific path
                                         -i s3://bucket/key,dst=/my/input/path
                                         # Mount S3 object with specific endpoint and region
                                         -i src=s3://bucket/key,dst=/my/input/path,opt=endpoint=https://s3.example.com,opt=region=us-east-1
      --ipfs-connect string              The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set.
      --ipfs-serve-path string           path local Ipfs node will persist data to
      --ipfs-swarm-addrs strings         IPFS multiaddress to connect the in-process IPFS node to - cannot be used with --ipfs-connect. (default [/ip4/35.245.161.250/tcp/4001/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/35.245.161.250/udp/4001/quic/p2p/12D3KooWAQpZzf3qiNxpwizXeArGjft98ZBoMNgVNNpoWtKAvtYH,/ip4/34.86.254.26/tcp/4001/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/34.86.254.26/udp/4001/quic/p2p/12D3KooWLfFBjDo8dFe1Q4kSm8inKjPeHzmLBkQ1QAjTHocAUazK,/ip4/35.245.215.155/tcp/4001/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/35.245.215.155/udp/4001/quic/p2p/12D3KooWH3rxmhLUrpzg81KAwUuXXuqeGt4qyWRniunb5ipjemFF,/ip4/34.145.201.224/tcp/4001/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/34.145.201.224/udp/4001/quic/p2p/12D3KooWBCBZnXnNbjxqqxu2oygPdLGseEbfMbFhrkDTRjUNnZYf,/ip4/35.245.41.51/tcp/4001/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa,/ip4/35.245.41.51/udp/4001/quic/p2p/12D3KooWJM8j97yoDTb7B9xV1WpBXakT4Zof3aMgFuSQQH56rCXa])
      --ipfs-swarm-key string            Optional IPFS swarm key required to connect to a private IPFS swarm
  -l, --labels strings                   List of labels for the job. Enter multiple in the format '-l a -l 2'. All characters not matching /a-zA-Z0-9_:|-/ and all emojis will be stripped.
      --memory string                    Job Memory requirement (e.g. 500Mb, 2Gb, 8Gb).
      --network network-type             Networking capability required by the job. None, HTTP, or Full (default None)
      --node-details                     Print out details of all nodes (overridden by --id-only).
  -o, --output strings                   name:path of the output data volumes. 'outputs:/outputs' is always added unless '/outputs' is mapped to a different name. (default [outputs:/outputs])
      --output-dir string                Directory to write the output to.
      --private-internal-ipfs            Whether the in-process IPFS node should auto-discover other nodes, including the public IPFS network - cannot be used with --ipfs-connect. Use "--private-internal-ipfs=false" to disable. To persist a local Ipfs node, set BACALHAU_SERVE_IPFS_PATH to a valid path. (default true)
  -p, --publisher publisher              Where to publish the result of the job (default ipfs)
      --raw                              Download raw result CIDs instead of merging multiple CIDs into a single result
  -s, --selector string                  Selector (label query) to filter nodes on which this job can be executed, supports '=', '==', and '!='.(e.g. -s key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints.
      --target all|any                   Whether to target the minimum number of matching nodes ("any") (default) or all matching nodes ("all") (default any)
      --timeout int                      Job execution timeout in seconds (e.g. 300 for 5 minutes)
      --wait                             Wait for the job to finish. Use --wait=false to return as soon as the job is submitted. (default true)
      --wait-timeout-secs int            When using --wait, how many seconds to wait for the job to complete before giving up. (default 600)
```

**Examples**[**​**](http://localhost:3000/dev/cli-reference/all-flags#examples-26)

1. To Run the `<localfile.wasm>` module in bacalhau:

```bash
bacalhau wasm run <localfile.wasm>
```

2. To Fetch the wasm module from `<cid>` and execute it, run:

```bash
bacalhau wasm run <cid>
```

### validate[​](http://localhost:3000/dev/cli-reference/all-flags#validate-1) <a href="#validate-1" id="validate-1"></a>

```bash
bacalhau wasm validate <local.wasm> [--entry-point <string>] [flags]
```

The `bacalhau wasm validate` command Checks that a WASM program is runnable on the network.

```bash
Flags:
      --entry-point string   The name of the WASM function in the entry module to call. This should be a zero-parameter zero-result function that will execute the job. (default "_start")
  -h, --help                 help for validate
```

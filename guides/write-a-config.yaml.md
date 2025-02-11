---
description: How to write the config.yaml file to configure your nodes
icon: sliders-up
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

| Configuration Option                             | Description                                                                                                                                                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API.Auth.AccessPolicyPath                        | String path to where your security policy is stored                                                                                                                                                                  |
| API.Auth.Methods                                 | Set authentication method for your Bacalhau network                                                                                                                                                                  |
| API.Host                                         | The host for the client and server to communicate on (via REST). Ignored if BACALHAU\_API\_HOST environment variable is set                                                                                          |
| API.Port                                         | The port for the client and server to communicate on (via REST). Ignored if BACALHAU\_API\_PORT environment variable is set                                                                                          |
| API.TLS.AutoCert                                 | Domain for automatic certificate generation                                                                                                                                                                          |
| API.TLS.AutoCertCachePath                        | The directory where the autocert process will cache certificates to avoid rate limits                                                                                                                                |
| API.TLS.CAFile                                   | The location of your node client’s chosen Certificate Authority certificate file when self-signed certificates are used                                                                                              |
| API.TLS.CAFile                                   | CAFile specifies the path to the Certificate Authority file                                                                                                                                                          |
| API.TLS.KeyFile                                  | Specifies path to the TLS Private Key file                                                                                                                                                                           |
| API.TLS.Insecure                                 | Boolean binary indicating if the client TLS is insecure, when true instructs the client to use HTTPS (TLS), but not to attempt to verify the certificate                                                             |
| API.TLS.SelfSigned                               | Boolean indicating if a self-signed security certificate is being used                                                                                                                                               |
| API.TLS.UseTLS                                   | Boolean indicating if TLS should be used for client connections                                                                                                                                                      |
| Compute.Auth.Token                               | Token specifies the key for compute nodes to be able to access the orchestrator.                                                                                                                                     |
| Compute.AllocatedCapacity.CPU                    | Total amount of CPU the system can use at one time in aggregate for all jobs                                                                                                                                         |
| Compute.AllocatedCapacity.Disk                   | Total amount of disk the system can use at one time in aggregate for all jobs                                                                                                                                        |
| Compute.AllocatedCapacity.GPU                    | Total amount of GPU the system can use at one time in aggregate for all jobs                                                                                                                                         |
| Compute.AllocatedCapacity.Memory                 | Total amount of memory the system can use at one time in aggregate for all jobs                                                                                                                                      |
| Compute.AllowListedLocalPaths                    | AllowListedLocalPaths specifies a list of local file system paths that the compute node is allowed to access                                                                                                         |
| Compute.Heartbeat.Interval                       | How often the compute node will send a heartbeat to the requester node to let it know that the compute node is still alive. This should be less than the requester's configured heartbeat timeout to avoid flapping. |
| Compute.Heartbeat.InfoUpdateInterval             | The frequency with which the compute node will send node info (including current labels) to the controlling requester node                                                                                           |
| Compute.Heartbeat.ResourceUpdateInterval         | How often the compute node will send current resource availability to the requester node                                                                                                                             |
| Compute.Orchestrators                            | Comma-separated list of orchestrators to connect to. Applies to compute nodes                                                                                                                                        |
| DataDir                                          | <p>DataDir specifies a location on disk where the bacalhau node will maintain<br>state</p>                                                                                                                           |
| DisableAnalytics                                 | When set to true disables Bacalhau from sharing anonymous user data with Expanso                                                                                                                                     |
| JobDefaults.Batch.Priority                       | `Priority` specifies the default priority allocated to a batch job. This value is used when the job hasn't explicitly set its priority requirement                                                                   |
| JobDefaults.Batch.Task.Publisher.Params          | `Params` specifies the publisher configuration data                                                                                                                                                                  |
| JobDefaults.Batch.Task.Publisher.Type            | Type specifies the publisher type. e.g. "s3", "local", "ipfs", etc.                                                                                                                                                  |
| JobDefaults.Batch.Task.Resources.CPU             | Sets default CPU resource limits for batch jobs on your Compute node                                                                                                                                                 |
| JobDefaults.Daemon.Task.Resources.CPU            | Sets default CPU resource limits for daemon jobs on your Compute node                                                                                                                                                |
| JobDefaults.Ops.Task.Resources.CPU               | Sets default CPU resource limits for ops jobs on your Compute node                                                                                                                                                   |
| JobDefaults.Service.Task.Resources.CPU           | Sets default CPU resource limits for service jobs on your Compute node                                                                                                                                               |
| JobDefaults.Batch.Task.Resources.Disk            | Sets default disk resource limits for batch jobs on your Compute node                                                                                                                                                |
| JobDefaults.Daemon.Task.Resources.Disk           | Sets default disk resource limits for daemon jobs on your Compute node                                                                                                                                               |
| JobDefaults.Ops.Task.Resources.Disk              | Sets default disk resource limits for ops jobs on your Compute node                                                                                                                                                  |
| JobDefaults.Service.Task.Resources.Disk          | Sets default disk resource limits for service jobs on your Compute node                                                                                                                                              |
| JobDefaults.Batch.Task.Resources.GPU             | Sets default GPU resource limits for batch jobs on your Compute node                                                                                                                                                 |
| JobDefaults.Daemon.Task.Resources.GPU            | Sets default GPU resource limits for daemon jobs on your Compute node                                                                                                                                                |
| JobDefaults.Ops.Task.Resources.GPU               | Sets default GPU resource limits for ops jobs on your Compute node                                                                                                                                                   |
| JobDefaults.Service.Task.Resources.GPU           | Sets default GPU resource limits for service jobs on your Compute node                                                                                                                                               |
| JobDefaults.Batch.Task.Resources.Memory          | Sets default memory resource limits for batch jobs on your Compute node                                                                                                                                              |
| JobDefaults.Daemon.Task.Resources.Memory         | Sets default memory resource limits for daemon jobs on your Compute node                                                                                                                                             |
| JobDefaults.Ops.Task.Resources.Memory            | Sets default memory resource limits for ops jobs on your Compute node                                                                                                                                                |
| JobDefaults.Service.Task.Resources.Memory        | Sets default memory resource limits for service jobs on your Compute node                                                                                                                                            |
| JobDefaults.Ops.Task.Publisher.Params            | `Params` specifies the publisher configuration data                                                                                                                                                                  |
| JobDefaults.Ops.Task.Publisher.Type              | Type specifies the publisher type. e.g. "s3", "local", "ipfs", etc.                                                                                                                                                  |
| JobDefaults.Service.Priority                     | Priority specifies the default priority allocated to a service job                                                                                                                                                   |
| JobDefaults.Daemon.Priority                      | Priority specifies the default priority allocated to a daemon job                                                                                                                                                    |
| JobDefaults.Ops.Priority                         | Priority specifies the default priority allocated to an ops job                                                                                                                                                      |
| JobAdmissionControl.Locality                     | Sets job selection policy based on where the data for the job is located. ‘local’ or ‘anywhere’                                                                                                                      |
| JobAdmissionControl.ProbeExec                    | Use the result of an executed external program to decide if a job should be accepted. Overrides data locality settings                                                                                               |
| JobAdmissionControl.ProbeHTTP                    | Use the result of a HTTP POST to decide if a job should be accepted. Overrides data locality settings                                                                                                                |
| JobAdmissionControl.RejectStatelessJobs          | Boolean signifying if jobs that don’t specify any data should be rejected                                                                                                                                            |
| JobDefaults.Batch.Task.Timeouts.ExecutionTimeout | Default value for batch job execution timeouts on your current compute node. It will be assigned to batch jobs with no timeout requirement defined                                                                   |
| JobDefaults.Ops.Task.Timeouts.ExecutionTimeout   | Default value for ops job execution timeouts on your current compute node. It will be assigned to ops jobs with no timeout requirement defined                                                                       |
| JobDefaults.Batch.Task.Timeouts.TotalTimeout     | Default value for the maximum execution timeout this compute node supports for batch jobs. Jobs with higher timeout requirements will not be bid on                                                                  |
| JobDefaults.Ops.Task.Timeouts.TotalTimeout       | Default value for the maximum execution timeout this compute node supports for ops jobs. Jobs with higher timeout requirements will not be bid on                                                                    |
| Publishers.Types.Local.Address                   | The address for the local publisher's server to bind to                                                                                                                                                              |
| Publishers.Types.Local.Port                      | The port for the local publisher's server to bind to (default: 6001)                                                                                                                                                 |
| Logging.LogDebugInfoInterval                     | The duration interval your compute node should generate logs on the running job executions                                                                                                                           |
| Logging.Mode                                     | Mode specifies the logging mode. One of: default, json.                                                                                                                                                              |
| Logging.Level                                    | <p>Level sets the logging level. One of: trace, debug, info, warn, error, fatal,<br>panic.</p>                                                                                                                       |
| Engines.Disabled                                 | List of Engine types to disable                                                                                                                                                                                      |
| Engines.Types.Docker.ManifestCache.TTL           | The default time-to-live for each record in the manifest cache                                                                                                                                                       |
| Engines.Types.Docker.ManifestCache.Refresh       | Refresh specifies the refresh interval for cache entries.                                                                                                                                                            |
| Engines.Types.Docker.ManifestCache.Size          | Specifies the number of items that can be held in the manifest cache                                                                                                                                                 |
| FeatureFlags.ExecTranslation                     | ExecTranslation enables the execution translation feature                                                                                                                                                            |
| Publishers.Disabled                              | List of Publisher types to disable                                                                                                                                                                                   |
| Publishers.Types.IPFS.Endpoint                   | Endpoint specifies the multi-address to connect to for IPFS                                                                                                                                                          |
| InputSources.Disabled                            | List of Input Source types to disable                                                                                                                                                                                |
| InputSources.MaxRetryCount                       | `MaxRetryCoun`t specifies the maximum number of attempts for reading from a storage                                                                                                                                  |
| InputSources.ReadTimeout                         | `ReadTimeout` specifies the maximum time allowed for reading from a storage                                                                                                                                          |
| InputSources.Types.IPFS.Endpoint                 | `Endpoint` specifies the multi-address to connect to for IPFS - to be used as input source                                                                                                                           |
| ResultDownloaders.Timeout                        | `Timeout` specifies the maximum time allowed for a download operation.                                                                                                                                               |
| ResultDownloaders.Disabled                       | `Disabled` is a list of downloaders that are disabled                                                                                                                                                                |
| ResultDownloaders.Types.IPFS.Endpoint            | `Endpoint` specifies the multi-address to connect to for IPFS                                                                                                                                                        |
| Labels                                           | List of labels to apply to the node that can be used for node selection and filtering                                                                                                                                |
| NameProvider                                     | The name provider to use to generate the node name                                                                                                                                                                   |
| Orchestrator.Auth.Token                          | Token specifies the key, which Orchestrator node expects from the Compute node to use to connect to it                                                                                                               |
| Orchestrator.Advertise                           | Address to advertise to compute nodes to connect to                                                                                                                                                                  |
| Orchestrator.Cluster.Advertise                   | Address to advertise to other orchestrators to connect to                                                                                                                                                            |
| Orchestrator.Cluster.Name                        | Name of the cluster to join                                                                                                                                                                                          |
| Orchestrator.Cluster.Peers                       | Comma-separated list of other orchestrators to connect to form a cluster                                                                                                                                             |
| Orchestrator.Cluster.Port                        | Port to listen for connections from other orchestrators to form a cluster                                                                                                                                            |
| Orchestrator.Port                                | Port to listen for connections from other nodes. Applies to orchestrator nodes                                                                                                                                       |
| Orchestrator.NodeManager.DisconnectTimeout       | This is the time period after which a compute node is considered to be disconnected. If the compute node does not deliver a heartbeat every `DisconnectTimeout` then it is considered disconnected                   |
| Orchestrator.EvaluationBroker.MaxRetryCount      | Maximum retry count for the evaluation broker                                                                                                                                                                        |
| Orchestrator.EvaluationBroker.VisibilityTimeout  | Visibility timeout for the evaluation broker                                                                                                                                                                         |
| Orchestrator.Scheduler.HousekeepingInterval      | Duration between Bacalhau housekeeping runs                                                                                                                                                                          |
| Orchestrator.Scheduler.HousekeepingTimeout       | Specifies the maximum time allowed for a single housekeeping run                                                                                                                                                     |
| JobAdmissionControl.AcceptNetworkedJobs          | Boolean signifying if jobs that specify networking should be accepted                                                                                                                                                |

| Orchestrator.NodeManager.ManualApproval    | Boolean signifying if new nodes should only be manually approved to your network. Default is false                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Orchestrator.Scheduler.QueueBackoff        | `QueueBackoff` specifies the time to wait before retrying a failed job.                                                                               |
| Publishers.Types.S3.PreSignedURLDisabled   | Boolean deciding if a secure S3 URL should be generated and used. Default false, Disabled if true.                                                    |
| Publishers.Types.S3.PreSignedURLExpiration | Defined expiration interval for your secure S3 urls                                                                                                   |
| FeatureFlags.ExecTranslation               | Whether jobs should be translated at the requester node or not. Default: false                                                                        |
| Orchestrator.Scheduler.WorkerCount         | Number of workers that should be generated under your requester node                                                                                  |
| Orchestrator.Host                          | <p>Host specifies the hostname or IP address on which the Orchestrator server<br>listens for compute node connections</p>                             |
| Orchestrator.Port                          | <p>Port specifies the port number on which the Orchestrator server listens for<br>compute node connections.</p>                                       |
| Orchestrator.Enabled                       | <p><code>Enabled</code> indicates whether the orchestrator node is active and available for job<br>submission.</p>                                    |
| Compute.Enabled                            | <p><code>Enabled</code> indicates whether the compute node is active and available for job<br>execution.</p>                                          |
| StrictVersionMatch                         | `StrictVersionMatch` indicates whether to enforce strict version matching                                                                             |
| UpdateConfig.Interval                      | The frequency with which your system checks for version updates. When set to 0 update checks are not performed.                                       |
| WebUI.Backend                              | <p>Backend specifies the address and port of the backend API server. If empty, the<br>Web UI will use the same address and port as the API server</p> |
| WebUI.Enabled                              | `Enabled` indicates whether the Web UI is enabled                                                                                                     |
| WebUI.Listen                               | Listen specifies the address and port on which the Web UI listens                                                                                     |

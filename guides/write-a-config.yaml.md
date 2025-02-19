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

| Configuration Option                             | Description                                                                                                                                                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API.Auth.AccessPolicyPath | AccessPolicyPath is the path to a file or directory that will be loaded as the policy to apply to all inbound API requests. If unspecified, a policy that permits access to all API endpoints to both authenticated and unauthenticated users (the default as of v1.2.0) will be used. |
| API.Auth.Methods | Methods maps "method names" to authenticator implementations. A method name is a human-readable string chosen by the person configuring the system that is shown to users to help them pick the authentication method they want to use. There can be multiple usages of the same Authenticator *type* but with different configs and parameters, each identified with a unique method name.  For example, if an implementation wants to allow users to log in with Github or Bitbucket, they might both use an authenticator implementation of type "oidc", and each would appear once on this provider with key / method name "github" and "bitbucket".  By default, only a single authentication method that accepts authentication via client keys will be enabled. |
| API.Host | Host specifies the hostname or IP address on which the API server listens or the client connects. |
| API.Port | Port specifies the port number on which the API server listens or the client connects. |
| API.TLS.AutoCert | AutoCert specifies the domain for automatic certificate generation. |
| API.TLS.AutoCertCachePath | AutoCertCachePath specifies the directory to cache auto-generated certificates. |
| API.TLS.CAFile | CAFile specifies the path to the Certificate Authority file. |
| API.TLS.CertFile | CertFile specifies the path to the TLS certificate file. |
| API.TLS.Insecure | Insecure allows insecure TLS connections (e.g., self-signed certificates). |
| API.TLS.KeyFile | KeyFile specifies the path to the TLS private key file. |
| API.TLS.SelfSigned | SelfSigned indicates whether to use a self-signed certificate. |
| API.TLS.UseTLS | UseTLS indicates whether to use TLS for client connections. |
| Compute.AllocatedCapacity.CPU | CPU specifies the amount of CPU a compute node allocates for running jobs. It can be expressed as a percentage (e.g., "85%") or a Kubernetes resource string (e.g., "100m"). |
| Compute.AllocatedCapacity.Disk | Disk specifies the amount of Disk space a compute node allocates for running jobs. It can be expressed as a percentage (e.g., "85%") or a Kubernetes resource string (e.g., "10Gi"). |
| Compute.AllocatedCapacity.GPU | GPU specifies the amount of GPU a compute node allocates for running jobs. It can be expressed as a percentage (e.g., "85%") or a Kubernetes resource string (e.g., "1"). Note: When using percentages, the result is always rounded up to the nearest whole GPU. |
| Compute.AllocatedCapacity.Memory | Memory specifies the amount of Memory a compute node allocates for running jobs. It can be expressed as a percentage (e.g., "85%") or a Kubernetes resource string (e.g., "1Gi"). |
| Compute.AllowListedLocalPaths | AllowListedLocalPaths specifies a list of local file system paths that the compute node is allowed to access. |
| Compute.Auth.Token | Token specifies the key for compute nodes to be able to access the orchestrator. |
| Compute.Enabled | Enabled indicates whether the compute node is active and available for job execution. |
| Compute.Heartbeat.InfoUpdateInterval | InfoUpdateInterval specifies the time between updates of non-resource information to the orchestrator. |
| Compute.Heartbeat.Interval | Interval specifies the time between heartbeat signals sent to the orchestrator. |
| Compute.Heartbeat.ResourceUpdateInterval | ResourceUpdateInterval specifies the time between updates of resource information to the orchestrator. |
| Compute.Orchestrators | Orchestrators specifies a list of orchestrator endpoints that this compute node connects to. |
| Compute.TLS.CACert | CACert specifies the CA file path that the compute node trusts when connecting to orchestrator. |
| Compute.TLS.RequireTLS | RequireTLS specifies if the compute node enforces encrypted communication with orchestrator. |
| DataDir | DataDir specifies a location on disk where the bacalhau node will maintain state. |
| DisableAnalytics | DisableAnalytics, when true, disables sharing anonymous analytics data with the Bacalhau development team |
| Engines.Disabled | Disabled specifies a list of engines that are disabled. |
| Engines.Types.Docker.ManifestCache.Refresh | Refresh specifies the refresh interval for cache entries. |
| Engines.Types.Docker.ManifestCache.Size | Size specifies the size of the Docker manifest cache. |
| Engines.Types.Docker.ManifestCache.TTL | TTL specifies the time-to-live duration for cache entries. |
| InputSources.Disabled | Disabled specifies a list of storages that are disabled. |
| InputSources.MaxRetryCount | ReadTimeout specifies the maximum number of attempts for reading from a storage. |
| InputSources.ReadTimeout | ReadTimeout specifies the maximum time allowed for reading from a storage. |
| InputSources.Types.IPFS.Endpoint | Endpoint specifies the multi-address to connect to for IPFS. e.g /ip4/127.0.0.1/tcp/5001 |
| JobAdmissionControl.AcceptNetworkedJobs | AcceptNetworkedJobs indicates whether to accept jobs that require network access. |
| JobAdmissionControl.Locality | Locality specifies the locality of the job input data. |
| JobAdmissionControl.ProbeExec | ProbeExec specifies the command to execute for probing job submission. |
| JobAdmissionControl.ProbeHTTP | ProbeHTTP specifies the HTTP endpoint for probing job submission. |
| JobAdmissionControl.RejectStatelessJobs | RejectStatelessJobs indicates whether to reject stateless jobs, i.e. jobs without inputs. |
| JobDefaults.Batch.Priority | Priority specifies the default priority allocated to a batch or ops job. This value is used when the job hasn't explicitly set its priority requirement. |
| JobDefaults.Batch.Task.Publisher.Params | Params specifies the publisher configuration data. |
| JobDefaults.Batch.Task.Publisher.Type | Type specifies the publisher type. e.g. "s3", "local", "ipfs", etc. |
| JobDefaults.Batch.Task.Resources.CPU | CPU specifies the default amount of CPU allocated to a task. It uses Kubernetes resource string format (e.g., "100m" for 0.1 CPU cores). This value is used when the task hasn't explicitly set its CPU requirement. |
| JobDefaults.Batch.Task.Resources.Disk | Disk specifies the default amount of disk space allocated to a task. It uses Kubernetes resource string format (e.g., "1Gi" for 1 gibibyte). This value is used when the task hasn't explicitly set its disk space requirement. |
| JobDefaults.Batch.Task.Resources.GPU | GPU specifies the default number of GPUs allocated to a task. It uses Kubernetes resource string format (e.g., "1" for 1 GPU). This value is used when the task hasn't explicitly set its GPU requirement. |
| JobDefaults.Batch.Task.Resources.Memory | Memory specifies the default amount of memory allocated to a task. It uses Kubernetes resource string format (e.g., "256Mi" for 256 mebibytes). This value is used when the task hasn't explicitly set its memory requirement. |
| JobDefaults.Batch.Task.Timeouts.ExecutionTimeout | ExecutionTimeout is the maximum time allowed for task execution |
| JobDefaults.Batch.Task.Timeouts.TotalTimeout | TotalTimeout is the maximum total time allowed for a task |
| JobDefaults.Daemon.Priority | Priority specifies the default priority allocated to a service or daemon job. This value is used when the job hasn't explicitly set its priority requirement. |
| JobDefaults.Daemon.Task.Resources.CPU | CPU specifies the default amount of CPU allocated to a task. It uses Kubernetes resource string format (e.g., "100m" for 0.1 CPU cores). This value is used when the task hasn't explicitly set its CPU requirement. |
| JobDefaults.Daemon.Task.Resources.Disk | Disk specifies the default amount of disk space allocated to a task. It uses Kubernetes resource string format (e.g., "1Gi" for 1 gibibyte). This value is used when the task hasn't explicitly set its disk space requirement. |
| JobDefaults.Daemon.Task.Resources.GPU | GPU specifies the default number of GPUs allocated to a task. It uses Kubernetes resource string format (e.g., "1" for 1 GPU). This value is used when the task hasn't explicitly set its GPU requirement. |
| JobDefaults.Daemon.Task.Resources.Memory | Memory specifies the default amount of memory allocated to a task. It uses Kubernetes resource string format (e.g., "256Mi" for 256 mebibytes). This value is used when the task hasn't explicitly set its memory requirement. |
| JobDefaults.Ops.Priority | Priority specifies the default priority allocated to a batch or ops job. This value is used when the job hasn't explicitly set its priority requirement. |
| JobDefaults.Ops.Task.Publisher.Params | Params specifies the publisher configuration data. |
| JobDefaults.Ops.Task.Publisher.Type | Type specifies the publisher type. e.g. "s3", "local", "ipfs", etc. |
| JobDefaults.Ops.Task.Resources.CPU | CPU specifies the default amount of CPU allocated to a task. It uses Kubernetes resource string format (e.g., "100m" for 0.1 CPU cores). This value is used when the task hasn't explicitly set its CPU requirement. |
| JobDefaults.Ops.Task.Resources.Disk | Disk specifies the default amount of disk space allocated to a task. It uses Kubernetes resource string format (e.g., "1Gi" for 1 gibibyte). This value is used when the task hasn't explicitly set its disk space requirement. |
| JobDefaults.Ops.Task.Resources.GPU | GPU specifies the default number of GPUs allocated to a task. It uses Kubernetes resource string format (e.g., "1" for 1 GPU). This value is used when the task hasn't explicitly set its GPU requirement. |
| JobDefaults.Ops.Task.Resources.Memory | Memory specifies the default amount of memory allocated to a task. It uses Kubernetes resource string format (e.g., "256Mi" for 256 mebibytes). This value is used when the task hasn't explicitly set its memory requirement. |
| JobDefaults.Ops.Task.Timeouts.ExecutionTimeout | ExecutionTimeout is the maximum time allowed for task execution |
| JobDefaults.Ops.Task.Timeouts.TotalTimeout | TotalTimeout is the maximum total time allowed for a task |
| JobDefaults.Service.Priority | Priority specifies the default priority allocated to a service or daemon job. This value is used when the job hasn't explicitly set its priority requirement. |
| JobDefaults.Service.Task.Resources.CPU | CPU specifies the default amount of CPU allocated to a task. It uses Kubernetes resource string format (e.g., "100m" for 0.1 CPU cores). This value is used when the task hasn't explicitly set its CPU requirement. |
| JobDefaults.Service.Task.Resources.Disk | Disk specifies the default amount of disk space allocated to a task. It uses Kubernetes resource string format (e.g., "1Gi" for 1 gibibyte). This value is used when the task hasn't explicitly set its disk space requirement. |
| JobDefaults.Service.Task.Resources.GPU | GPU specifies the default number of GPUs allocated to a task. It uses Kubernetes resource string format (e.g., "1" for 1 GPU). This value is used when the task hasn't explicitly set its GPU requirement. |
| JobDefaults.Service.Task.Resources.Memory | Memory specifies the default amount of memory allocated to a task. It uses Kubernetes resource string format (e.g., "256Mi" for 256 mebibytes). This value is used when the task hasn't explicitly set its memory requirement. |
| Labels | Labels are key-value pairs used to describe and categorize the nodes. |
| Logging.Level | Level sets the logging level. One of: trace, debug, info, warn, error, fatal, panic. |
| Logging.LogDebugInfoInterval | LogDebugInfoInterval specifies the interval for logging debug information. |
| Logging.Mode | Mode specifies the logging mode. One of: default, json. |
| NameProvider | NameProvider specifies the method used to generate names for the node. One of: hostname, aws, gcp, uuid, puuid. |
| Orchestrator.Advertise | Advertise specifies URL to advertise to other servers. |
| Orchestrator.Auth.Token | Token specifies the key for compute nodes to be able to access the orchestrator |
| Orchestrator.Cluster.Advertise | Advertise specifies the address to advertise to other cluster members. |
| Orchestrator.Cluster.Host | Host specifies the hostname or IP address for cluster communication. |
| Orchestrator.Cluster.Name | Name specifies the unique identifier for this orchestrator cluster. |
| Orchestrator.Cluster.Peers | Peers is a list of other cluster members to connect to on startup. |
| Orchestrator.Cluster.Port | Port specifies the port number for cluster communication. |
| Orchestrator.Enabled | Enabled indicates whether the orchestrator node is active and available for job submission. |
| Orchestrator.EvaluationBroker.MaxRetryCount | MaxRetryCount specifies the maximum number of times an evaluation can be retried before being marked as failed. |
| Orchestrator.EvaluationBroker.VisibilityTimeout | VisibilityTimeout specifies how long an evaluation can be claimed before it's returned to the queue. |
| Orchestrator.Host | Host specifies the hostname or IP address on which the Orchestrator server listens for compute node connections. |
| Orchestrator.NodeManager.DisconnectTimeout | DisconnectTimeout specifies how long to wait before considering a node disconnected. |
| Orchestrator.NodeManager.ManualApproval | ManualApproval, if true, requires manual approval for new compute nodes joining the cluster. |
| Orchestrator.Port | Host specifies the port number on which the Orchestrator server listens for compute node connections. |
| Orchestrator.Scheduler.HousekeepingInterval | HousekeepingInterval specifies how often to run housekeeping tasks. |
| Orchestrator.Scheduler.HousekeepingTimeout | HousekeepingTimeout specifies the maximum time allowed for a single housekeeping run. |
| Orchestrator.Scheduler.QueueBackoff | QueueBackoff specifies the time to wait before retrying a failed job. |
| Orchestrator.Scheduler.WorkerCount | WorkerCount specifies the number of concurrent workers for job scheduling. |
| Orchestrator.SupportReverseProxy | SupportReverseProxy configures the orchestrator node to run behind a reverse proxy |
| Orchestrator.TLS.CACert | CACert specifies the CA file path that the orchestrator node trusts when connecting to NATS server. |
| Orchestrator.TLS.ServerCert | ServerCert specifies the certificate file path given to NATS server to serve TLS connections. |
| Orchestrator.TLS.ServerKey | ServerKey specifies the private key file path given to NATS server to serve TLS connections. |
| Orchestrator.TLS.ServerTimeout | ServerTimeout specifies the TLS timeout, in seconds, set on the NATS server. |
| Publishers.Disabled | Disabled specifies a list of publishers that are disabled. |
| Publishers.Types.IPFS.Endpoint | Endpoint specifies the multi-address to connect to for IPFS. e.g /ip4/127.0.0.1/tcp/5001 |
| Publishers.Types.Local.Address | Address specifies the endpoint the publisher serves on. |
| Publishers.Types.Local.Port | Port specifies the port the publisher serves on. |
| Publishers.Types.S3.PreSignedURLDisabled | PreSignedURLDisabled specifies whether pre-signed URLs are enabled for the S3 provider. |
| Publishers.Types.S3.PreSignedURLExpiration | PreSignedURLExpiration specifies the duration before a pre-signed URL expires. |
| ResultDownloaders.Disabled | Disabled is a list of downloaders that are disabled. |
| ResultDownloaders.Timeout | Timeout specifies the maximum time allowed for a download operation. |
| ResultDownloaders.Types.IPFS.Endpoint | Endpoint specifies the multi-address to connect to for IPFS. e.g /ip4/127.0.0.1/tcp/5001 |
| StrictVersionMatch | StrictVersionMatch indicates whether to enforce strict version matching. |
| UpdateConfig.Interval | Interval specifies the time between update checks, when set to 0 update checks are not performed. |
| WebUI.Backend | Backend specifies the address and port of the backend API server. If empty, the Web UI will use the same address and port as the API server. |
| WebUI.Enabled | Enabled indicates whether the Web UI is enabled. |
| WebUI.Listen | Listen specifies the address and port on which the Web UI listens. |

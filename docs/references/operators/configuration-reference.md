# Configuration Reference

This document serves as the comprehensive reference for all Bacalhau configuration options. You can set these values using a YAML file or the command line.

## Setting Configuration

```bash
# Using a configuration file
bacalhau serve --config config.yaml

# Using command-line options
bacalhau serve -c NameProvider=hostname -c Labels="region=us-west"

# Combining approaches
bacalhau serve --config base-config.yaml -c WebUI.Enabled=true
```

## Example Configurations

Below are example configurations for the two primary node types in Bacalhau.

### Compute Node Example

This example shows a configuration for a compute node that connects to orchestrators:

```yaml
# Basic node identification
NameProvider: "hostname"
Labels:
  region: "us-west"
  environment: "production"

# Compute node settings
Compute:
  # Enable compute capabilities
  Enabled: true
  
  # Connect to these orchestrators
  Orchestrators:
    - "nats://orchestrator-1.example.com:4222"
  
  # Local paths that can be mounted
  AllowListedLocalPaths:
    - "/data:/data:ro"        # Read-only access
    - "/outputs:/outputs:rw"  # Read-write access
  
  # Security settings
  Auth:
    Token: "secure-access-token"
  
  # Resource allocation
  AllocatedCapacity:
    CPU: "80%"      # Dedicate 80% of CPU to jobs
    Memory: "80%"   # Dedicate 80% of memory to jobs
    Disk: "80%"     # Dedicate 80% of disk to jobs
    GPU: "100%"     # Dedicate all GPUs to jobs

# Reject jobs with network access
JobAdmissionControl:
  RejectNetworkedJobs: true

# Default resources for jobs
JobDefaults:
  Batch:
    Task:
      Resources:
        CPU: "500m"
        Memory: "512Mb"
      Timeouts:
        ExecutionTimeout: "1h"
```

### Orchestrator Node Example

This example shows a configuration for an orchestrator node that manages compute nodes:

```yaml
# Basic node identification
NameProvider: "hostname"
Labels:
  region: "us-west"
  environment: "production"

# API configuration
API:
  Host: "0.0.0.0"
  Port: 1234
  TLS:
    UseTLS: true
    CertFile: "/etc/bacalhau/certs/server.crt"
    KeyFile: "/etc/bacalhau/certs/server.key"

# Orchestrator settings
Orchestrator:
  # Enable orchestrator capabilities
  Enabled: true
  
  # Listen on all interfaces
  Host: "0.0.0.0"
  Port: 4222
  
  # Security settings
  Auth:
    Token: "secure-access-token"
  
  # Node management
  NodeManager:
    DisconnectTimeout: "1m"
  
  # Job scheduling
  Scheduler:
    WorkerCount: 4  # 4 concurrent schedulers
    QueueBackoff: "30s"

# Default resources for jobs
JobDefaults:
  Batch:
    Task:
      Resources:
        CPU: "500m"
        Memory: "512Mb"

# Enable Web UI for monitoring
WebUI:
  Enabled: true
  Listen: "0.0.0.0:8438"
```

## All Configuration Options

The following table lists all configuration options in alphabetical order.

| Configuration Key | Default Value | Description |
|------------------|---------------|-------------|
| `API.Auth.AccessPolicyPath` | `""` | Path to policy file for API access control |
| `API.Auth.Methods` | `{"ClientKey":{"Type":"challenge"}}` | Authentication methods mapping |
| `API.Auth.Oauth2` | `{}` | OAuth 2.0 configuration |
| `API.Auth.Users` | `[]` | List of users for basic authentication |
| `API.Host` | `"0.0.0.0"` | Hostname or IP address on which the API server listens |
| `API.Port` | `1234` | Port number on which the API server listens |
| `API.TLS.AutoCert` | `""` | Domain for automatic certificate generation |
| `API.TLS.AutoCertCachePath` | `""` | Directory to cache auto-generated certificates |
| `API.TLS.CAFile` | `""` | Path to Certificate Authority file |
| `API.TLS.CertFile` | `""` | Path to TLS certificate file |
| `API.TLS.Insecure` | `false` | Allow insecure TLS connections |
| `API.TLS.KeyFile` | `""` | Path to TLS private key file |
| `API.TLS.SelfSigned` | `false` | Use self-signed certificate |
| `API.TLS.UseTLS` | `false` | Enable TLS for API server |
| `Compute.AllocatedCapacity.CPU` | `"80%"` | CPU allocation (percentage or absolute) |
| `Compute.AllocatedCapacity.Disk` | `"80%"` | Disk allocation (percentage or absolute) |
| `Compute.AllocatedCapacity.GPU` | `"100%"` | GPU allocation (percentage or absolute) |
| `Compute.AllocatedCapacity.Memory` | `"80%"` | Memory allocation (percentage or absolute) |
| `Compute.AllowListedLocalPaths` | `[]` | Local paths allowed for mounting in format `path[:mode]`. Mode can be `ro` (read-only) or `rw` (read-write) |
| `Compute.Auth.Token` | `""` | Token for orchestrator access |
| `Compute.Enabled` | `false` | Enable compute capabilities |
| `Compute.Heartbeat.InfoUpdateInterval` | `"1m"` | Interval for updating node information |
| `Compute.Heartbeat.Interval` | `"15s"` | Interval between heartbeats sent to orchestrator |
| `Compute.Network.AdvertisedAddress` | `""` | Address that this compute node advertises to other nodes |
| `Compute.Network.PortRangeEnd` | `32000` | Last port in the range (inclusive) that can be allocated to jobs |
| `Compute.Network.PortRangeStart` | `20000` | First port in the range (inclusive) that can be allocated to jobs |
| `Compute.Orchestrators` | `["nats://127.0.0.1:4222"]` | List of orchestrator endpoints |
| `Compute.TLS.CACert` | `""` | CA certificate path for verifying orchestrator |
| `Compute.TLS.RequireTLS` | `false` | Require TLS for orchestrator communication |
| `DataDir` | `~/.bacalhau` | Location on disk for Bacalhau state |
| `DisableAnalytics` | `false` | Disable sharing anonymous analytics data |
| `Engines.Disabled` | `[]` | List of disabled execution engines |
| `Engines.Types.Docker.ManifestCache.Refresh` | `"1h"` | Refresh interval for cache entries |
| `Engines.Types.Docker.ManifestCache.Size` | `1000` | Size of Docker manifest cache |
| `Engines.Types.Docker.ManifestCache.TTL` | `"1h"` | Time-to-live for cache entries |
| `InputSources.Disabled` | `[]` | List of disabled input source types |
| `InputSources.MaxRetryCount` | `3` | Maximum retry attempts for source access |
| `InputSources.ReadTimeout` | `"5m"` | Timeout for reading from sources |
| `InputSources.Types.IPFS.Endpoint` | `""` | IPFS API endpoint for input sources |
| `JobAdmissionControl.AcceptNetworkedJobs` | `false` | Accept jobs that require network access |
| `JobAdmissionControl.Locality` | `"Anywhere"` | Data locality requirement: `"Anywhere"` or `"Local"` |
| `JobAdmissionControl.ProbeExec` | `""` | External program path for job admission decisions |
| `JobAdmissionControl.ProbeHTTP` | `""` | HTTP endpoint for job admission decisions |
| `JobAdmissionControl.RejectStatelessJobs` | `false` | Reject jobs without input data |
| `JobDefaults.Batch.Priority` | `0` | Default priority for batch jobs |
| `JobDefaults.Batch.Task.Publisher.Params` | `{}` | Default publisher parameters for batch jobs |
| `JobDefaults.Batch.Task.Publisher.Type` | `""` | Default publisher type for batch jobs (e.g., "s3", "ipfs") |
| `JobDefaults.Batch.Task.Resources.CPU` | `"500m"` | Default CPU for batch jobs (500m = 0.5 cores) |
| `JobDefaults.Batch.Task.Resources.Disk` | `""` | Default disk space for batch jobs |
| `JobDefaults.Batch.Task.Resources.GPU` | `""` | Default GPU count for batch jobs |
| `JobDefaults.Batch.Task.Resources.Memory` | `"512Mb"` | Default memory for batch jobs |
| `JobDefaults.Batch.Task.Timeouts.ExecutionTimeout` | `""` | Default execution timeout for batch jobs |
| `JobDefaults.Batch.Task.Timeouts.TotalTimeout` | `""` | Default total timeout for batch jobs |
| `JobDefaults.Daemon.Priority` | `0` | Default priority for daemon jobs |
| `JobDefaults.Daemon.Task.Resources.CPU` | `"500m"` | Default CPU for daemon jobs |
| `JobDefaults.Daemon.Task.Resources.Disk` | `""` | Default disk space for daemon jobs |
| `JobDefaults.Daemon.Task.Resources.GPU` | `""` | Default GPU count for daemon jobs |
| `JobDefaults.Daemon.Task.Resources.Memory` | `"512Mb"` | Default memory for daemon jobs |
| `JobDefaults.Ops.Priority` | `0` | Default priority for ops jobs |
| `JobDefaults.Ops.Task.Publisher.Params` | `{}` | Default publisher parameters for ops jobs |
| `JobDefaults.Ops.Task.Publisher.Type` | `""` | Default publisher type for ops jobs |
| `JobDefaults.Ops.Task.Resources.CPU` | `"500m"` | Default CPU for ops jobs |
| `JobDefaults.Ops.Task.Resources.Disk` | `""` | Default disk space for ops jobs |
| `JobDefaults.Ops.Task.Resources.GPU` | `""` | Default GPU count for ops jobs |
| `JobDefaults.Ops.Task.Resources.Memory` | `"512Mb"` | Default memory for ops jobs |
| `JobDefaults.Ops.Task.Timeouts.ExecutionTimeout` | `""` | Default execution timeout for ops jobs |
| `JobDefaults.Ops.Task.Timeouts.TotalTimeout` | `""` | Default total timeout for ops jobs |
| `JobDefaults.Service.Priority` | `0` | Default priority for service jobs |
| `JobDefaults.Service.Task.Resources.CPU` | `"500m"` | Default CPU for service jobs |
| `JobDefaults.Service.Task.Resources.Disk` | `""` | Default disk space for service jobs |
| `JobDefaults.Service.Task.Resources.GPU` | `""` | Default GPU count for service jobs |
| `JobDefaults.Service.Task.Resources.Memory` | `"512Mb"` | Default memory for service jobs |
| `Labels` | `{}` | Key-value pairs used to describe and categorize nodes |
| `Logging.Level` | `"info"` | Log level: trace, debug, info, warn, error, fatal, panic |
| `Logging.LogDebugInfoInterval` | `"30s"` | Debug info logging interval |
| `Logging.Mode` | `"default"` | Log format: default, json |
| `NameProvider` | `"puuid"` | Method to generate node names. Options: `"hostname"`, `"aws"`, `"gcp"`, `"uuid"`, `"puuid"` |
| `Orchestrator.Advertise` | `""` | URL to advertise to other servers |
| `Orchestrator.Auth.Token` | `""` | Token for compute node authentication |
| `Orchestrator.Cluster.Advertise` | `""` | Address to advertise to cluster members |
| `Orchestrator.Cluster.Host` | `""` | Hostname/IP for cluster communication |
| `Orchestrator.Cluster.Name` | `""` | Unique identifier for orchestrator cluster |
| `Orchestrator.Cluster.Peers` | `[]` | List of cluster members to connect to on startup |
| `Orchestrator.Cluster.Port` | `0` | Port for cluster communication |
| `Orchestrator.Enabled` | `false` | Enable orchestrator capabilities |
| `Orchestrator.EvaluationBroker.MaxRetryCount` | `10` | Maximum evaluation retry attempts |
| `Orchestrator.EvaluationBroker.VisibilityTimeout` | `"1m"` | How long an evaluation can be claimed |
| `Orchestrator.Host` | `"0.0.0.0"` | Hostname/IP for orchestrator connections |
| `Orchestrator.License.LocalPath` | `""` | Local license file path |
| `Orchestrator.NodeManager.DisconnectTimeout` | `"1m"` | Time before marking node as disconnected |
| `Orchestrator.NodeManager.ManualApproval` | `false` | Require manual approval for compute nodes |
| `Orchestrator.Port` | `4222` | Port for orchestrator connections |
| `Orchestrator.Scheduler.HousekeepingInterval` | `"30s"` | Interval for housekeeping tasks |
| `Orchestrator.Scheduler.HousekeepingTimeout` | `"2m"` | Timeout for housekeeping runs |
| `Orchestrator.Scheduler.QueueBackoff` | `"1m"` | Retry interval for failed jobs |
| `Orchestrator.Scheduler.WorkerCount` | `[system CPU count]` | Concurrent scheduling workers |
| `Orchestrator.SupportReverseProxy` | `false` | Configure for running behind reverse proxy |
| `Orchestrator.TLS.CACert` | `""` | CA certificate path |
| `Orchestrator.TLS.ServerCert` | `""` | Server certificate path |
| `Orchestrator.TLS.ServerKey` | `""` | Server private key path |
| `Orchestrator.TLS.ServerTimeout` | `0` | TLS timeout in seconds |
| `Publishers.Disabled` | `[]` | List of disabled publisher types |
| `Publishers.Types.IPFS.Endpoint` | `""` | IPFS API endpoint for publishing |
| `Publishers.Types.Local.Address` | `"127.0.0.1"` | Local publisher address |
| `Publishers.Types.Local.Port` | `6001` | Local publisher port |
| `Publishers.Types.S3.PreSignedURLDisabled` | `false` | Disable pre-signed URLs for S3 publisher |
| `Publishers.Types.S3.PreSignedURLExpiration` | `""` | Pre-signed URL expiration time |
| `ResultDownloaders.Disabled` | `[]` | List of disabled result downloader types |
| `ResultDownloaders.Timeout` | `""` | Timeout for download operations |
| `ResultDownloaders.Types.IPFS.Endpoint` | `""` | IPFS API endpoint for downloading results |
| `StrictVersionMatch` | `false` | Enforce strict version matching |
| `UpdateConfig.Interval` | `"24h"` | Update check interval (0 to disable) |
| `WebUI.Backend` | `""` | Backend API server (empty=use same as API server) |
| `WebUI.Enabled` | `false` | Enable web UI |
| `WebUI.Listen` | `"0.0.0.0:8438"` | Address and port for web UI |
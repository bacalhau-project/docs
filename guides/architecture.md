---
description: How to write the config.yaml file to configure your nodes
---

# Write config.yaml

On installation, Bacalhau creates a \`.bacalhau\` directory that includes a \`config.yaml\` file tailored for your specific settings. This configuration file is the central repository for custom settings for your Bacalhau nodes.

When initializing a Bacalhau node, the system determines its configuration by following a specific hierarchy. First, it checks the default settings, then the \`config.yaml\` file, followed by environment variables, and finally, any command line flags specified during execution. Configurations are set and overridden in that sequence. This layered approach allows the  default Bacalhau settings to provide a baseline, while environment variables and command-line flags offer added flexibility. However, the \`config.yaml\` file offers a reliable way to predefine all necessary settings before node creation across environments, ensuring consistency and ease of management.

{% hint style="info" %}
Modifications to the \`config.yaml\` file are not dynamically applied to existing nodes.&#x20;
{% endhint %}

A restart of the Bacalhau node is required for any changes to take effect.

Your \`config.yaml\` file starts off empty. However, you can see all available settings using the following command

```bash
bacalhau config list
```

This command showcases over a hundred configuration parameters related to users, security, metrics, updates, and node configuration, providing a comprehensive overview of the customization options available for your Bacalhau setup.

Let’s go through the different options and how your configuration file is structured.

### Config.yaml Structure&#x20;

The \`bacalhau config list\` command displays your configuration paths, segmented with periods to indicate each part you are configuring.&#x20;

Consider these configuration settings; \`user.installationid\`, \`node.name\`, \`node.compute.executionstore.path\`, \`node.compute.executionstore.type\`, \`node.requester.jobstore.type\`, and \`node.requester.jobstore.path\`. These settings help set an identifier tag for your Bacalhau user and node then establish storage options for your jobs and execution results.

In your \`config.yaml\`, these settings will be formatted like this:

```yaml
node:
    compute:
        executionstore:
            Type: BoltDB
            Path: /home/soot3/.bacalhau/compute_store/executions.db
    name: n-716571d4-b6bd-40ed-a9b1-fd25662979ad
    requester:
        jobstore:
            Type: BoltDB
            Path: /home/soot3/.bacalhau/orchestrator_store/jobs.db
user:
    installationid: 60d292e8-58f7-4019-8031-90955c431a26
```

Your yaml file hierarchy follows the period delineation - node > compute > executionstore > type for \`node.compute.executionstore.type\`.

### Configuration Options

Here are your Bacalhau configuration options in alphabetical order

| Configuration Option                                           | Description                                                                                                                                              |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| auth.accesspolicypath                                          | String path to where your security policy is stored                                                                                                      |
| auth.methods                                                   | Set authentication method for your Bacalhau network                                                                                                      |
| auth.tokenspath                                                | String path to where your security token is stored                                                                                                       |
| metrics.eventtracerpath                                        | For observability, the path to your event trace records                                                                                                  |
| metrics.libp2ptracerpath                                       | Path to your Libp2p operation traces                                                                                                                     |
| node.allowlistedlocalpaths                                     | A list of the local paths that should be allowed to be mounted into jobs within your network                                                             |
| node.bootstrapaddresses                                        | A list of IP addresses for your network                                                                                                                  |
| node.clientapi.clienttls.cacert                                | The location of your node client’s chosen Certificate Authority certificate file when self-signed certificates are used                                  |
| node.clientapi.clienttls.insecure                              | Boolean binary indicating if the client TLS is insecure, when true instructs the client to use HTTPS (TLS), but not to attempt to verify the certificate |
| node.clientapi.clienttls.usetls                                | Boolean indicating if TLS should be used for client connections                                                                                          |
| node.clientapi.host                                            | The host for the client and server to communicate on (via REST). Ignored if BACALHAU\_API\_HOST environment variable is set                              |
| node.clientapi.port                                            | The port for the client and server to communicate on (via REST). Ignored if BACALHAU\_API\_PORT environment variable is set                              |
| node.clientapi.tls.autocert                                    | Hostname for a certificate to be automatically obtained via ACME                                                                                         |
| node.clientapi.tls.autocertcachepath                           | The directory where the autocert process will cache certificates to avoid rate limits                                                                    |
| node.clientapi.tls.servercertificate                           | The location of a TLS certificate to be used by the requester to serve TLS requests                                                                      |
| node.clientapi.tls.serverkey                                   | The TLS server key to match the certificate to allow the requester to serve TLS                                                                          |
| node.compute.capacity.defaultjobresourcelimits.cpu             | Sets default CPU resource limits for jobs on your Compute node                                                                                           |
| node.compute.capacity.defaultjobresourcelimits.disk            | Sets default disk resource limits for jobs on your Compute node                                                                                          |
| node.compute.capacity.defaultjobresourcelimits.gpu             | Sets default GPU resource limits for jobs on your Compute node                                                                                           |
| node.compute.capacity.defaultjobresourcelimits.memory          | Sets default memory resource limits for jobs on your Compute node                                                                                        |
| node.compute.capacity.ignorephysicalresourcelimits             | Boolean that tells the compute node to ignore its physical resource limits when true                                                                     |
| node.compute.capacity.jobresourcelimits.cpu                    | Sets the specific per job amount of CPU the system can use at one time                                                                                   |
| node.compute.capacity.jobresourcelimits.disk                   | Sets the specific per job amount of disk the system can use at one time                                                                                  |
| node.compute.capacity.jobresourcelimits.gpu                    | Sets the specific per job amount of GPU the system can use at one time                                                                                   |
| node.compute.capacity.jobresourcelimits.memory                 | Sets the specific per job amount of memory the system can use at one time                                                                                |
| node.compute.capacity.queueresourcelimits.cpu                  | Sets the CPU resource limits for your job queue                                                                                                          |
| node.compute.capacity.queueresourcelimits.disk                 | Sets the disk resource limits for your job queue                                                                                                         |
| node.compute.capacity.queueresourcelimits.gpu                  | Sets the GPU resource limits for your job queue                                                                                                          |
| node.compute.capacity.queueresourcelimits.memory               | Sets the memory resource limits for your job queue                                                                                                       |
| node.compute.capacity.totalresourcelimits.cpu                  | Total amount of CPU the system can use at one time in aggregate for all jobs                                                                             |
| node.compute.capacity.totalresourcelimits.disk                 | Total amount of disk the system can use at one time in aggregate for all jobs                                                                            |
| node.compute.capacity.totalresourcelimits.gpu                  | Total amount of GPU the system can use at one time in aggregate for all jobs                                                                             |
| node.compute.capacity.totalresourcelimits.memory               | Total amount of memory the system can use at one time in aggregate for all jobs                                                                          |
| node.compute.executionstore.path                               | A metadata store of job executions handled by the current compute node                                                                                   |
| node.compute.executionstore.type                               | The type of store used by the compute node                                                                                                               |
| node.compute.jobselection.acceptnetworkedjobs                  | Boolean signifying if jobs that specify networking should be accepted                                                                                    |
| node.compute.jobselection.locality                             | Sets job selection policy based on where the data for the job is located. ‘local’ or ‘anywhere’                                                          |
| node.compute.jobselection.probeexec                            | Use the result of an executed external program to decide if a job should be accepted. Overrides data locality settings                                   |
| node.compute.jobselection.probehttp                            | Use the result of a HTTP POST to decide if a job should be accepted. Overrides data locality settings                                                    |
| node.compute.jobselection.rejectstatelessjobs                  | Boolean signifying if jobs that don’t specify any data should be rejected                                                                                |
| node.compute.jobtimeouts.defaultjobexecutiontimeout            | Default value for job execution timeouts on your current compute node. It will be assigned to jobs with no timeout requirement defined                   |
| node.compute.jobtimeouts.jobexecutiontimeoutclientidbypasslist | List of clients that are allowed to bypass the job execution timeout check                                                                               |
| node.compute.jobtimeouts.jobnegotiationtimeout                 | Default timeout value to hold a bid for a job                                                                                                            |
| node.compute.jobtimeouts.maxjobexecutiontimeout                | Default value for the maximum execution timeout this compute node supports. Jobs with higher timeout requirements will not be bid on                     |
| node.compute.jobtimeouts.minjobexecutiontimeout                | Default value for the minimum execution timeout this compute node supports. Jobs with lower timeout requirements will not be bid on                      |
| node.compute.localpublisher.address                            | The address for the local publisher's server to bind to                                                                                                  |
| node.compute.localpublisher.directory                          | The directory where the local publisher will store content                                                                                               |
| node.compute.localpublisher.port                               | The port for the local publisher's server to bind to (default: 6001)                                                                                     |
| node.compute.logging.logrunningexecutionsinterval              | The duration interval your compute node should generate logs on the running job executions                                                               |
| node.compute.logstreamconfig.channelbuffersize                 | How many messages to buffer in the log stream channel, per stream                                                                                        |
| node.compute.manifestcache.duration                            | The default time-to-live for each record in the manifest cache                                                                                           |
| node.compute.manifestcache.frequency                           | The frequency that the checks for stale records is performed                                                                                             |
| node.compute.manifestcache.size                                | Specifies the number of items that can be held in the manifest cache                                                                                     |
| node.compute.queue                                             | Maps job queues for your compute node                                                                                                                    |
| node.computestoragepath                                        | Path to the storage repository for your execution data within your compute node                                                                          |
| node.disabledfeatures.engines                                  | List of Engine types to disable                                                                                                                          |
| node.disabledfeatures.publishers                               | List of Publisher types to disable                                                                                                                       |
| node.disabledfeatures.storages                                 | List of Storage types to disable                                                                                                                         |
| node.downloadurlrequestretries                                 | Number of retries attempted for the download requests in your node                                                                                       |
| node.downloadurlrequesttimeout                                 | Duration before a timeout when processing download requests                                                                                              |
| node.executorpluginpath                                        | Path to the directory for your executor plugins                                                                                                          |
| node.ipfs.apilistenaddresses                                   | Addresses the internal IPFS node will listen on for API connections                                                                                      |
| node.ipfs.connect                                              | The ipfs host multiaddress to connect to, otherwise an in-process IPFS node will be created if not set                                                   |
| node.ipfs.gatewaylistenaddresses                               | Addresses the internal IPFS node will listen on for gateway connections                                                                                  |
| node.ipfs.privateinternal                                      | Boolean confirming the presence of an embedded ipfs                                                                                                      |
| node.ipfs.profile                                              | Profile for internal IPFS node                                                                                                                           |
| node.ipfs.servepath                                            | Path of the IPFS repo                                                                                                                                    |
| node.ipfs.swarmaddresses                                       | List of IPFS multiaddresses that the in-process IPFS should connect to                                                                                   |
| node.ipfs.swarmkeypath                                         | Optional IPFS swarm key required to connect to a private IPFS swarm                                                                                      |
| node.ipfs.swarmlistenaddresses                                 | Addresses the internal IPFS node will listen on for swarm connections                                                                                    |
| node.labels                                                    | List of labels to apply to the node that can be used for node selection and filtering                                                                    |
| node.libp2p.peerconnect                                        | Peerconnect setting for libp2p                                                                                                                           |
| node.libp2p.swarmport                                          | Swarmport setting for libp2p                                                                                                                             |
| node.loggingmode                                               | Switch between available logging formats for your node - default, station, json, combined, event                                                         |
| node.name                                                      | The name of the node. If not set, the node name will be generated automatically based on the chosen name provider                                        |
| node.nameprovider                                              | The name provider to use to generate the node name, if no name is set                                                                                    |
| node.network.advertisedaddress                                 | Address to advertise to compute nodes to connect to                                                                                                      |
| node.network.authsecret                                        | Authentication secret for network connections                                                                                                            |
| node.network.cluster.advertisedaddress                         | Address to advertise to other orchestrators to connect to                                                                                                |
| node.network.cluster.name                                      | Name of the cluster to join                                                                                                                              |
| node.network.cluster.peers                                     | Comma-separated list of other orchestrators to connect to form a cluster                                                                                 |
| node.network.cluster.port                                      | Port to listen for connections from other orchestrators to form a cluster                                                                                |
| node.network.orchestrators                                     | Comma-separated list of orchestrators to connect to. Applies to compute nodes                                                                            |
| node.network.port                                              | Port to listen for connections from other nodes. Applies to orchestrator nodes                                                                           |
| node.network.storedir                                          | Directory that the network can use for storage                                                                                                           |
| node.network.type                                              | NetworkFull, NetworkNone, NetworkHTTP                                                                                                                    |
| node.nodeinfostorettl                                          | Sets the duration for which node information is retained in the node info store after which it is automatically removed from the store                   |
| node.requester.defaultpublisher                                | A default publisher to apply to all jobs without a publisher                                                                                             |
| node.requester.evaluationbroker.evalbrokerinitialretrydelay    | Initial retry delay for the evaluation broker                                                                                                            |
| node.requester.evaluationbroker.evalbrokermaxretrycount        | Maximum retry count for the evaluation broker                                                                                                            |
| node.requester.evaluationbroker.evalbrokersubsequentretrydelay | Subsequent retry delay for the evaluation broker                                                                                                         |
| node.requester.evaluationbroker.evalbrokervisibilitytimeout    | Visibility timeout for the evaluation broker                                                                                                             |
| node.requester.externalverifierhook                            | URL specifying where to send external verification requests to                                                                                           |
| node.requester.failureinjectionconfig.isbadactor               | Boolean indicating if failure injection config is a bad actor                                                                                            |
| node.requester.housekeepingbackgroundtaskinterval              | Duration between Bacalhau housekeeping runs                                                                                                              |
| node.requester.jobdefaults.executiontimeout                    | The maximum amount of time a task is allowed to run in seconds. Zero means no timeout, such as for a daemon task                                         |
| node.requester.jobselectionpolicy.acceptnetworkedjobs          | Boolean signifying if jobs that specify networking should be accepted                                                                                    |

| node.requester.jobselectionpolicy.locality               | Sets job selection policy based on where the data for the job is located. ‘local’ or ‘anywhere’                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node.requester.jobselectionpolicy.probeexec              | Use the result of an executed external program to decide if a job should be accepted. Overrides data locality settings                                   |
| node.requester.jobselectionpolicy.probehttp              | Use the result of a HTTP POST to decide if a job should be accepted. Overrides data locality settings                                                    |
| node.requester.jobselectionpolicy.rejectstatelessjobs    | Boolean signifying if jobs that don’t specify any data should be rejected                                                                                |
| node.requester.jobstore.path                             | The path used for the requester job store store when using BoltDB                                                                                        |
| node.requester.jobstore.type                             | The type of job store used by the requester node (BoltDB)                                                                                                |
| node.requester.noderankrandomnessrange                   | Description missing                                                                                                                                      |
| node.requester.overaskforbidsfactor                      | Number of compute nodes the requester node should ask to bid for a job when deciding on scheduling                                                       |
| node.requester.storageprovider.s3.presignedurldisabled   | Boolean deciding if a secure S3 URL should be generated and used. Default false, Disabled if true.                                                       |
| node.requester.storageprovider.s3.presignedurlexpiration | Defined expiration interval for your secure S3 urls                                                                                                      |
| node.requester.tagcache.duration                         | The default time-to-live for each record in the tag cache                                                                                                |
| node.requester.tagcache.frequency                        | The frequency that the checks for stale records is performed                                                                                             |
| node.requester.tagcache.size                             | Specifies the number of items that can be held in the tag cache                                                                                          |
| node.requester.translationenabled                        | Whether jobs should be translated at the requester node or not. Default: false                                                                           |
| node.requester.worker.workercount                        | Number of workers that should be generated under your requester node                                                                                     |
| node.requester.worker.workerevaldequeuebasebackoff       | Default time for your workers to be taken off the evaluation list for new tasks                                                                          |
| node.requester.worker.workerevaldequeuemaxbackoff        | Maximum time for your workers to be taken off the evaluation list for new tasks                                                                          |
| node.requester.worker.workerevaldequeuetimeout           | Time for your workers to be evaluated within the queue                                                                                                   |
| node.serverapi.clienttls.cacert                          | The location of your server’s chosen Certificate Authority certificate file when self-signed certificates are used                                       |
| node.serverapi.clienttls.insecure                        | Boolean binary indicating if the server TLS is insecure, when true instructs the server to use HTTPS (TLS), but not to attempt to verify the certificate |
| node.serverapi.clienttls.usetls                          | Boolean indicating if TLS should be used for server connections                                                                                          |
| node.serverapi.host                                      | The host to serve on                                                                                                                                     |
| node.serverapi.port                                      | The port to serve on                                                                                                                                     |
| node.serverapi.tls.autocert                              | Specifies a host name for which ACME is used to obtain a TLS Certificate. Using this option results in the API serving over HTTPS                        |
| node.serverapi.tls.autocertcachepath                     | The directory where the autocert process will cache certificates to avoid rate limits                                                                    |
| node.serverapi.tls.servercertificate                     | Specifies a TLS certificate file to be used by the requester node                                                                                        |
| node.serverapi.tls.serverkey                             | Specifies a TLS key file matching the certificate to be used by the requester node                                                                       |
| node.strictversionmatch                                  | Description missing                                                                                                                                      |
| node.type                                                | Whether the node is a compute, requester or both                                                                                                         |
| node.volumesizerequesttimeout                            | Duration before a timeout when parsing a node’s volume size.                                                                                             |
| node.webui.enabled                                       | Whether to start the web UI alongside the bacalhau node                                                                                                  |
| node.webui.port                                          | The port number to listen on for web-ui connections                                                                                                      |
| update.checkfrequency                                    | The frequency with which your system checks for version updates                                                                                          |
| update.checkstatepath                                    | Version state is stored in this directory                                                                                                                |
| update.skipchecks                                        | Boolean, checks are skipped on your system if true                                                                                                       |
| user.installationid                                      | String tag applied to your user on installation                                                                                                          |
| user.keypath                                             | Path to user authentication key. Client key will be used if a private key is not specified                                                               |

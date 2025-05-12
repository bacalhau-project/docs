---
description: The different job types available in Bacalhau
---

# Type

Bacalhau has recently introduced different job types in v1.1, providing more control and flexibility over the orchestration and scheduling of those jobs - depending on their type.

Despite the differences in job types, all jobs benefit from core functionalities provided by Bacalhau, including:

1. **Node selection** - the appropriate nodes are selected based on several criteria, including resource availability, priority and feedback from the nodes.
2. **Job monitoring** - jobs are monitored to ensure they complete, and that they stay in a healthy state.
3. **Retries** - within limits, Bacalhau will retry certain jobs a set number of times should it fail to complete successfully when requested.

### Batch Jobs

Batch jobs are executed on demand, running on a specified number of Bacalhau nodes. These jobs either run until completion or until they reach a timeout. They are designed to carry out a single, discrete task before finishing. This is the only [queueable](/docs/guides/queueing.md) job type.

Ideal for intermittent yet intensive data dives, for instance performing computation over large datasets before publishing the response. This approach eliminates the continuous processing overhead, focusing on specific, in-depth investigations and computation.

<details>

<summary>Batch Job Example</summary>

This example shows a sample Batch job [declarative](./) description with all available parameters.&#x20;

The example demonstrates a job that:

1. Has a priority of 100
2. Will be executed on 2 nodes
3. Will be executed only on nodes with Linux OS
4. Uses the docker engine
5. Executes a python script with multiple arguments
6. Preloads and mounts IPFS data as a local directory
7. Publishes the results to the IPFS
8. Has network access type HTTP and 2 allowed domains

```yaml
# This example shows a sample job file. 
# Parameters, marked as Optional can be skipped - the default values will be used


# Name of the job. Optional. Default value - job ID
Name: Batch Job Example


# Type of the job
Type: batch


# The namespace in which the job is running. Default value - “default”
Namespace: default


# Priority - determines the scheduling priority. By default is 0
Priority: 100


# Count - number of replicas to be scheduled. 
# This is only applicable for jobs of type batch and service.
Count: 2


# Meta - arbitrary metadata associated with the job. 
# Optional
Meta:
  Job purpose : Provide detailed example of the batch job
  Meta purpose: Describe the job


# Labels - Arbitrary labels associated with the job for filtering purposes. 
# Optional
Labels:
  Some option: Some text
  Some other option: Some other text


# Constraint - a condition that must be met for a compute node to be eligible to run a given job. 
# Should be specified in a following format: key - operator - value
# Optional.
Constraints:
- Key: "Operating-System"
  Operator: "="
  Values: ["linux"]


# Task associated with the job, which defines a unit of work within the job. 
# Currently, only one task per job is supported.
Tasks:
  # Name - unique identifier for a task. Default value - “main”
  - Name: Important Calculations


    # Engine - the execution engine for the task. 
    # Defines engine type (docker or wasm) and relevant parameters. 
    # In this example, docker engine will be used.  
    Engine:
      Type: docker


    # Params: A set of key-value pairs that provide the specific configurations for the chosen type
      Params:

        # Image: docker image to be used in the task.
        Image: alek5eyk/batchjobexample:1.1


        # Entrypoint defines a command that will be executed when container starts. 
        # For this example we don't need any so default value 'null' can be used
        Entrypoint: null


        # Parameters define CLI commands, executed after entrypoint        
        Parameters:
          - python
          - supercalc.py
          - "5"
          - /outputs/result.txt


        # WorkingDirectory sets a working directory for entrypoint and paramters' commands.
        # Default value - empty string ""
        WorkingDirectory: ""


        # EnvironmentVariables sets environment variables for the engine
        EnvironmentVariables:
        - DEFAULT_USER_NAME = root
        - API_KEY = none


        # Meta - arbitrary metadata associated with the task. 
        # Optional
        Meta:
          Task goal : show how to create declarative descriptions

    # Publisher specifies where the results of the task should be published - S3, IPFS, Local or none
    # Optional
    # To use IPFS publisher you need to specify only type
    # To use S3 publisher you need to specify bucket, key, region and endpoint
    # See S3 Publisher specification for more details
    Publisher:
      Type: ipfs


    # InputSources lists remote artifacts that should be downloaded before task execution 
    # and mounted within the task
    # Optional
    InputSources:
      - Target: /data
        Source:
          Type: ipfs
          Params:
            CID: "QmSYE8dVx6RTdDFFhBu51JjFG1fwwPdUJoXZ4ZNXvfoK2V"



    # ResultPaths indicate volumes within the task that should be included in the published result
    # Only applicable for batch and ops jobs.
    # Optional
    ResultPaths:
      - Name: outputs
        Path: /outputs


    # Resources is a structured way to detail the required computational resources for the task. 
    # Optional
    Resources:
      # CPU can be specified in cores (e.g. 1) or in milliCPU units (e.g. 250m or 0.25)
      CPU: 250m
      
      # Memory highlights amount of RAM for a job. Can be specified in Kb, Mb, Gb, Tb
      Memory: 1Gb
      
      # Disk states disk storage space, needed for the task.
      Disk: 100mb

      # Denotes the number of GPU units required.
      GPU: "0"


    # Network specifies networking requirements.  
    # Optional
    # Job may have full access to the network,
    # may have no access at all,
    # or may have limited HTTP(S) access to a specific list of domains
    Network:
      Domains:
      - example.com
      - ghcr.io
      Type: HTTP


    # Timeouts define configurations concerning any timeouts associated with the task. 
    # Optional
    Timeouts:
      # QueueTimeout defines how long will job wait for suitable nodes in the network
      # if none are currently available.
      QueueTimeout: 101

      # TotalTimeout defines job execution timeout. When it is reached the job will be terminated
      TotalTimeout: 301
```

</details>

### Ops Jobs

Similar to batch jobs, ops jobs have a broader reach. They are executed on all nodes that align with the job specification, but otherwise behave like batch jobs.

Ops jobs are perfect for urgent investigations, granting direct access to logs on host machines, where previously you may have had to wait for the logs to arrive at a central location before being able to query them. They can also be used for delivering configuration files for other systems should you wish to deploy an update to many machines at once.

<details>

<summary>Ops Job Example</summary>

This example shows a sample Ops job [declarative](./) description with all available parameters.&#x20;

The example demonstrates a job that:

1. Has a priority of 100
2. Will be executed on all suitable nodes
3. Will be executed only on nodes with label = WebService
4. Uses the docker engine
5. Executes a query with manually specified parameters
6. Has access to a local directory
7. Publishes the results to the IPFS, if any
8. Has network access type HTTP and 2 allowed domains

```yaml
# This example shows a sample ops job file. 
# Parameters, marked as Optional can be skipped - the default values will be used
# Example from the https://blog.bacalhau.org/p/real-time-log-analysis-with-bacalhau is used


# Name of the job. Optional. Default value - job ID
Name: Live logs processing


# Type of the job
Type: ops


# The namespace in which the job is running. Default value - “default”
Namespace: logging


# Priority - determines the scheduling priority. By default is 0
Priority: 100


# Meta - arbitrary metadata associated with the job. 
# Optional
Meta:
  Job purpose : Provide detailed example of the ops job
  Meta purpose: Describe the job


# Labels - Arbitrary labels associated with the job for filtering purposes. 
# Optional
Labels:
  Job type: ops job
  Ops job feature: To be executed on all suitable nodes


# Constraint - a condition that must be met for a compute node to be eligible to run a given job. 
# Should be specified in a following format: key - operator - value
# Optional.
Constraints:
  - Key: service
    Operator: ==
    Values:
      - WebService


# Task associated with the job, which defines a unit of work within the job. 
# Currently, only one task per job is supported.
Tasks:
  # Name - unique identifier for a task. Default value - “main”
  - Name: LiveLogProcessing


    # Engine - the execution engine for the task. 
    # Defines engine type (docker or wasm) and relevant parameters. 
    # In this example, docker engine will be used.  
    Engine:
      Type: docker


    # Params: A set of key-value pairs that provide the specific configurations for the chosen type
      Params:

        # Image: docker image to be used in the task.
        Image: expanso/nginx-access-log-processor:1.0.0


        # Entrypoint defines a command that will be executed when container starts. 
        # For this example we don't need any so default value 'null' can be used
        Entrypoint: null


        # Parameters define CLI commands, executed after entrypoint        
        Parameters:
          - --query
          - {{.query}}
          - --start-time
          - {{or (index . "start-time") ""}}
          - --end-time
          - {{or (index . "end-time") ""}}


        # WorkingDirectory sets a working directory for entrypoint and paramters' commands.
        # Default value - empty string ""
        WorkingDirectory: ""


        # EnvironmentVariables sets environment variables for the engine
        EnvironmentVariables:
        - DEFAULT_USER_NAME = root
        - API_KEY = none


        # Meta - arbitrary metadata associated with the task. 
        # Optional
        Meta:
          Task goal : show how to create declarative descriptions

    # Publisher specifies where the results of the task should be published - S3, IPFS, Local or none
    # Optional
    # To use IPFS publisher you need to specify only type
    # To use S3 publisher you need to specify bucket, key, region and endpoint
    # See S3 Publisher specification for more details
    Publisher:
      Type: ipfs


    # InputSources lists remote artifacts that should be downloaded before task execution 
    # and mounted within the task.
    # Ensure that localDirectory source is enabled on the nodes
    # Optional
    InputSources:
      - Target: /logs
        Source:
          Type: localDirectory
          Params:
            SourcePath: /data/log-orchestration/logs



    # ResultPaths indicate volumes within the task that should be included in the published result
    # Only applicable for batch and ops jobs.
    # Optional
    ResultPaths:
      - Name: outputs
        Path: /outputs


    # Resources is a structured way to detail the required computational resources for the task. 
    # Optional
    Resources:
      # CPU can be specified in cores (e.g. 1) or in milliCPU units (e.g. 250m or 0.25)
      CPU: 250m
      
      # Memory highlights amount of RAM for a job. Can be specified in Kb, Mb, Gb, Tb
      Memory: 1Gb
      
      # Disk states disk storage space, needed for the task.
      Disk: 100mb

      # Denotes the number of GPU units required.
      GPU: "0"


    # Network specifies networking requirements.  
    # Optional
    # Job may have full access to the network,
    # may have no access at all,
    # or may have limited HTTP(S) access to a specific list of domains
    Network:
      Domains:
      - example.com
      - ghcr.io
      Type: HTTP


    # Timeouts define configurations concerning any timeouts associated with the task. 
    # Optional
    Timeouts:
      # QueueTimeout defines how long will job wait for suitable nodes in the network
      # if none are currently available.
      QueueTimeout: 101

      # TotalTimeout defines job execution timeout. When it is reached the job will be terminated
      TotalTimeout: 301

```

</details>

### Daemon Jobs

Daemon jobs run continuously on all nodes that meet the criteria given in the job specification. Should any new compute nodes join the cluster after the job was started, and should they meet the criteria, the job will be scheduled to run on that node too.

A good application of daemon jobs is to handle continuously generated data on every compute node. This might be from edge devices like sensors, or cameras, or from logs where they are generated. The data can then be aggregated and compressed them before sending it onwards. For logs, the aggregated data can be relayed at regular intervals to platforms like Kafka or Kinesis, or directly to other logging services with edge devices potentially delivering results via MQTT.

<details>

<summary>Daemon Job Example</summary>

This example shows a sample Daemon job [declarative](./) description with all available parameters.&#x20;

The example demonstrates a job that:

1. Has a priority of 100
2. Will be executed continuously on all suitable nodes
3. Will be executed only on nodes with label = WebService
4. Uses the docker engine
5. Executes a query with manually specified parameters
6. Has access to 2 local directories with logs
7. Publishes the results to the IPFS, if any
8. Has network access type Full in order to send data to the S3 storage

```yaml
# This example shows a sample daemon job file. 
# Parameters, marked as Optional can be skipped - the default values will be used
# Example from the https://blog.bacalhau.org/p/tutorial-save-25-m-yearly-by-managing is used

# Name of the job. Optional. Default value - job ID
Name: Logstash


# Type of the job
Type: daemon


# The namespace in which the job is running. Default value - “default”
Namespace: logging


# Priority - determines the scheduling priority. By default is 0
Priority: 100


# Meta - arbitrary metadata associated with the job. 
# Optional
Meta:
  Job purpose : Provide detailed example of the daemon job
  Meta purpose: Describe the job


# Labels - Arbitrary labels associated with the job for filtering purposes. 
# Optional
Labels:
  Job type: daemon job
  Daemon job feature: To be executed continuously on all suitable nodes


# Constraint - a condition that must be met for a compute node to be eligible to run a given job. 
# Should be specified in a following format: key - operator - value
# Optional.
Constraints:
  - Key: service
    Operator: ==
    Values:
      - WebService


# Task associated with the job, which defines a unit of work within the job. 
# Currently, only one task per job is supported.
Tasks:
  # Name - unique identifier for a task. Default value - “main”
  - Name: main


    # Engine - the execution engine for the task. 
    # Defines engine type (docker or wasm) and relevant parameters. 
    # In this example, docker engine will be used.  
    Engine:
      Type: docker


    # Params: A set of key-value pairs that provide the specific configurations for the chosen type
      Params:

        # Image: docker image to be used in the task.
        Image: expanso/nginx-access-log-agent:1.0.0


        # Entrypoint defines a command that will be executed when container starts. 
        # For this example we don't need any so default value 'null' can be used
        Entrypoint: null


        # Parameters define CLI commands, executed after entrypoint        
        Parameters:
          - --query
          - {{.query}}
          - --start-time
          - {{or (index . "start-time") ""}}
          - --end-time
          - {{or (index . "end-time") ""}}


        # WorkingDirectory sets a working directory for entrypoint and paramters' commands.
        # Default value - empty string ""
        WorkingDirectory: ""


        # EnvironmentVariables sets environment variables for the engine
        EnvironmentVariables:
          - OPENSEARCH_ENDPOINT={{.OpenSearchEndpoint}}
          - S3_BUCKET={{.AccessLogBucket}}
          - AWS_REGION={{.AWSRegion}}
          - AGGREGATE_DURATION=10
          - S3_TIME_FILE=60


        # Meta - arbitrary metadata associated with the task. 
        # Optional
        Meta:
          Task goal : show how to create declarative descriptions

    # Publisher specifies where the results of the task should be published - S3, IPFS, Local or none
    # Optional
    # To use IPFS publisher you need to specify only type
    # To use S3 publisher you need to specify bucket, key, region and endpoint
    # See S3 Publisher specification for more details
    Publisher:
      Type: ipfs


    # InputSources lists remote artifacts that should be downloaded before task execution 
    # and mounted within the task.
    # Ensure that localDirectory source is enabled on the nodes
    # Optional
    InputSources:
      - Target: /app/logs
        Source:
          Type: localDirectory
          Params:
            SourcePath: /data/log-orchestration/logs
      - Target: /app/state
        Source:
          Type: localDirectory
          Params:
            SourcePath: /data/log-orchestration/state
            ReadWrite: true



    # ResultPaths indicate volumes within the task that should be included in the published result
    # Only applicable for batch and ops jobs.
    # Optional
    ResultPaths:
      - Name: outputs
        Path: /outputs


    # Resources is a structured way to detail the required computational resources for the task. 
    # Optional
    Resources:
      # CPU can be specified in cores (e.g. 1) or in milliCPU units (e.g. 250m or 0.25)
      CPU: 250m
      
      # Memory highlights amount of RAM for a job. Can be specified in Kb, Mb, Gb, Tb
      Memory: 1Gb
      
      # Disk states disk storage space, needed for the task.
      Disk: 100mb

      # Denotes the number of GPU units required.
      GPU: "0"


    # Network specifies networking requirements.  
    # Optional
    # Job may have full access to the network,
    # may have no access at all,
    # or may have limited HTTP(S) access to a specific list of domains
    Network:
      Type: Full


    # Timeouts define configurations concerning any timeouts associated with the task. 
    # Optional
    Timeouts:
      # QueueTimeout defines how long will job wait for suitable nodes in the network
      # if none are currently available.
      QueueTimeout: 101

      # TotalTimeout defines job execution timeout. When it is reached the job will be terminated
      TotalTimeout: 301
```

</details>

### Service Jobs

Service jobs run continuously on a specified number of nodes that meet the criteria given in the job specification. Bacalhau's orchestrator selects the optimal nodes to run the job, and continuously monitors its health, performance. If required, it will reschedule on other nodes.

This job type is good for long-running consumers such as streaming or queuing services, or real-time event listeners.

<details>

<summary>Service Job Example</summary>

This example shows a sample Service job [declarative](./) description with all available parameters.&#x20;

The example demonstrates a job that:

1. Has a priority of 100
2. Will be executed continuously on all suitable nodes
3. Will be executed only on nodes with architecture = arm64 and located in the us-west-2 region
4. Uses the docker engine
5. Executes a query with multiple parameters
6. Has access to 2 local directories with logs
7. Publishes the results to the IPFS, if any
8. Has network access type Full in order to send data to the S3 storage

```yaml
# This example shows a sample daemon job file. 
# Parameters, marked as Optional can be skipped - the default values will be used
# Example from the https://blog.bacalhau.org/p/introducing-new-job-types-new-horizons is used

# Name of the job. Optional. Default value - job ID
Name: Kinesis Consumer


# Type of the job
Type: service


# The namespace in which the job is running. Default value - “default”
Namespace: service


# Priority - determines the scheduling priority. By default is 0
Priority: 100


# Meta - arbitrary metadata associated with the job. 
# Optional
Meta:
  Job purpose : Provide detailed example of the service job
  Meta purpose: Describe the job


# Labels - Arbitrary labels associated with the job for filtering purposes. 
# Optional
Labels:
  Job type: service job
  Daemon job feature: To be executed continuously on a certain amount of suitable nodes


# Constraint - a condition that must be met for a compute node to be eligible to run a given job. 
# Should be specified in a following format: key - operator - value
# Optional.
Constraints:
  - Key: Architecture
    Operator: '='
    Values:
      - arm64
  - Key: region
    Operator: '='
    Values:
      - us-west-2


# Task associated with the job, which defines a unit of work within the job. 
# Currently, only one task per job is supported.
Tasks:
  # Name - unique identifier for a task. Default value - “main”
  - Name: main


    # Engine - the execution engine for the task. 
    # Defines engine type (docker or wasm) and relevant parameters. 
    # In this example, docker engine will be used.  
    Engine:
      Type: docker


    # Params: A set of key-value pairs that provide the specific configurations for the chosen type
      Params:

        # Image: docker image to be used in the task.
        Image: my-kinesis-consumer:latest


        # Entrypoint defines a command that will be executed when container starts. 
        # For this example we don't need any so default value 'null' can be used
        Entrypoint: null


        # Parameters define CLI commands, executed after entrypoint        
        Parameters:
          - -stream-arn
          - arn:aws:kinesis:us-west-2:123456789012:stream/my-kinesis-stream
          - -shard-iterator
          - TRIM_HORIZON


        # WorkingDirectory sets a working directory for entrypoint and paramters' commands.
        # Default value - empty string ""
        WorkingDirectory: ""


        # EnvironmentVariables sets environment variables for the engine
        EnvironmentVariables:
          - DEFAULT_USER_NAME = root
          - API_KEY = none


        # Meta - arbitrary metadata associated with the task. 
        # Optional
        Meta:
          Task goal : show how to create declarative descriptions

    # Publisher specifies where the results of the task should be published - S3, IPFS, Local or none
    # Optional
    # To use IPFS publisher you need to specify only type
    # To use S3 publisher you need to specify bucket, key, region and endpoint
    # See S3 Publisher specification for more details
    Publisher:
      Type: ipfs


    # InputSources lists remote artifacts that should be downloaded before task execution 
    # and mounted within the task.
    # Ensure that localDirectory source is enabled on the nodes
    # Optional
    InputSources:
      - Target: /app/logs
        Source:
          Type: localDirectory
          Params:
            SourcePath: /data/log-orchestration/logs
      - Target: /app/state
        Source:
          Type: localDirectory
          Params:
            SourcePath: /data/log-orchestration/state
            ReadWrite: true



    # ResultPaths indicate volumes within the task that should be included in the published result
    # Only applicable for batch and ops jobs.
    # Optional
    ResultPaths:
      - Name: outputs
        Path: /outputs


    # Resources is a structured way to detail the required computational resources for the task. 
    # Optional
    Resources:
      # CPU can be specified in cores (e.g. 1) or in milliCPU units (e.g. 250m or 0.25)
      CPU: 250m
      
      # Memory highlights amount of RAM for a job. Can be specified in Kb, Mb, Gb, Tb
      Memory: 4Gb
      
      # Disk states disk storage space, needed for the task.
      Disk: 100mb

      # Denotes the number of GPU units required.
      GPU: "0"


    # Network specifies networking requirements.  
    # Optional
    # Job may have full access to the network,
    # may have no access at all,
    # or may have limited HTTP(S) access to a specific list of domains
    Network:
      Type: Full


    # Timeouts define configurations concerning any timeouts associated with the task. 
    # Optional
    Timeouts:
      # QueueTimeout defines how long will job wait for suitable nodes in the network
      # if none are currently available.
      QueueTimeout: 101

      # TotalTimeout defines job execution timeout. When it is reached the job will be terminated
      TotalTimeout: 301
```

</details>

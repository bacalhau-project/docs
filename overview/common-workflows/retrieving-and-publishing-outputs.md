# Retrieving & Publishing Outputs

This guide explains how to configure output publishing and retrieve results from Bacalhau jobs across different storage systems. Proper output handling is essential for building effective data pipelines and workflows.

### What You'll Learn

* How Bacalhau's Publishers mechanism works
* How to configure different output destination types
* How to retrieve outputs from various storage systems
* How to choose the right publisher for your use case

### Understanding Publishers and Result Paths

In Bacalhau, you need to configure two key components for handling outputs:

1. A **Publisher** defines where your job's output files are stored after execution
2. **Result Paths** specify which directories should be captured as job results.&#x20;

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --publisher <uri><path> \
  --output outputs:/outputs \
  ubuntu:latest -- echo "Hello, Bacalhau" > /outputs/hello.txt
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Publisher:
  Type: <type>
  Params:
    Key: Value

ResultPaths:
  - Name: outputs
    Path: /outputs
```
{% endtab %}
{% endtabs %}

**Retrieving Local Outputs**

After your job completes, retrieve outputs using the `bacalhau job get` command:

```bash
bacalhau job get <jobID>
```

This will download all published outputs to your current directory.



**Important Notes:**

* If you define a publisher without specifying result paths, only stdout and stderr will be uploaded to the chosen publisher
* If you define result paths without a publisher, the job will fail
* You can have multiple result paths, each capturing different directories

### Publisher Types

Bacalhau supports multiple publisher types to accommodate different needs and infrastructure requirements.

#### S3 Publisher

The S3 Publisher uploads outputs to an Amazon S3 bucket or any S3-compatible storage service, such as MinIO. The compute node must have permission to write to the bucket, and the orchestrator must have permission to provide pre-signed URLs to download the results.

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --publisher s3://my-bucket/bacalhau-output \
  --output outputs:/outputs \
  ubuntu:latest -- bash -c "echo 'results' > /outputs/results.txt"
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo 'results' > /outputs/results.txt
    Publisher:
      Type: s3
      Params:
        Bucket: my-bucket
        Key: bacalhau-outputs
    ResultPaths:
      - Name: outputs
        Path: /outputs
```
{% endtab %}
{% endtabs %}

#### IPFS Publisher

The IPFS Publisher uploads outputs to the InterPlanetary File System. Both the client (downloading the result) and the compute node must be connected to an IPFS daemon.

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --publisher ipfs \
  --output outputs:/outputs \
  ubuntu:latest -- bash -c "echo 'results' > /outputs/results.txt"
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo 'results' > /outputs/results.txt
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs
```
{% endtab %}
{% endtabs %}



#### Local Publisher

The Local Publisher saves outputs to the local filesystem of the compute node that ran your job. This is intended for **local testing only**, as it requires the client downloading the results to be on the same network as the compute node.

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --publisher local \
  --output outputs:/outputs \
  ubuntu:latest -- bash -c "echo 'results' > /outputs/results.txt"
```


{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo 'results' > /outputs/results.txt
    Publisher:
      Type: local
    ResultPaths:
      - Name: outputs
        Path: /outputs

```
{% endtab %}
{% endtabs %}

### Troubleshooting

#### No Outputs Found

If you don't see expected outputs:

1. Check that your job wrote to the directories specified in your `ResultPaths`
2. Verify the job completed successfully with `bacalhau job describe <jobID>`
3. Check for errors in the logs with `bacalhau job logs <jobID>`

#### S3 Publishing Issues

For S3 publisher problems:

1. Ensure compute nodes have proper IAM roles or credentials to write to the bucket
2. Check that the orchestrator has permissions to generate pre-signed URLs

#### IPFS Publishing Issues

For IPFS publisher issues:

1. Ensure IPFS daemon is running on both compute node and client
2. Check for network connectivity between nodes
3. Verify you have enough disk space for pinning

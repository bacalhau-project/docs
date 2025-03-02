# Mounting Input Data

## Mounting Input Data

This page explains how to feed external data into Bacalhau jobs from various sources. Bacalhau's modular architecture enables flexible data mounting from multiple storage providers, with S3-compatible storage, local directories, IPFS, and HTTP/HTTPS URLs supported out of the box.

### What You'll Learn

* How to mount data from different sources to your Bacalhau jobs
* The syntax and options for each data source type
* Best practices for efficient data handling

### Input Mounting Basics

Bacalhau jobs often need access to input data. The general syntax for mounting input data is:

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --input <URI><SOURCE>:<TARGET> \
  IMAGE -- COMMAND
```

Where:

* `URI` is the protocol identifier (file://, s3://, ipfs://, http://, https://)
* `SOURCE` specifies the path to the data
* `TARGET` is the path where the data will be mounted in the container

This pattern is consistent across all input types, making it easy to understand and use regardless of the data source.
{% endtab %}

{% tab title="Declarative" %}
```yaml
...
InputSources:
  - Alias: input
    Target: <TARGET>
    Source:
      Type: <URI>
      Params:
        key: value
```

Where:

* `URI` is the protocol identifier (file://, s3://, ipfs://, http://, https://)
* `TARGET` is the path where the data will be mounted in the container
* PARAMS are key value configuration depending on the input type
{% endtab %}
{% endtabs %}



### Local Directories

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --input file:///path/to/local/data:/data \
  ubuntu:latest -- cat /data/input.txt
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: "task1"
    Engine:
      Type: "docker"
      Params:
        Image: "ubuntu:latest"
        Parameters:
          - "cat"
          - "/data/input.txt"
    InputSources:
      - Alias: input_data
        Target: /data
        Source:
          Type: local
          Params:
            Path: /path/to/local/data
```
{% endtab %}
{% endtabs %}

This mounts the directory `/path/to/local/data` from the host machine to `/data` inside the container.



### S3-Compatible Storage

S3 integration connects to storage solutions compatible with the S3 API, such as AWS S3, Google Cloud Storage, and locally deployed MinIO

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --input s3://my-bucket/datasets/sample.csv:/data/sample.csv \
  ubuntu:latest -- cat /data/sample.csv
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: "task1"
    Engine:
      Type: "docker"
      Params:
        Image: "ubuntu:latest"
        Parameters:
          - "cat"
          - "/data/sample.csv"
    InputSources:
      - Alias: input_data
        Target: /data/sample.csv
        Source:
          Type: s3
          Params:
            Bucket: my-bucket
            Key: datasets/sample.csv
```
{% endtab %}
{% endtabs %}

This downloads and mounts the S3 object to the specified path in the container.



### HTTP/HTTPS URLs

URL-based inputs provide access to web-hosted resources.

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --input https://example.com/data.csv:/data/data.csv \
  ubuntu:latest -- head -n 10 /data/data.csv
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: "task1"
    Engine:
      Type: "docker"
      Params:
        Image: "ubuntu:latest"
        Parameters:
          - head
          - -n
          - "10"
          - /data/data.csv
    InputSources:
      - Alias: input_data
        Target: /data/data.csv
        Source:
          Type: urlDownload
          Params:
            URL: https://example.com/data.csv
```
{% endtab %}
{% endtabs %}



### IPFS (InterPlanetary File System)

IPFS provides content-addressable, peer-to-peer storage for decentralized data sharing.

{% tabs %}
{% tab title="Imperative" %}
```bash
bacalhau docker run \
  --input ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx:/data \
  ubuntu:latest -- cat /data/file.txt
```
{% endtab %}

{% tab title="Declarative" %}
```yaml
Type: batch
Count: 1
Tasks:
  - Name: "task1"
    Engine:
      Type: "docker"
      Params:
        Image: "ubuntu:latest"
        Parameters:
          - cat
          - /data/file.txt
    InputSources:
      - Alias: input_data
        Target: /data
        Source:
          Type: ipfs
          Params:
            CID: QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx
```
{% endtab %}
{% endtabs %}

The IPFS CID (Content Identifier) points to the specific content you want to mount.



### Multiple Inputs

You can combine multiple inputs from different sources in a single job:

```bash
bacalhau docker run \
  --input file:///path/to/config:/config \
  --input s3://my-bucket/datasets/data.csv:/data/data.csv \
  --input https://example.com/reference.json:/data/reference.json \
  python:3.9 -- python /config/process.py
```

### Working with Large Datasets

For very large datasets, consider these optimization strategies:

```bash
bacalhau docker run \
  --cpu 4 \
  --memory 8GB \
  --disk 100GB \
  --input s3://big-data-bucket/huge-dataset/:/data/ \
  python:3.9 -- python process_big_data.py
```

Best practices:

* Increase resource allocations as needed
* Use data locality to minimize transfer costs
* Process data in chunks when possible
* Choose efficient data formats (Parquet, Arrow, etc.)

### Tips & Caveats

* **Credentials**: Some mount sources (S3) require proper credentials or connectivity
* **Data Locality**: Use Bacalhau label selectors to run jobs on nodes that have or close to the data
* **IPFS Network**: Compute nodes must be connected to an IPFS daemon to support this storage type
* **Size Limits**: Very large inputs may require increased disk allocations using `--disk`

### Next Steps

* Learn how to retrieve and publish outputs from jobs
* See a complete example workflow that includes input data
* Explore resource constraints for jobs with large data processing needs

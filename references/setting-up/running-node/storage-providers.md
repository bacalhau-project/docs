# Configuring Your Input Sources

Bacalhau has two ways to make use of external storage providers: Sources and Publishers. **Sources** are storage resources consumed as inputs to jobs. And **Publishers** are storage resources created with the results of jobs.

## Sources

{% tabs %}
{% tab title="S3" %}
Bacalhau allows you to use S3 or any S3-compatible storage service as an input source. Users can specify files or entire prefixes stored in S3 buckets to be fetched and mounted directly into the job execution environment. This capability ensures that your jobs have immediate access to the necessary data. See the [S3 source specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/sources/s3) for more details.

To use the S3 source, you will have to specify the mandatory name of the S3 bucket and the optional parameters Key, Filter, Region, Endpoint, VersionID and ChechsumSHA256.

Below is an example of how to define an S3 input source in YAML format:

```
InputSources:
  - Source:
      Type: "s3"
      Params:
        Bucket: "my-bucket"
        Key: "data/"
        Endpoint: "https://s3.us-west-2.amazonaws.com"
        ChecksumSHA256: "e3b0c44b542b..."
  - Target: "/data"
```
{% endtab %}

{% tab title="IPFS" %}
To start, you'll need to connect the Bacalhau node to an IPFS server so that you can run jobs that consume CIDs as inputs. You can either [install IPFS](https://docs.ipfs.tech/install/) and run it locally, or you can connect to a remote IPFS server.

In both cases, you should have an [IPFS multiaddress](https://richardschneider.github.io/net-ipfs-core/articles/multiaddress.html) for the IPFS server that should look something like this:

```
export IPFS_CONNECT=/ip4/10.1.10.10/tcp/80/p2p/QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC
```

{% hint style="warning" %}
The multiaddress above is just an example - you'll need to get the multiaddress of the IPFS server you want to connect to.
{% endhint %}

You can then configure your Bacalhau node to use this IPFS server by adding the address to the `InputSources.Types.IPFS.Endpoint` configuration key:

```bash
bacalhau config set InputSources.Types.IPFS.Endpoint=/ip4/10.1.10.10/tcp/80/p2p/QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC
```

See the [IPFS input source specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/sources/ipfs) for more details.

Below is an example of how to define an IPFS input source in YAML format:

```
InputSources:
  - Source:
      Type: "ipfs"
      Params:
        CID: "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjY3fZ"
  - Target: "/data"
```
{% endtab %}

{% tab title="Local" %}
The Local input source allows Bacalhau jobs to access files and directories that are already present on the compute node. This is especially useful for utilizing locally stored datasets, configuration files, logs, or other necessary resources without the need to fetch them from a remote source, ensuring faster job initialization and execution. See the [Local source specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/sources/local) for more details.

To use a local data source, you will have to:

1. Enable the use of local data when configuring the node itself by using the `Compute.AllowListedLocalPaths` configuration key, specifying the file path and access mode. For example

```
bacalhau config set Compute.AllowListedLocalPaths="/etc/config:rw,/etc/*.conf:ro".
```

2. In the job description specify parameters **SourcePath** - the absolute path on the compute node where your data is located and **ReadWrite** - the access mode.

Below is an example of how to define a Local input source in YAML format:

```
InputSources:
  - Source:
      Type: "localDirectory"
      Params:
        SourcePath: "/etc/config"
        ReadWrite: true
    Target: "/config"
```
{% endtab %}

{% tab title="URL" %}
The URL Input Source provides a straightforward method for Bacalhau jobs to access and incorporate data available over HTTP/HTTPS. By specifying a URL, users can ensure the required data, whether a single file or a web page content, is retrieved and prepared in the job's execution environment, enabling direct and efficient data utilization. See the [URL source specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/sources/url) for more details.

To use a URL data source, you will have to specify only URL parameter, as in the part of the declarative job description below:

```
InputSources:
  - Source:
      Type: "urlDownload"
      Params:
        URL: "https://example.com/data/file.txt"
    Target: "/data"
```
{% endtab %}
{% endtabs %}

## Publishers

{% tabs %}
{% tab title="S3" %}
Bacalhau's S3 Publisher provides users with a secure and efficient method to publish job results to any S3-compatible storage service. To use an S3 publisher you will have to specify required parameters **Bucket** and **Key** and optional parameters Region, Endpoint, VersionID, ChecksumSHA256. See the [S3 publisher specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/publishers/s3) for more details.

Here’s an example of the part of the declarative job description that outlines the process of using the S3 Publisher with Bacalhau:

```
Publisher:
  Type: "s3"
  Params:
    Bucket: "my-task-results"
    Key: "task123/result.tar.gz"
    Endpoint: "https://s3.us-west-2.amazonaws.com"
```
{% endtab %}

{% tab title="IPFS" %}
The IPFS publisher works using the same setup as [above](storage-providers.md#ipfs) - you'll need to have an IPFS server running and a multiaddress for it. Then you'll configure that multiaddress using the `InputSources.Types.IPFS.Endpoint` configuration key. Then you can use `bacalhau job get <job-ID>` with no further arguments to download the results.

To use the IPFS publisher you will have to specify **CID** which can be used to access the published content. See the [IPFS publisher specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/publishers/ipfs) for more details.

And part of the declarative job description with an IPFS publisher will look like this:

```
Publisher:
  Type: ipfs
PublishedResult:
  Type: ipfs
  Params:
    CID: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
```
{% endtab %}

{% tab title="Local" %}
{% hint style="warning" %}
The Local Publisher should not be used for Production use as it is not a reliable storage option. For production use, we recommend using a more reliable option such as an S3-compatible storage service.
{% endhint %}

Another possibility to store the results of a job execution is on a compute node. In such case the results will be published to the local compute node, and stored as compressed tar file, which can be accessed and retrieved over HTTP from the command line using the get command. To use the Local publisher you will have to specify the only **URL** parameter with a HTTP URL to the location where you would like to save the result. See the [Local publisher specification](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/publishers/local) for more details.

Here is an example of part of the declarative job description with a local publisher:

```
Publisher:
    Type: local
PublishedResult:
  Type: local
  Params:
    URL: "http://192.168.0.11:6001/e-c4b80d04-ff2b-49d6-9b99-d3a8e669a6bf.tgz"
```
{% endtab %}
{% endtabs %}

# Connect Storage

Bacalhau has two ways to make use of external storage providers: Sources and Publishers. **Sources** storage resources consumed as inputs to jobs. And **Publishers** storage resources created with the results of jobs.

## [​](http://localhost:3000/setting-up/running-node/storage-providers#sources)Sources <a href="#sources" id="sources"></a>

### S3[​](http://localhost:3000/setting-up/running-node/storage-providers#s3) <a href="#s3" id="s3"></a>

Bacalhau allows you to use S3 or any S3-compatible storage service as an input source. Users can specify files or entire prefixes stored in S3 buckets to be fetched and mounted directly into the job execution environment. This capability ensures that your jobs have immediate access to the necessary data. See the [S3 source specification](../../references/other-specifications/sources/s3.md) for more details.

To use the S3 source, you will have to to specify the mandatory name of the S3 bucket and the optional parameters Key, Filter, Region, Endpoint, VersionID and ChechsumSHA256.

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

### IPFS[​](http://localhost:3000/setting-up/running-node/storage-providers#ipfs) <a href="#ipfs" id="ipfs"></a>

To start, you'll need to connect the Bacalhau node to an IPFS server so that you can run jobs that consume CIDs as inputs. You can either [install IPFS](https://docs.ipfs.tech/install/) and run it locally, or you can connect to a remote IPFS server.

In both cases, you should have an [IPFS multiaddress](https://richardschneider.github.io/net-ipfs-core/articles/multiaddress.html) for the IPFS server that should look something like this:

```
export IPFS_CONNECT=/ip4/10.1.10.10/tcp/80/p2p/QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC
```

{% hint style="warning" %}
The multiaddress above is just an example - you'll need to get the multiaddress of the IPFS server you want to connect to.
{% endhint %}



You can then configure your Bacalhau node to use this IPFS server by passing the `--ipfs-connect` argument to the `serve` command:

```
bacalhau serve --ipfs-connect $IPFS_CONNECT
```

Or, set the `Node.IPFS.Connect` property in the Bacalhau configuration file. See the [IPFS input source specification](../../references/other-specifications/sources/ipfs.md) for more details.

Below is an example of how to define an IPFS input source in YAML format:

```
InputSources:
  - Source:
      Type: "ipfs"
      Params:
        CID: "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjY3fZ"
  - Target: "/data"
```

### Local[​](http://localhost:3000/setting-up/running-node/storage-providers#local) <a href="#local" id="local"></a>

The Local input source allows Bacalhau jobs to access files and directories that are already present on the compute node. This is especially useful for utilizing locally stored datasets, configuration files, logs, or other necessary resources without the need to fetch them from a remote source, ensuring faster job initialization and execution. See the [Local source specification](../../references/other-specifications/sources/local.md) for more details.

To use a local data source, you will have to to:

1. Enable the use of local data when configuring the node itself by using the `--allow-listed-local-paths` flag for bacalhau serve, specifying the file path and access mode. For example

```
bacalhau serve --allow-listed-local-paths "/etc/config:rw,/etc/*.conf:ro".
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

### URL[​](http://localhost:3000/setting-up/running-node/storage-providers#url) <a href="#url" id="url"></a>

The URL Input Source provides a straightforward method for Bacalhau jobs to access and incorporate data available over HTTP/HTTPS. By specifying a URL, users can ensure the required data, whether a single file or a web page content, is retrieved and prepared in the job's execution environment, enabling direct and efficient data utilization. See the [URL source specification](../../references/other-specifications/sources/url.md) for more details.

To use a URL data source, you will have to to specify only URL parameter, as in the part of the declarative job description below:

```
InputSources:
  - Source:
      Type: "urlDownload"
      Params:
        URL: "https://example.com/data/file.txt"
    Target: "/data"
```

## Publishers[​](http://localhost:3000/setting-up/running-node/storage-providers#publishers) <a href="#publishers" id="publishers"></a>

### S3[​](http://localhost:3000/setting-up/running-node/storage-providers#s3-1) <a href="#s3-1" id="s3-1"></a>

Bacalhau's S3 Publisher provides users with a secure and efficient method to publish job results to any S3-compatible storage service. To use an S3 publisher you will have to specify required parameters **Bucket** and **Key** and optional parameters Region, Endpoint, VersionID, ChecksumSHA256. See the [S3 publisher specification](../../references/other-specifications/publishers/s3.md) for more details.

Here’s an example of the part of the declarative job description that outlines the process of using the S3 Publisher with Bacalhau:

```
Publisher:
  Type: "s3"
  Params:
    Bucket: "my-task-results"
    Key: "task123/result.tar.gz"
    Endpoint: "https://s3.us-west-2.amazonaws.com"
```

### IPFS[​](http://localhost:3000/setting-up/running-node/storage-providers#ipfs-1) <a href="#ipfs-1" id="ipfs-1"></a>

The IPFS publisher works using the same setup as [above](storage-providers.md#ipfs) - you'll need to have an IPFS server running and a multiaddress for it. Then you'll pass that multiaddress using the `--ipfs-connect` argument to the `serve` command. If you are publishing to a public IPFS node, you can use `bacalhau job get` with no further arguments to download the results. However, you may experience a delay in results becoming available as indexing of new data by public nodes takes time.

To use the IPFS publisher you will have to specify **CID** which can be used to access the published content. See the [IPFS publisher specification](../../references/other-specifications/publishers/ipfs.md) for more details.

To speed up the download or to retrieve results from a private IPFS node, pass the swarm multiaddress to `bacalhau job get` to download results.

```
# Set the below environment variable, use the --ipfs-swarm-addrs flag,
# or set the Node.IPFS.SwarmAddresses config property.
export BACALHAU_IPFS_SWARM_ADDRESSES=/ip4/.../tcp/5001/p2p/Qmy...

bacalhau job get $JOB_ID
```

Pass the swarm key to `bacalhau job get` if the IPFS swarm is a private swarm.

<pre><code># Set the below environment variable, use the --ipfs-swarm-key flag,
# or set the Node.IPFS.SwarmKeyPath config property.
<strong>export BACALHAU_IPFS_SWARM_KEY=./path/to/swarm.key
</strong>
bacalhau job get $JOB_ID
</code></pre>

And part of the declarative job description with an IPFS publisher will look like this:

```
Publisher:
  Type: ipfs
PublishedResult:
  Type: ipfs
  Params:
    CID: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
```

### Local[​](http://localhost:3000/setting-up/running-node/storage-providers#local-1) <a href="#local-1" id="local-1"></a>

{% hint style="warning" %}
The Local Publisher should not be used for Production use as it is not a reliable storage option. For production use, we recommend using a more reliable option such as an S3-compatible storage service.
{% endhint %}

Another possibility to store the results of a job execution is on a compute node. In such case the results will be published to the local compute node, and stored as compressed tar file, which can be accessed and retrieved over HTTP from the command line using the get command. To use the Local publisher you will have to specify the only **URL** parameter with a HTTP URL to the location where you would like to save the result. See the [Local publisher specification](../../references/other-specifications/publishers/local.md) for more details.

Here is an example of part of the declarative job description with a local publisher:

```
Publisher:
    Type: local
PublishedResult:
  Type: local
  Params:
    URL: "http://192.168.0.11:6001/e-c4b80d04-ff2b-49d6-9b99-d3a8e669a6bf.tgz"
```

---
cover: .gitbook/assets/bacalhau_banner_high_resolution.png
coverY: 0
---

# Welcome to Bacalhau Docs

{% hint style="warning" %}
This is an older version of Bacalhau. For the latest version, go to [this link](https://docs.bacalhau.org/).
{% endhint %}

## What is Bacalhau?

Bacalhau is a platform for fast, cost efficient, and secure computation by running jobs where the data is generated and stored. With Bacalhau, you can streamline your existing workflows without the need of extensive rewriting by running arbitrary Docker containers and WebAssembly (wasm) images as tasks. This architecture is also referred to as **Compute Over Data** (or CoD). [_Bacalhau_](https://translate.google.com/?sl=pt\&tl=en\&text=bacalhau\&op=translate) _was coined from the Portuguese word for salted Cod fish_.

Bacalhau seeks to transform data processing for large-scale datasets to improve cost and efficiency, and to open up data processing to larger audiences. Our goals is to create an open, collaborative compute ecosystem that enables unparalleled collaboration. We ([Expanso.io](https://expanso.io)) offer a demo network so you can try out jobs without even installing. Give it a shot!

### Why Bacalhau?

⚡️ Bacalhau simplifies the process of managing compute jobs by providing a **unified platform** for managing jobs across different regions, clouds, and edge devices.

🤝 Bacalhau provides **reliable and network-partition** resistant orchestration, ensuring that your jobs will complete even if there are network disruptions.

🚨 Bacalhau provides a **complete and permanent audit log** of exactly what happened, so you can be confident that your jobs are being executed securely.

🔐 You can run private workloads to **reduce the chance of leaking private information** or inadvertently sharing your data outside of your organization.

💸 Bacalhau **reduces ingress/egress costs** since jobs are processed closer to the source.

🤓 You can [mount your data anywhere](./#data-ingestion) on your machine, and Bacalhau will be able to run against that data.

💥 You can integrate with services running on nodes to run a jobs, such as on [DuckDB](examples/data-engineering/index.md).

📚 Bacalhau operates at scale over parallel jobs. You can batch process petabytes (quadrillion bytes) of data.

### How it works

Bacalhau concists of a peer-to-peer network of nodes that enables decentralized communication between computers. The network consists of two types of nodes:

**Requester Node:** responsible for handling user requests, discovering and ranking compute nodes, forwarding jobs to compute nodes, and monitoring the job lifecycle.

**Compute Node:** responsible for executing jobs and producing results. Different compute nodes can be used for different types of jobs, depending on their capabilities and resources.

{% hint style="info" %}
For a more detailed tutorial, check out our [Getting Started Tutorial](broken-reference).
{% endhint %}

The goal of the Bacalhau project is to make it easy to perform distributed computation next to where the data resides. In order to do this, first you need to ingest some data.

#### Data ingestion

Data is identified by its content identifier (CID) and can be accessed by anyone who knows the CID. Here are some options that can help you mount your data:

* [Copy data from a URL to public storage](setting-up/data-ingestion/from-url.md)
* [Pin Data to public storage](setting-up/data-ingestion/pin.md)
* [Copy Data from S3 Bucket to public storage](setting-up/data-ingestion/s3.md)

{% hint style="info" %}
The options are not limited to the above mentioned. You can mount your data anywhere on your machine, and Bacalhau will be able to run against that data
{% endhint %}

#### Security in Bacalhau

All workloads run under restricted Docker or WASM permissions on the node. Additionally, you can use existing (locked down) binaries that are pre-installed through Pluggable Executors.

Best practices in [12-factor apps](https://12factor.net/) is to use environment variables to store sensitive data such as access tokens, API keys, or passwords. These variables can be accessed by Bacalhau at runtime and are not visible to anyone who has access to the code or the server.

Alternatively, you can pre-provision credentials to the nodes and access those on a node by node basis.

Finally, endpoints (such as vaults) can also be used to provide secure access to Bacalhau. This way, the client can authenticate with Bacalhau using the token without exposing their credentials.

#### Workloads Bacalhau is best suited for

Bacalhau can be used for a variety of data processing workloads, including machine learning, data analytics, and scientific computing. It is well-suited for workloads that require processing large amounts of data in a distributed and parallelized manner.

#### Use Cases

Once you have more than 10 devices generating or storing around 100GB of data, you're likely to face challenges with processing that data efficiently. Traditional computing approaches may struggle to handle such large volumes, and that's where distributed computing solutions like Bacalhau can be extremely useful. Bacalhau can be used in various industries, including security, web serving, financial services, IoT, Edge, Fog, and multi-cloud. Bacalhau shines when it comes to data-intensive applications like [data engineering](examples/data-engineering/), [model training](examples/model-training/), [model inference](examples/model-inference/), [molecular dynamics](examples/molecular-dynamics/), etc.

Here are some example tutorials on how you can process your data with Bacalhau:

* [Stable Diffusion AI](examples/model-inference/index-3.md)
* [Generate Realistic Images using StyleGAN3 and Bacalhau](examples/model-inference/index-6.md)
* [Object Detection with YOLOv5 on Bacalhau](examples/model-inference/index-5.md)
* [Running Genomics on Bacalhau](examples/molecular-dynamics/index-3.md)
* [Training Pytorch Model with Bacalhau](examples/model-training/index.md)

{% hint style="info" %}
For more tutorials, visit our [example page](broken-reference)
{% endhint %}

### Community

Bacalhau has a very friendly community and we are always happy to help you get started:

* [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions) – ask anything about the project, give feedback or answer questions that will help other users.
* [Join the Slack Community](https://bit.ly/bacalhau-project-slack) and go to **#bacalhau** channel – it is the easiest way engage with other members in the community and get help.
* [Contributing](community/ways-to-contribute.md) – learn how to contribute to the Bacalhau project.

### Next Steps

👉 Continue with Bacalhau [Getting Started guide](broken-reference) to learn how to install and run a job with the Bacalhau client.

👉 Or jump directly to try out the different [Examples](broken-reference) that showcases Bacalhau abilities.

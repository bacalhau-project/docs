---
icon: hand-wave
description: Welcome to the Bacalhau documentation!
cover: .gitbook/assets/bacalhau_banner_high_resolution.png
coverY: 0
---

# Welcome

## What is Bacalhau?

Bacalhau is a platform designed for fast, cost-efficient, and secure computation by running jobs directly where the data is generated and stored. Bacalhau helps you streamline existing workflows without extensive rewriting, as it allows you to run arbitrary Docker containers and WebAssembly (WASM) images as tasks. This approach is also known as **Compute Over Data** (or CoD). The name [_Bacalhau_](https://translate.google.com/?sl=pt\&tl=en\&text=bacalhau\&op=translate) comes from the Portuguese word for salted cod fish.

Bacalhau aims to revolutionize data processing for large-scale datasets by enhancing cost-efficiency and accessibility, making data processing available to a broader audience. Our goal is to build an open, collaborative compute ecosystem that fosters unmatched collaboration. At ([Expanso.io](https://expanso.io)), we offer a demo network where you can try running jobs without any installation. Give it a try!

### Why Bacalhau?

{% tabs %}
{% tab title="Data Scientists" %}
* [x] **Scalability and Flexibility**:
  * You can run large-scale computations without relying on a single cloud provider, enhancing flexibility and potentially reducing costs.
  * Bacalhau enables distributed data processing, which can significantly speed up analysis and model training by parallelizing tasks across multiple nodes.
* [x] **Data Privacy and Security**:
  * Bacalhau allows data to be processed close to its source, which can help maintain data privacy and comply with regulatory requirements.
* [x] **Cost Efficiency**:
  * Utilize Bacalhau’s platform to dynamically allocate resources, ensuring optimal performance while controlling costs.
{% endtab %}

{% tab title="DevOps/MLOps" %}
* [x] **Automation and Orchestration**:
  * **Seamless Integration**: Bacalhau can be integrated into CI/CD pipelines, enabling automated deployment and scaling of machine learning models and other applications.
  * **Workload Scheduling**: Efficiently schedule and manage workloads across a decentralized network, improving resource utilization and reliability.
* [x] **Fault Tolerance**:
  * Decentralized infrastructure ensures high availability and resilience against failures, reducing downtime for critical applications.
* [x] **Cost Management**:
  * Utilize Bacalhau’s platform to dynamically allocate resources, ensuring optimal performance while controlling costs.
{% endtab %}

{% tab title="IT Operations" %}
* [x] **Infrastructure Efficiency**:
  * Efficiently utilize idle or underutilized compute resources within an organization, maximizing hardware investments.
* [x] **Simplified Management**:
  * Manage heterogeneous compute resources through a single platform, simplifying administrative tasks and reducing complexity.
* [x] **Cost Reduction**:
  * Bacalhau’s can help drive down your compute costs by up to 72.5% for deploying your ML models and over 90% for your log processing spend.
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Bacalhau simplifies the process of managing compute jobs by providing a **unified platform** for managing jobs across different regions, clouds, and edge devices.
{% endhint %}

### How it works

Bacalhau consists of a network of nodes that enables orchestration between every compute resource, no matter whether it is a Cloud VM, an On-premise server, or Edge devices. The network consists of two types of nodes:

**Requester Node:** responsible for handling user requests, discovering and ranking compute nodes, forwarding jobs to compute nodes, and monitoring the job lifecycle.

**Compute Node:** responsible for executing jobs and producing results. Different compute nodes can be used for different types of jobs, depending on their capabilities and resources.

{% hint style="info" %}
For a more detailed tutorial, check out our [Getting Started Tutorial](broken-reference/).
{% endhint %}

#### Data ingestion

Data is identified by its content identifier (CID) and can be accessed by anyone who knows the CID. Here are some options that can help you mount your data:

* [Copy data from a URL to public storage](examples/data-ingestion/from-url.md)
* [Pin Data to public storage](examples/data-ingestion/pin.md)
* [Copy Data from S3 Bucket to public storage](examples/data-ingestion/s3.md)

{% hint style="info" %}
The options are not limited to the above-mentioned. You can mount your data anywhere on your machine, and Bacalhau will be able to run against that data
{% endhint %}

#### Security in Bacalhau

All workloads run under restricted Docker or WASM permissions on the node. Additionally, you can use existing (locked down) binaries that are pre-installed through Pluggable Executors.

The best practice in [12-factor apps](https://12factor.net/) is to use environment variables to store sensitive data such as access tokens, API keys, or passwords. These variables can be accessed by Bacalhau at runtime and are not visible to anyone who has access to the code or the server. Alternatively, you can pre-provision credentials to the nodes and access those on a node-by-node basis.

Finally, endpoints (such as vaults) can also be used to provide secure access to Bacalhau. This way, the client can authenticate with Bacalhau using the token without exposing their credentials.

### Use Cases

Bacalhau can be used for a variety of data processing workloads, including machine learning, data analytics, and scientific computing. It is well-suited for workloads that require processing large amounts of data in a distributed and parallelized manner.

Once you have more than 10 devices generating or storing around 100GB of data, you're likely to face challenges with processing that data efficiently. Traditional computing approaches may struggle to handle such large volumes, and that's where distributed computing solutions like Bacalhau can be extremely useful. Bacalhau can be used in various industries, including security, web serving, financial services, IoT, Edge, Fog, and multi-cloud. Bacalhau shines when it comes to data-intensive applications like [data engineering](examples/data-engineering/), [model training](examples/model-training/), [model inference](examples/model-inference/), [molecular dynamics](examples/molecular-dynamics/), etc.

{% embed url="https://www.youtube.com/watch?ab_channel=Expanso&t=7s&v=R5s9cZg5DOM" %}
An example on how to build your own ETL pipeline with Bacalhau and MongoDB.
{% endembed %}

Here are some example tutorials on how you can process your data with Bacalhau:

* [Stable Diffusion AI](examples/model-inference/stable-diffusion-checkpoint-inference.md) training and deployment with Bacalhau.
* [Generate Realistic Images using StyleGAN3 and Bacalhau](examples/model-inference/generate-realistic-images-using-stylegan3-and-bacalhau.md).
* [Object Detection with YOLOv5 on Bacalhau](examples/model-inference/object-detection-with-yolov5-on-bacalhau.md).
* [Running Genomics on Bacalhau](examples/molecular-dynamics/genomics-data-generation.md).
* [Training Pytorch Model with Bacalhau](examples/model-training/training-pytorch-model-with-bacalhau.md).

{% hint style="info" %}
For more tutorials, visit our [example page](broken-reference/)
{% endhint %}

### Community

Bacalhau has a very friendly community and we are always happy to help you get started:

* [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions) – ask anything about the project, give feedback, or answer questions that will help other users.
* [Join the Slack Community](https://bit.ly/bacalhau-project-slack) and go to **#bacalhau** channel – it is the easiest way to engage with other members in the community and get help.
* [Contributing](community/ways-to-contribute.md) – learn how to contribute to the Bacalhau project.

### Next Steps

👉 Continue with Bacalhau's [Getting Started guide](broken-reference/) to learn how to install and run a job with the Bacalhau client.

👉 Or jump directly to try out the different [Examples](broken-reference/) that showcase Bacalhau's abilities.

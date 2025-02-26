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



### Use Cases

Bacalhau can be used for a variety of data processing workloads, including machine learning, data analytics, and scientific computing. It is well-suited for workloads that require processing large amounts of data in a distributed and parallelized manner.

Once you have more than 10 devices generating or storing around 100GB of data, you're likely to face challenges with processing that data efficiently. Traditional computing approaches may struggle to handle such large volumes, and that's where distributed computing solutions like Bacalhau can be extremely useful. Bacalhau can be used in various industries, including security, web serving, financial services, IoT, Edge, Fog, and multi-cloud. Bacalhau shines when it comes to data-intensive applications like data engineering, model training, model inference, molecular dynamics, etc.

{% embed url="https://www.youtube.com/watch?ab_channel=Expanso&t=7s&v=R5s9cZg5DOM" %}
An example on how to build your own ETL pipeline with Bacalhau and MongoDB.
{% endembed %}

### Community

Bacalhau has a very friendly community and we are always happy to help you get started:

* [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions) – ask anything about the project, give feedback, or answer questions that will help other users.
* [Join the Slack Community](https://bit.ly/bacalhau-project-slack) and go to **#bacalhau** channel – it is the easiest way to engage with other members in the community and get help.
* [Contributing](broken-reference) – learn how to contribute to the Bacalhau project.

### Next Steps

👉 Continue with Bacalhau's [Getting Started guide](getting-started/installation/) to learn how to install and run a job with the Bacalhau client.

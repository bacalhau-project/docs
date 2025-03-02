# What is Bacalhau?

Bacalhau is an open-source distributed compute orchestration framework designed to bring compute to the data. Instead of moving large datasets around networks, Bacalhau makes it easy to execute jobs close to the data's location, drastically reducing latency and resource overhead.

### Why It Matters

* **High Scalability**: As your data grows, Bacalhau's architecture supports adding more compute nodes on demand—whether on-premises or in the cloud.
* **Global Network Reach**: Deploy networks that span regions, datacenters, cloud providers, and on-premises infrastructure—all working together seamlessly.
* **Resilient Operation**: Nodes continue to operate even during network partitioning or isolation, maintaining service availability under challenging conditions.
* **Resource Efficiency**: By minimizing data transfers, Bacalhau saves bandwidth costs and ensures jobs run faster.
* **Ease of Integration**: Bacalhau works with existing container images (Docker, etc.), meaning you can leverage your current workflows and tools without major rewrites.
* **Supports Various Use Cases**: Ideal for big data analytics, machine learning, edge computing, and more—where distributed processing is key.

### Key Features

1. **Single Binary Simplicity**: Bacalhau is a single self-contained binary that functions as a client, orchestrator, and compute node—making it incredibly easy to set up and scale your own distributed compute network.
2. **Modular Architecture**: Bacalhau's modular design supports multiple execution engines (Docker, WebAssembly) and storage providers through clean interfaces, allowing for easy extension.
3. **Orchestrator-Compute Model**: A dedicated orchestrator coordinates job scheduling, while compute nodes run tasks—all from the same binary with different runtime modes.
4. **Flexible Storage Integrations**: Bacalhau integrates with S3, HTTP/HTTPS, and other storage systems, letting you pull data from various sources.
5. **Multiple Job Types**: Support for batch, ops, daemon, and service job types to accommodate different workflow requirements.
6. **Declarative & Imperative Submissions**: Define jobs in a YAML spec (declarative) or pass all arguments via CLI (imperative).
7. **Publisher Support**: Output results to local volumes, S3, or other storage backends—so your artifacts are readily accessible.



### Community

Bacalhau has a very friendly community and we are always happy to help you get started:

* [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions) – ask anything about the project, give feedback, or answer questions that will help other users.
* [Join the Slack Community](https://bit.ly/bacalhau-project-slack) and go to **#bacalhau** channel – it is the easiest way to engage with other members in the community and get help.
* [Contributing](./#community) – learn how to contribute to the Bacalhau project.

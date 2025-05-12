# What is Bacalhau?

Bacalhau is an open-source distributed compute orchestration framework designed to bring compute to the data. Instead of moving large datasets around networks, Bacalhau makes it easy to execute jobs close to the data's location, drastically reducing latency and resource overhead.

### Why It Matters

* **Highly Distributed Architecture**: Deploy compute networks that span regions, cloud providers, and on-premises datacenters—all working together as a unified system.
* **Resilient Operation**: Compute nodes operate effectively even with intermittent connectivity to orchestrators, maintaining service availability during network partitioning or isolation.
* **Data Sovereignty & Security**: Process sensitive data within security boundaries without requiring it to leave your premises, enabling computation while preserving data control.
* **Cross-Organizational Computation**: Allow specific vetted computations on protected datasets without exposing raw data, breaking data silos between organizations.
* **Resource Efficiency**: By minimizing data transfers, Bacalhau saves bandwidth costs and ensures jobs run faster.
* **High Scalability**: As your data and processing needs grow, simply add more compute nodes on demand—whether on-premises or in the cloud.
* **Ease of Integration**: Bacalhau works with existing container images (Docker, etc.), meaning you can leverage your current workflows without major rewrites.

### Key Features

1. **Single Binary Simplicity**: Bacalhau is a single self-contained binary that functions as a client, orchestrator, and compute node—making it incredibly easy to set up and scale your distributed compute network.
2. **Modular Architecture**: Bacalhau's design supports multiple execution engines (Docker, WebAssembly) and storage providers through clean interfaces, allowing for easy extension.
3. **Orchestrator-Compute Model**: A dedicated orchestrator coordinates job scheduling, while compute nodes run tasks—all from the same binary with different runtime modes.
4. **Flexible Storage Integrations**: Bacalhau integrates with S3, HTTP/HTTPS, and other storage systems, letting you pull data from various sources.
5. **Multiple Job Types**: Support for batch, ops, daemon, and service job types to accommodate different workflow requirements.
6. **Declarative & Imperative Submissions**: Define jobs in a YAML spec (declarative) or pass all arguments via CLI (imperative).
7. **Publisher Support**: Output results to local volumes, S3, or other storage backends—so your artifacts are readily accessible.

### Use Cases

Bacalhau's distributed compute framework enables a wide range of applications across different industries:

<details>

<summary>Log Processing</summary>

Process logs efficiently at scale by running distributed jobs directly at the source, reducing costs by up to 93% in bandwidth usage while improving real-time insights. Bacalhau supports various job types for log management:

* **Daemon Jobs**: Continuously run on each node for real-time log aggregation and compression
* **Service Jobs**: Handle ongoing processing tasks like log aggregation and issue detection
* **Batch Jobs**: Execute on-demand in-depth analysis of historical log data
* **Ops Jobs**: Enable real-time querying of live logs for urgent investigations

</details>

<details>

<summary>Distributed Data Warehousing</summary>

Query and analyze data across multiple regions by deploying compute tasks directly where your data resides. This approach reduces latency, enhances performance, and ensures compliance with data sovereignty regulations. Bacalhau integrates with modern data tools like Apache Iceberg and DuckDB to enable:

* Reduced data movement with local query execution
* Improved query performance through compute-data proximity
* Seamless scalability with dynamic node addition
* Compliance with data regulations through region-specific processing

</details>

<details>

<summary>Fleet Management</summary>

Efficiently manage distributed nodes across multiple environments with capabilities for:

* Remote execution of commands without requiring SSH access
* Automated software deployment and configuration updates
* Real-time metrics and logs collection
* Targeted job execution based on node attributes
* Rapid incident response and automated recovery

</details>

<details>

<summary>Distributed Machine Learning</summary>

Train and deploy ML models across a distributed compute fleet, optimizing performance while keeping data in place:

* Distribute training across multiple machines to handle larger models
* Process data locally to minimize network transfers
* Deploy inference jobs near users for low-latency predictions
* Support federated learning for privacy-sensitive applications

</details>

<details>

<summary>Edge Computing</summary>

Run compute tasks closer to the data source for applications requiring low latency and minimal bandwidth usage:

* Process and analyze sensor, IoT, or video data in real time
* Perform pre-processing and filtering at the edge before sending refined data
* Distribute tasks across available edge resources dynamically
* Ensure data privacy by keeping computations near the source

</details>



### How It Works

Bacalhau's architecture enables you to create compute networks that bridge traditional infrastructure boundaries. When you submit a job, Bacalhau intelligently determines which compute nodes are best positioned to process the data based on locality, availability, and your defined constraints—without requiring data movement or constant connectivity.

This approach is particularly valuable for:

* Organizations with data that cannot leave certain security boundaries
* Multi-region operations where data transfer is expensive or impractical
* Scenarios where multiple parties need to collaborate on analysis without sharing raw data
* Edge computing environments with intermittent connectivity

### Community

Bacalhau has a very friendly community and we are always happy to help you get started:

* [Join the Slack Community](https://bit.ly/bacalhau-project-slack) Go to **#bacalhau** channel – it is the easiest way to engage with other members in the community and get help.
* [Contributing](/community/ways-to-contribute) – learn how to contribute to the Bacalhau project.

# Architecture

## Architecture

Bacalhau employs a distributed, node-based architecture to orchestrate compute tasks in a manner that brings compute operations closer to the data. Built around a single self-contained binary that can serve multiple roles, Bacalhau makes it remarkably simple to deploy and scale a distributed compute network. This architecture enables efficient job scheduling, isolation, and flexible storage options.

### High-Level Overview

1. **User Submits a Job**: The user, through the Bacalhau CLI or API, sends a job definition (e.g., Docker image, CPU/memory constraints) to the Orchestrator. Jobs can be submitted in two ways:
   * **Imperative**: `bacalhau docker run ...` with command-line arguments
   * **Declarative**: `bacalhau job run <job-spec>` using a YAML specification file
2. **Orchestrator Schedules Tasks**: Based on resource availability, data location, and job requirements, the Orchestrator assigns tasks to Compute Nodes.
3. **Compute Nodes Execute Tasks**: Each Compute Node pulls the necessary image(s), mounts or fetches input data (local, S3, etc.), and runs the task in an isolated environment (e.g., Docker container).
4. **Results Publication**: Once the task completes, outputs can be published to configured storage (e.g., S3). The Orchestrator updates the job's status accordingly.

All of these components run from the same Bacalhau binary, just in different modes, making deployment remarkably simple.

### Orchestrators

* **Core Role**: Receives job submissions, maintains job state, and coordinates scheduling.
* **NATS Server**: Acts as a NATS.io server instance, providing messaging infrastructure for the system.
* **Scalability**: Environments can have multiple Orchestrator nodes for high availability, though a single Orchestrator is often sufficient for smaller clusters.
* **Communication**: Orchestrators broadcast scheduling decisions and listen for status updates from Compute Nodes.

### Compute Nodes

* **Primary Function**: Execute containerized or WASM-based workloads.
* **NATS Client**: Connects to orchestrators as a NATS client to receive jobs and report status.
* **Resource Management**: Advertise available CPU, memory, GPU, and storage capacity to the Orchestrator.
* **Data Handling**: Fetch or mount input data from local disks, S3, HTTP URLs, or other configured sources. Upon completion, publish results to the designated backend.
* **Isolation & Security**: Tasks typically run in Docker containers, ensuring isolation from other workloads.

### Hybrid Nodes

* **Definition**: A single Bacalhau node serving both Orchestrator and Compute roles.
* **Use Cases**: Primarily suitable for local development, smaller environments, or proof-of-concept testing.
* **Limitations**: Production use cases often benefit from separating Orchestrator and Compute roles for better scalability and fault tolerance.

### Communication Model

* **NATS-based Messaging**: Bacalhau relies on NATS.io for communication:
  * Lightweight, high-performance messaging
  * Orchestrators run as NATS servers
  * Compute nodes connect as NATS clients
* **Global Network Spanning**: The architecture supports networks that span across:
  * Multiple geographic regions
  * Different cloud providers
  * Hybrid cloud/on-premises deployments
  * Edge computing environments
* **Event-Driven State Management**:
  * All system events are stored in local ledgers
  * Events are shared between nodes during normal operation
  * When network partitions heal, nodes exchange missed events
  * This ensures the system can recover after connectivity issues
* **Resilient Operation During Network Partitioning**:
  * Nodes continue to function independently during network outages
  * Tasks still execute on available compute resources
  * Local state remains accessible for decision-making
  * Orchestrators can make scheduling decisions with available information
* **Minimal Data Transfer**: Job submissions, status updates, and coordination messages flow through NATS, while actual data handling uses direct connections to storage providers.

### Modular Storage Architecture

* **Pluggable Storage Providers**: Bacalhau's architecture includes a flexible interface for storage integration:
  * Input Sources: S3, HTTP/HTTPS, local paths
  * Output Publishers: S3, local volumes
  * Extensible design for additional providers
* **Data Locality**: The system attempts to schedule jobs on nodes with local access to required data whenever possible.

### Security & Isolation

* **Container-based Execution**: Tasks run within Docker containers (or WASM for certain workloads), confining them to a sandboxed environment.
* **Access Control**: Each node requires valid credentials or access tokens for private data sources, ensuring that only authorized tasks can retrieve protected resources.

### Data Flow & Execution Life Cycle

1. **Job Submission**: The user defines the job (image, commands, resource requirements) and sends it to an Orchestrator.
2. **Scheduling & Placement**: The Orchestrator determines which Compute Node(s) will run the job based on resource availability, constraints, and data locality.
3. **Execution**: The selected Compute Node retrieves or mounts any required input data, runs the containerized tasks, and tracks logs and exit codes.
4. **Publishing & Completion**: On completion, results are published to the configured storage. The Orchestrator marks the job as "Completed" (or "Failed," if an error occurred).
5. **Monitoring & Logging**: Users or automated scripts can query the Orchestrator for job status, logs, and output locations.

### Scalability & High Availability

* **Horizontal Scaling**: Additional Compute Nodes can be registered to handle larger workloads.
* **Geographic Distribution**: Deploy nodes across multiple regions and data centers for global coverage.
* **Network Resilience**: The event-driven architecture with local ledgers ensures operations continue during network disruptions:
  * Nodes track their state independently
  * When connectivity is restored, nodes reconcile state through event exchange
  * System gracefully handles transient network issues
* **Resilience**: Multiple Orchestrators (where supported) can maintain state replication, ensuring uninterrupted scheduling if one Orchestrator fails.

### Observability

* **Metrics & Logs**: Each node can expose metrics on CPU usage, memory consumption, and job performance, supporting tools like Prometheus or Grafana.
* **Events & Alerts**: The Orchestrator records major lifecycle events, allowing downstream systems or logs to react accordingly.

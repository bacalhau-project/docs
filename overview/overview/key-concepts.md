# Key Concepts

## Key Concepts

Bacalhau is built around a few core ideas and terminologies. If you're new to Bacalhau, here's what you need to know:

### Distributed Compute Orchestration

Bacalhau coordinates computing workloads across a network of machines, intelligently matching jobs to resources.

* Bacalhau acts as a dispatcher: You submit jobs (e.g., container workloads), and it finds the best node to run them based on available resources, data location, and constraints.

### Bring the Compute to the Data

Instead of moving data to compute, Bacalhau moves compute to where data lives, reducing network overhead and improving efficiency.

* Traditionally, big data solutions shuffle large datasets across networks to a central compute cluster.
* Bacalhau inverts this approach: it places compute tasks where the data already resides—whether in local storage, an S3 bucket, or other storage providers—reducing unnecessary data movement.

### Jobs & Executions

Bacalhau organizes work in a hierarchy that enables efficient resource allocation and parallelization.

* A **Job** defines the overall workflow (e.g., "run a Docker image with these arguments").
* A job can be broken into multiple **Executions** that run in parallel across different compute nodes.
* Bacalhau optimizes these executions based on data locality and available resources.

### Job Types

Bacalhau supports various execution patterns to accommodate different workload requirements:

* **Batch Jobs**: One-time execution of a workload, typically for data processing tasks that run to completion.
* **Ops Jobs**: Administrative or operational tasks, often for system maintenance or monitoring.
* **Daemon Jobs**: Long-running background processes that perform ongoing work.
* **Service Jobs**: Web services or APIs that need to remain available and respond to requests.

### Node Types

The Bacalhau network consists of specialized components, each with specific responsibilities:

* **Orchestrator Node**: Receives job submissions, schedules executions, and monitors state. Started with `bacalhau serve --orchestrator`.
* **Compute Node**: Executes workloads locally, typically requiring Docker or another runtime. Started with `bacalhau serve --compute`.
* **Hybrid Node**: Serves both roles at once—often used for local dev or small setups. Started with `bacalhau serve --orchestrator --compute`.

### Execution Engines

Bacalhau runs your code through pluggable runtime environments:

* Bacalhau supports multiple execution engines through its modular architecture:
  * **Docker**: For container-based workloads
  * **WebAssembly (WASM)**: For lightweight, sandboxed execution
* The framework is designed to accommodate additional engines as needed.

### Storage Providers

Bacalhau can access data from various sources through a clean, extensible interface:

* Bacalhau can mount data from various sources through its flexible storage provider interface:
  * S3-compatible storage
  * HTTP/HTTPS URLs
  * Local filesystems
  * IPFS
  * And more via storage provider plugins

### Publisher

After execution, Bacalhau ensures your results are accessible where you need them:

* After a job finishes, its results can be published to a specific backend—like local disk, S3 or IPFS—so they're easy to retrieve.

### Communication Layer

A reliable messaging system allows Bacalhau components to coordinate effectively:

* Bacalhau uses NATS.io as its communication backbone:
  * Orchestrators act as NATS servers
  * Compute nodes connect as NATS clients
  * This provides reliable, scalable messaging between components

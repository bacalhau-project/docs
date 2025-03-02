# Key Concepts



Bacalhau is built around a few core ideas and terminologies. If you're new to Bacalhau, here's what you need to know:

### Distributed Compute Orchestration

* Bacalhau acts as a dispatcher: You submit jobs (e.g., container workloads), and it finds the best node to run them based on available resources, data location, and constraints.

### Bring the Compute to the Data

* Traditionally, big data solutions shuffle large datasets across networks to a central compute cluster.
* Bacalhau inverts this approach: it places compute tasks where the data already resides—whether in local storage, an S3 bucket, or other storage providers—reducing unnecessary data movement.

### Jobs & Tasks

* A Job defines the overall workflow (e.g., "run a Docker image with these arguments").
* Each Job can have one or more Tasks specifying the engine (Docker, WASM, etc.), resource requirements, and input/output definitions.

### Job Types

* **Batch Jobs**: One-time execution of a workload, typically for data processing tasks that run to completion.
* **Ops Jobs**: Administrative or operational tasks, often for system maintenance or monitoring.
* **Daemon Jobs**: Long-running background processes that perform ongoing work.
* **Service Jobs**: Web services or APIs that need to remain available and respond to requests.

### Node Types

* **Orchestrator Node**: Receives job submissions, schedules tasks, and monitors state. Started with `bacalhau serve --orchestrator`.
* **Compute Node**: Executes tasks locally, typically requiring Docker or another runtime. Started with `bacalhau serve --compute`.
* **Hybrid Node**: Serves both roles at once—often used for local dev or small setups. Started with `bacalhau serve --orchestrator --compute`.

### Execution Engines

* Bacalhau supports multiple execution engines through its modular architecture:
  * **Docker**: For container-based workloads
  * **WebAssembly (WASM)**: For lightweight, sandboxed execution
* The framework is designed to accommodate additional engines as needed.

### Storage Providers

* Bacalhau can mount data from various sources through its flexible storage provider interface:
  * S3-compatible storage
  * HTTP/HTTPS URLs
  * Local filesystems
  * IPFS
  * And more via storage provider plugins

### Publisher

* After a task finishes, its results can be published to a specific backend—like local disk, S3 or IPFS—so they're easy to retrieve.

### Communication Layer

* Bacalhau uses NATS.io as its communication backbone:
  * Orchestrators act as NATS servers
  * Compute nodes connect as NATS clients
  * This provides reliable, scalable messaging between components

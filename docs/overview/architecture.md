---
sidebar_position: 20
---
# Architecture

Bacalhau employs a distributed, node-based architecture that brings compute operations closer to data. Built around a single self-contained binary that serves multiple roles, Bacalhau makes it remarkably simple to deploy and scale a distributed compute network.

### High-Level Overview

1. **User Submits a Job**: The user, through the Bacalhau CLI or API, sends a job definition to the Orchestrator. Jobs can be submitted in two ways:
   * **Imperative**: `bacalhau docker run ...` with command-line arguments
   * **Declarative**: `bacalhau job run <job-spec>` using a YAML specification file
2. **Orchestrator Schedules Tasks**: Based on resource availability, data location, and job requirements, the Orchestrator assigns tasks to Compute Nodes.
3. **Compute Nodes Execute Tasks**: Each Compute Node pulls the necessary image(s), mounts or fetches input data (local, S3, etc.), and runs the task in an isolated environment.
4. **Results Publication**: Once the task completes, outputs are published to configured storage. The Orchestrator updates the job's status accordingly.

All of these components run from the same Bacalhau binary, just in different modes, making deployment remarkably simple.

### Core Components

#### Orchestrators

* **Core Role**: Receives job submissions, maintains job state, and coordinates scheduling
* **NATS Server**: Acts as a messaging infrastructure hub
* **Communication**: Broadcasts scheduling decisions and listens for status updates

#### Compute Nodes

* **Primary Function**: Execute containerized or WASM-based workloads
* **Resource Management**: Advertise available CPU, memory, GPU, and storage capacity
* **Data Handling**: Fetch or mount input data from various sources and publish results
* **Isolation**: Run tasks in Docker containers or WASM environments

### Modular Architecture

Bacalhau features a pluggable architecture with well-defined interfaces that enable extension without modifying core code:

* **Execution Engine Interface**: Currently supports Docker and WebAssembly (WASM) workloads, with a clean API for adding new execution environments
* **Storage Provider Interface**: Plug in various storage backends (S3, HTTP/HTTPS, local paths, IPFS) for both input and output handling
* **Publisher Interface**: Easily add new ways to publish and share computation results

### Data-Centric Design

A key differentiator of Bacalhau is its data-centric approach:

* **Data Locality**: The system intelligently schedules jobs on nodes with local access to data
* **Minimal Transfer**: Moves computation to data rather than moving large datasets
* **Data Sovereignty**: Process sensitive data within security boundaries without requiring it to leave premises
* **Cross-Organizational Computation**: Enable collaborative analysis on protected datasets without exposing raw data

### Network Resilience

Bacalhau's architecture is designed to maintain operations even during network disruptions:

* **Event-Driven State**: All system events are stored in local ledgers and shared during normal operation
* **Independent Operation**: Nodes continue functioning during network outages
* **State Reconciliation**: When network partitions heal, nodes exchange missed events
* **Local Decision Making**: Orchestrators can make scheduling decisions with available information

### Deployment Models

Bacalhau's single-binary architecture supports flexible deployment configurations:

* **Single Node**: Run orchestrator and compute services on one machine (ideal for development)
* **Regional Cluster**: Distributed compute nodes within a single geographic region
* **Global Cluster**: Compute network spanning multiple regions and data centers

### Security Considerations

* **Execution Environments**: Tasks run in Docker containers or WASM environments with appropriate resource limits
* **Access Control**: Each node requires valid credentials for accessing private data sources
* **Data Boundaries**: Computation happens within defined security perimeters, protecting sensitive information

### Observability

* **Metrics & Logging**: Each node can expose metrics on resource usage and job performance
* **Event Tracking**: Orchestrators record job lifecycle events for monitoring and auditing

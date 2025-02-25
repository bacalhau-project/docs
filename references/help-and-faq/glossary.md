---
description: Definitions and usage for Bacalhau terminology
icon: list
---

# Glossary

## Compute Node

A Compute Node in the Bacalhau platform is responsible for executing jobs and producing results. These nodes are part of a private network that allows workload distribution and communication between computers. Compute Nodes handle various types of jobs based on their capabilities and resources. They work in tandem with Requester Nodes, which manage user requests, discover and rank Compute Nodes and monitor job lifecycles.

## CLI (Command Line Interface)

A CLI (Command Line Interface) in the Bacalhau platform is a tool that allows users to interact with Bacalhau through text-based commands entered into a terminal or command prompt. The CLI provides a set of commands for managing and executing various tasks on the platform, including submitting jobs, monitoring job status, managing nodes and configuring the environment.

## Data Source

A Data Source in Bacalhau refers to the origin of the data used in jobs. This can include various types of storage such as IPFS, S3, local files or URLs. Data sources are specified in the job configuration and are essential for providing the necessary input data for job execution.

## Docker

Docker in Bacalhau refers to the use of Docker containers to package and run applications. Docker provides a standardized unit of software, enabling users to create and manage containers efficiently. Bacalhau supports running Docker workloads, allowing users to utilize containerized applications seamlessly on the platform.

## IPFS

The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. In Bacalhau, IPFS is used as a data source and a way to distribute job inputs and outputs, leveraging its decentralized nature for efficient data management.

## Job

A Job in the Bacalhau platform is a unit of work that a user submits for execution. Jobs can be simple tasks or complex workflows involving multiple steps. They are defined by specifications that include the job type, resources required and input/output data. Jobs are managed by Requester Nodes, which ensure they are distributed to appropriate Compute Nodes for execution.

## Job Results

Job Results are the output generated after a job has been executed on a Compute Node. These results can include processed data, logs and any other relevant output files. Results are often stored in specified locations such as IPFS or S3, allowing users to retrieve and utilize them after job completion.

## Node

A Node in the Bacalhau is a fundamental component of the network, responsible for executing and managing jobs. A Node is the Bacalhau entity installed Nodes can be classified into different types based on their roles, such as Compute Nodes and Requester Nodes. Each node operates as part of a decentralized network, allowing distributed processing and resource management.

## Node Management

Node Management in Bacalhau involves configuring and maintaining the nodes within the network, including both Compute Nodes and Requester Nodes. This includes tasks like onboarding new nodes, managing node resources, setting access controls and ensuring nodes meet operational standards for job execution.

## Network

In the context of the Bacalhau, a Network refers to the interconnected system of nodes that collaborate to execute jobs, manage data and maintain communication. This network is decentralized, meaning it does not rely on a central authority, which enhances its robustness, scalability and efficiency.

## Network Specification

The Network Specification in Bacalhau defines the network requirements and settings for job execution. This includes configurations for network access, data transfer protocols and connectivity between nodes. Proper network specification ensures that jobs can communicate effectively and access necessary resources.

## Workload Onboarding

Workload Onboarding in Bacalhau is the process of preparing and integrating different types of workloads for execution on the platform. This involves setting up environments for various programming languages, configuring containers and ensuring workloads are optimized for execution across the distributed network of Compute Nodes.

## WebAssembly (WASM)

WebAssembly (WASM) in Bacalhau is a binary instruction format for a stack-based virtual machine. WASM is designed for safe and efficient execution, making it a suitable target for compilation from high-level languages. Bacalhau supports running WASM workloads, enabling efficient execution of lightweight and portable code.

## Requestor Node

A Requester Node in the Bacalhau platform is responsible for handling user requests, discovering and ranking Compute Nodes, forwarding jobs to these nodes and monitoring the lifecycle of the jobs. Requester Nodes play a crucial role in managing the flow of tasks and ensuring they are executed efficiently by the appropriate Compute Nodes in the network.

## S3

Amazon Simple Storage Service (S3) is a scalable object storage service. Bacalhau supports S3 as a data source, allowing users to store and retrieve input and output data for jobs. S3's integration with Bacalhau provides robust and reliable storage options for large-scale data processing tasks.

---
icon: square-divide
---

# Ad-hoc log query using DuckDB

## Remote Log Analysis using DuckDB and Bacalhau

This guide provides an overview of using DuckDB with Bacalhau for remote log analysis. By leveraging these tools, you can perform detailed analyses without the need to download datasets locally.

### Overview

DuckDB is a powerful in-memory SQL database management system ideal for data analytics. Bacalhau facilitates decentralized job execution, meaning you can run jobs remotely without having to log in or build complicated services. Together, they make a powerful tool for remote, ad-hoc server interaction.

### Prerequisites

* You will need a Bacalhau cluster with the following configuration:

```
NameProvider: "uuid"
Compute:
  Enabled: true
  Orchestrators:
    - nats://<YOUR_ORCHESTRATOR_IP_HERE>:4222
  Auth:
    Token: YOUR_TOKEN
  TLS:
    RequireTLS: true
  AllowListedLocalPaths:
    - /var/log/logs_to_process:rw
JobAdmissionControl:
  AcceptNetworkedJobs: true
```

We recommend using [Expanso Cloud](https://getwaitlist.com/waitlist/23135)! But if you'd like to set up a cluster on your own, you can use our tool [Andaime](https://github.com/bacalhau-project/andaime) to do this too.&#x20;

### Containerize with Docker

1.  **Create a Dockerfile**:

    ```dockerfile
    FROM mcr.microsoft.com/vscode/devcontainers/python:3.9

    RUN apt-get update && apt-get install -y nodejs npm g++
    RUN pip3 install duckdb==0.4.0
    RUN wget https://github.com/duckdb/duckdb/releases/download/v0.4.0/duckdb_cli-linux-amd64.zip \
        && unzip duckdb_cli-linux-amd64.zip -d /usr/local/bin \
        && rm duckdb_cli-linux-amd64.zip

    WORKDIR /workspace
    2
    ```


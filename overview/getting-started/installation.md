# Installation

This section explains how to install Bacalhau on your machine, verify it's working, and understand basic requirements. Bacalhau is distributed as a single self-contained binary that can function as a client, orchestrator node, and compute node—greatly simplifying deployment and management of your distributed compute network.



## Install the Bacalhau Binary

To install the CLI, choose your environment, and run the command(s) below.

{% include "../.gitbook/includes/curl-sl-https-get.bacalh....md" %}



### Verify the Installation

```bash
bacalhau version
```

This should print:

* The local binary version
* The version of the orchestrator this client is connected to, if any
* The latest available version of bacalhau incase you are running an outdated version.

If you get `command not found`, verify your PATH includes the Bacalhau binary.



### Upgrading Bacalhau

To upgrade Bacalhau to the latest version, run the installation script. If Bacalhau is already installed, this will update it to the most recent version available.&#x20;



### **Requirements & Tips**

* **Docker**:
  * Must be installed and running on any **compute** node to handle Docker-based jobs.
* **AWS Credentials** (if you’re using S3):
  * For S3 inputs or outputs, the node needs valid AWS credentials (e.g., environment variables).
* **Running an Orchestrator & Compute**:
  * See Quick Start for how to run a local or hybrid node with `bacalhau serve --orchestrator --compute`.
* **`bacalhau devstack`**:
  * Perfect for local development or running tests&#x20;

***

#### **Next Steps**

* Head over to Basic CLI Usage to learn how to submit, describe, and stop jobs.
* Check Common Workflows for steps on mounting data (S3, local folders) and publishing outputs.
* Explore References for advanced node management (Docker Compose, devstack, multi-node clusters).

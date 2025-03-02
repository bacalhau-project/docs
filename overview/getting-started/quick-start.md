# Quick Start

This Quick Start guide shows how to run at least one Bacalhau job with minimal setup. Bacalhau's design as a single self-contained binary makes it incredibly easy to get started and set up your own distributed compute network in minutes.

You'll learn two main approaches:

1. Local Hybrid Node for testing everything on one machine.
2. Managed Orchestrator (Expanso Cloud) plus a local compute node.

### Prerequisites

* Docker installed on any machine that runs a compute node.
* Bacalhau CLI installed (see Installation below).

### Option 1: Local Hybrid Node

1.  **Start a Hybrid Node** Open a terminal and run:

    ```bash
    bacalhau serve --orchestrator --compute
    ```

    * This command launches both an orchestrator and a compute node in one process.
    * Keep it running; you'll see logs indicating it's ready.
2.  **Submit a "Hello World" Job** In a new terminal window, run:

    ```bash
    bacalhau docker run \
      ubuntu:latest \
      -- echo "Hello from Bacalhau!"
    ```

    * This uses the imperative syntax with the local Docker engine to execute the command.
    * You'll receive a Job ID as output once it's submitted.
3.  **Check the Logs**

    ```bash
    bacalhau job logs <jobID>
    ```

    * Replace `<jobID>` with the actual ID printed in step 2.
    * You should see "Hello from Bacalhau!" confirming the job ran successfully.

### Option 2: Managed Orchestrator via Expanso Cloud

1. **Obtain an Expanso Cloud Endpoint**
   * Sign up at Expanso Cloud.
   * Grab your orchestrator endpoint (e.g., `orchestrator.expanso.cloud`).
2.  **Run a Local Compute Node**

    ```bash
    bacalhau serve --compute \
      -c Compute.Orchestrators=<expanso-cloud-endpoint>:1234
    ```

    * Replace `<expanso-cloud-endpoint>` with the actual host.
    * This node connects to Expanso Cloud's orchestrator.
3.  **Submit a Job**

    ```bash
    bacalhau docker run \
      --api-host <expanso-cloud-endpoint> \
      ubuntu:latest \
      -- echo "Hello from Expanso Cloud!"
    ```

    * The orchestrator in Expanso Cloud schedules the job, while your local node executes it.
4.  **Check Logs**

    ```bash
    bacalhau job logs <jobID> --api-host <expanso-cloud-endpoint>
    ```

    * Verify the output again. You should see the "Hello" message.



### Next Steps

* Learn how to submit more complex jobs with the Basic CLI Usage guide
* Explore how to mount data from different sources in Common Workflows

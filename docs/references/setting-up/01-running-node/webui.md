---
description: How to run the WebUI.
---

# Bacalhau WebUI

## Overview

The Bacalhau WebUI offers an intuitive interface for interacting with the Bacalhau network. This guide provides comprehensive instructions for setting up and utilizing the WebUI.

For contributing to the WebUI's development, please refer to the [Bacalhau WebUI GitHub Repository](https://github.com/bacalhau-project/bacalhau/tree/main/webui).

## WebUI Setup

### Prerequisites

* Ensure you have a Bacalhau `v1.5.0` or later installed.

### Configuration

To enable the WebUI, use the `WebUI.Enabled` configuration key:

```bash
bacalhau config set webui.enabled=true
```

By default, WebUI uses `host=0.0.0.0` and `port=8438`. This can be configured via `WebUI.Listen` configuration key:

```bash
bacalhau config set webui.listen=<ip-address>:<port>
```

### Accessing the WebUI

Once started, the WebUI is accessible at the specified address, `localhost:8438` by default.&#x20;

<figure><img src="..//img/2024-10-11_19h25_04 (1).png" alt=""><figcaption></figcaption></figure>

## WebUI Features

### Jobs

The updated WebUI allows you to view a list of jobs, including job status, run time, type, and a message in case the job failed.

Clicking on the id of a job in the list opens the job details page, where you can see the history of events related to the job, the list of nodes on which the job was executed and the real-time logs of the job.

### Nodes

On the Nodes page you can see a list of nodes connected to your network, including node type, membership and connection statuses, amount of resources - total and currently available, and a list of labels of  the node.

Clicking on the node id opens the node details page, where you can see the status and settings of the node, the number of running and scheduled jobs.

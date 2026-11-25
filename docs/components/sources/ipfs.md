---
slug: /sources/ipfs
title: IPFS Input Source
description: Fetch files and directories by IPFS content identifier and mount them as inputs to a Bacalhau task.
---

# IPFS

The IPFS Input Source enables users to easily integrate data hosted on the [InterPlanetary File System (IPFS)](https://ipfs.tech) into Bacalhau jobs. By specifying the Content Identifier (CID) of the desired IPFS file or directory, users can have the content fetched and made available in the task's execution environment, ensuring efficient and decentralized data access.

## Requirements: Run Your Own IPFS Node

Bacalhau does not include an IPFS node. To accept IPFS inputs, a compute node needs an IPFS node that you run and manage yourself, such as [Kubo](https://docs.ipfs.tech/install/command-line/), and must be configured with the address of that node's RPC API.

1.  **Start an IPFS node** that the compute node can reach. With Kubo:

    ```bash
    ipfs init
    ipfs daemon
    ```

    The IPFS node must be able to retrieve the CIDs your jobs use, either from the public IPFS network, from a private IPFS network that holds the content, or because the content is pinned locally.

2.  **Point the compute node at the IPFS RPC API** using its multiaddress. This is Kubo's `Addresses.API` setting (port 5001 by default), not the HTTP gateway on port 8080:

    ```bash
    bacalhau config set InputSources.Types.IPFS.Endpoint=/ip4/127.0.0.1/tcp/5001
    ```

    Or in the node's configuration file:

    ```yaml
    InputSources:
      Types:
        IPFS:
          Endpoint: /ip4/127.0.0.1/tcp/5001
    ```

    You can also pass it at startup with `bacalhau serve --compute -c InputSources.Types.IPFS.Endpoint=/ip4/127.0.0.1/tcp/5001`. Restart the compute node after changing the setting.

3.  **Verify** that the compute node offers the IPFS input source. `ipfs` should appear in the `INPUTS FROM` column:

    ```bash
    bacalhau node list --show features
    ```

If no endpoint is configured, the compute node does not offer the IPFS input source, and jobs with IPFS inputs fail to schedule with an error such as `does not support ipfs, only inline, urldownload`. If the endpoint is configured but unreachable, the node refuses to start with `failed to connect to '/ip4/127.0.0.1/tcp/5001'`.

:::warning
The IPFS RPC API gives full control over the IPFS node. Keep it bound to localhost or a private network and never expose it to the public internet.
:::

## Source Specification Parameters

Here are the parameters that you can define for an IPFS input source:

- **CID** `(string: <required>)`: The Content Identifier that uniquely pinpoints the file or directory on the IPFS network. Bacalhau retrieves the content associated with this CID for use in the task.

### Example

Below is an example of how to define an IPFS input source in YAML format.

```yaml
InputSources:
  - Source:
      Type: 'ipfs'
      Params:
        CID: 'QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjY3fZ'
  - Target: '/data'
```

In this configuration, the data associated with the specified CID is fetched from the IPFS network and made available in the task's environment at the "/data" path.

### Example (Imperative/CLI)

Utilizing IPFS as an input source in Bacalhau via the CLI is straightforward. Below are example commands that demonstrate how to define the IPFS input source:

1.  **Mount an IPFS CID to the default `/inputs` directory**:

    ```bash
    bacalhau docker run -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72 ubuntu ...
    ```

2.  **Mount an IPFS CID to a custom `/data` directory**:

    ```bash
    bacalhau docker run -i ipfs://QmeZRGhe4PmjctYVSVHuEiA9oSXnqmYa4kQubSHgWbjv72:/data ubuntu ...
    ```

These commands provide a seamless mechanism to fetch and mount data from IPFS directly into your task's execution environment using the Bacalhau CLI.

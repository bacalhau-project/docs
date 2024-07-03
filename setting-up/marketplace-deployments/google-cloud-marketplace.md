# Google Cloud Marketplace

## Introduction

Well done on deploying your Bacalhau cluster! Now that the deployment is finished, this document will help with the next steps. It provides important information on how to interact with and manage the cluster. You'll find details on the outputs from the deployment, including how to set up and connect a Bacalhau Client, and how to authorize and connect a Bacalhau Compute node to the cluster. This guide gives everything needed to start using the Bacalhau setup

## Deployment Outputs

After completing the deployment, several outputs will be presented. Below is a description of each output and instructions on how to configure your Bacalhau node using them.

### Requester Public IP

**Description**: The IP address of the Requester node for the deployment and the endpoint where the Bacalhau API is served.

**Usage**: Configure the Bacalhau Client to connect to this IP address in the following ways:

1.  Setting the `--api-host` CLI Flag:

    ```shell
    $ bacalhau --api-host $REQUESTER_IP [CMD]
    ```
2.  Setting the `BACALHAU_API_HOST` environment variable:

    ```shell
    $ export BACALHAU_API_HOST=$REQUESTER_IP
    $ bacalhau [CMD]
    ```
3.  Modifying the Bacalhau Configuration File:

    ```sh
    $ bacalhau config set node.clientapi.host $REQUESTER_IP
    $ bacalhau [CMD]
    ```

### Requester API Token

**Description**: The token used to authorize a client when accessing the Bacalhau API.

**Usage**: The Bacalhau client prompts for this token when a command is first issued to the Bacalhau API. For example:

{% code fullWidth="false" %}
```sh
$ bacalhau agent version
token: $REQUESTER_API_TOKEN
```
{% endcode %}

### Compute API Token

**Description**: The token used to authorize a Bacalhau Compute node to connect to the Requester Node.

**Usage**: A Bacalhau Compute node can be connected to the Requester Node using the following command:

<pre class="language-sh" data-full-width="false"><code class="lang-sh"><strong>bacalhau serve --node-type=compute --orchestrators=nats://$COMPUTE_API_TOKEN@$REQUESTER_IP
</strong></code></pre>

\

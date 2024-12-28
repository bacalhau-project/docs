# Node Onboarding

## Introduction

This tutorial describes how to add new nodes to an existing private network. Two basic scenarios will be covered:

1. Adding a [physical host/virtual](quick-start-docker.md#add-host-virtual-machine-as-a-new-node) machine as a new node.
2. Adding a [cloud instance](quick-start-docker.md#add-a-cloud-instance-as-a-new-node) as a new node. ​

## Pre-Prerequisites

1. You should have an established private network consisting of at least one requester node. See the [Create Private Network](../../getting-started/create-private-network.md) guide to set one up.
2. You should have a new host (physical/virtual machine, cloud instance or docker container) with [Bacalhau](../../getting-started/installation.md) installed.​

## Add Host/Virtual Machine as a New Node

Let's assume that you already have a private network with at least one requester node. In this case, the process of adding new nodes follows the [Create And Connect Compute Node](../../getting-started/create-private-network.md#create-and-connect-compute-node) section. You will need to:

1. Set the token in the `Compute.Auth.Token` configuration key
2. Set the orchestrators IP address in the `Compute.Orchestrators` configuration key
3. Execute `bacalhau serve` specifying the node type via `--orchestrator` flag

## Add a Cloud Instance as a New Node

Let's assume you already have all the necessary cloud infrastructure set up with a private network with at least one requester node. In this case, you can add new nodes manually ([AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html), [Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-cli), [GCP](https://cloud.google.com/compute/docs/machine-images/create-instance-from-machine-image)) or use a tool like [Terraform](https://developer.hashicorp.com/terraform/tutorials) to automatically create and add any number of nodes to your network. The process of adding new nodes manually follows the [Create And Connect Compute Node](../../getting-started/create-private-network.md#create-and-connect-compute-node) section.

To automate the process using Terraform follow these steps:

1. [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
2. Configure terraform for [your cloud provider](https://developer.hashicorp.com/terraform/tutorials)
3. Determine the IP address of your requester node
4. Write a terraform script, which does the following:
   1. Adds a new instance
   2. Installs `bacalhau` on it
   3. Launches a compute node
5. Execute the script

## Support <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

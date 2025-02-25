---
description: NATS.io networking fundamentals in Bacalhau
---

# Utilizing NATS.io within Bacalhau

{% hint style="warning" %}
Support of the `libp2p` was discontinued in version `v1.5.0`
{% endhint %}

Starting from the `v.1.3.0` to communicate with other nodes on the network Bacalhau uses [NATS.io](https://nats.io/), a powerful open-source messaging system designed to streamline communication across complex network environments.

Our initial NATS integration focuses on simplifying communication between orchestrator and compute nodes. By embedding NATS within orchestrators, we streamline the network. Now, compute nodes need only connect to one or a few orchestrators and dynamically discover others at runtime, dramatically cutting down on configuration complexity.

## How This Benefits Users

1. Easier Setup: Compute nodes no longer need to be directly accessible by orchestrators, removing deployment barriers in diverse environments (on-premises, edge locations, etc.).
2. Increased Reliability: Network changes are less disruptive, as compute nodes can easily switch between orchestrators if needed.
3. Future-Proof: This sets the stage for more advanced NATS features like global clusters and multi-orchestrator setups.

## **How This Affects Current Users**

The aim of integrating NATS into Bacalhau is to keep user experience with Bacalhau's HTTP APIs and CLIs for job submission and queries consistent. This ensures a smooth transition, allowing you to continue your work without any disruptions.

## **Getting Started with NATS**

### **1. Generate an Authentication Token:**

Start by [creating a secure](broken-reference) token. This token will be used for authentication between the orchestrator and compute nodes during their communications:

```bash
bacalhau config set Compute.Auth.Token=<your_secure_token>
bacalhau config set Orchestrator.Auth.Token=<your_secure_token>
```

Make sure to securely store this token and share it only with authorized parties in your network.

### **2. Running an Orchestrator Node with Authentication:**

With the authentication token set, launch your orchestrator node as follows:

```bash
bacalhau serve --orchestrator
```

This command sets up an orchestrator node with an embedded NATS server, using the given auth token to secure communications. It defaults to port `4222`, but you can customize this using the `Orchestrator.Port` configuration key if needed.

### **3. Initiating Compute Nodes with Authentication:**

Compute nodes can authenticate using one of the following methods, depending on your preferred configuration setup:

#### **Option 1: Read** `authsecret` **from the Config:**

```bash
bacalhau serve --compute --config Compute.Orchestrators=<HOST>
```

This method assumes the `Compute.Auth.Token` is already configured on the compute node, allowing for a seamless authentication process.

#### **Option 2: Pass** `Auth.Token`  Value **Directly in the Orchestrator URI:**

```bash
bacalhau serve \
--compute \
--Compute.Orchestrators=<your_secure_token>@<HOST>
```

Here, the `Auth.Token` is directly included in the command line, providing an alternative for instances where it's preferable to specify the token explicitly rather than rely on the configuration file.

Both methods ensure that compute nodes, acting as NATS clients, securely authenticate with the orchestrator node(s), establishing a trusted communication channel within your Bacalhau network.

#### **More Authentication Options**

We're committed to providing a secure and flexible distributed computing environment. Future Bacalhau versions will expand authentication choices, including TLS certificates and JWT, catering to varied security needs and further strengthening network security.

## **Looking Ahead with NATS**

**Global Connectivity and Scalability:** NATS opens avenues for Bacalhau to operate smoothly across all scales, from local deployments to international networks. Its self-healing capabilities and dynamic mesh networking form the foundation for a future of resilient and flexible distributed computing.

**Unlocking New Possibilities:** The integration heralds a new era of possibilities for Bacalhau, from global clusters to multiple orchestrator nodes, tackling the complexities of distributed computing with innovation and community collaboration.

## **Conclusion**

The shift to NATS is a step toward making distributed computing more accessible, resilient, and scalable. As we start this new chapter, we're excited to explore the advanced features NATS brings to Bacalhau and welcome our community to join us on this transformative journey.

## Support

If you’re interested in learning more about distributed computing and how it can benefit your work, there are several ways to connect with [us](https://www.expanso.io/). Visit our [website](https://www.expanso.io/), [sign up to our bi-weekly office hour](https://lu.ma/8ojx1umx), [join our Slack](https://bit.ly/bacalhau-project-slack) or [send us a message](https://www.expanso.io/contact/).

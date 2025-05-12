---
description: Securing node-to-node communication with TLS
---

# Inter-Nodes TLS

## Introduction

Secure communication between Bacalhau Compute Nodes and Orchestrators is crucial, especially when operating across untrusted networks. This guide demonstrates how to implement TLS encryption to protect inter-node communication and ensure data security.

## Concept

Bacalhau Compute Nodes initiate communication with the orchestrator through NATS, a high-performance messaging system. The orchestrator node hosts the NATS server, which compute nodes automatically connect to upon startup.

As a distributed system, Bacalhau supports TLS encryption to secure these communication channels. While this guide demonstrates the implementation using self-signed certificates, the same principles apply when using company-issued or publicly trusted certificates.

## Procedure

### Step 1: Generate Root Certificate Authority

In this step, we'll guide you through generating the required certificates, focusing on self-signed certificate creation.

First, we need to generate a self-signed root certificate authority (CA) certificate, which will be used to sign all subsequent certificates. You can use standard tools like `openssl` or [`mkcert`](https://github.com/FiloSottile/mkcert) for this process. We recommend setting a long expiration date for the root CA and securely backing up both the certificate and its private key.

This step will produce two essential components: the self-signed root CA certificate and its corresponding private key.

### Step 2: Generate NATS Server Certificate

In this step, we'll generate the certificate that enables TLS connections for the NATS server.

First, identify the DNS name or IP address used to connect to the orchestrator. This is typically found in the compute nodes' configuration under the "Orchestrators" field. For example:

- If your config specifies `nats://10.0.5.16:4222,` use the IP address `10.0.5.16`
- If your config specifies `nats://my-bacalhau-orchestrator-node:4222`, use the DNS name `my-bacalhau-orchestrator-node`

Next, generate a server certificate signed by the Root CA (created in step 1). This certificate must include your chosen IP address or DNS name in its Subject Alternative Name field. Additionally, always include the IP address "127.0.0.1" in the Subject Alternative Names to support communications initiated from the orchestrator node itself.

This step will produce two critical files: the server certificate and its corresponding private key. Store both files securely in a protected location.

### Step 3: Start Nodes with Certificates

In this step, we'll configure both orchestrator nodes and compute nodes with the generated certificates.

First, copy the following files to the orchestrator node:

- The root certificate from step 1 (certificate file only, not the private key)
- The server certificate from step 2
- The server's private key from step 2

The orchestrator node should now have three files: the root certificate, server certificate, and server key file. Next, enable TLS support by adding the TLS configuration section to the orchestrator's configuration file. Example:

```yaml
NameProvider: 'uuid'
API:
  Port: 1234
Orchestrator:
  Enabled: true
  Auth:
    Token: 'i_am_very_secret_token'
  TLS:
    ServerCert: '/path/to/cert'
    ServerKey: '/path/to/key'
    CACert: '/path/to/ca-cert'
    ServerTimeout: 15
```

Next, prepare each compute node by copying the root certificate file (excluding the private key) to the node. Then, update each compute node's configuration to trust this certificate authority for secure server connections. Example:

```yaml
NameProvider: 'uuid'
API:
  Port: 1234
Compute:
  Enabled: true
  Orchestrators:
    - nats://my-bacalhau-orchestrator-node:4222
  Auth:
    Token: 'i_am_very_secret_token'
  TLS:
    CACert: '/path/to/ca-cert'
```

After restarting the Bacalhau processes on all nodes, secure TLS communication will be established for all node-to-node interactions.

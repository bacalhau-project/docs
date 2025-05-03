---
description: How to configure authentication and authorization on your Bacalhau node.
---

# Access Management

## Access Management

Bacalhau includes a flexible auth system that supports multiple methods of auth that are appropriate for different deployment environments.

### By default

With no specific authentication configuration supplied, Bacalhau runs in "anonymous mode" – which allows unidentified users limited control over the system. "Anonymous mode" is only appropriate for testing or evaluation setups.

In anonymous mode, Bacalhau will allow:

1. Users identified by a self-generated private key to submit any job and cancel their own jobs.
2. Users not identified by any key to access other read-only endpoints, such as to read job lists, describe jobs, and query node or agent information.

### Restricting anonymous access

As of Bacalhau 1.7 release, a more flexible and easy to setup authentication and authorization flow has been introduced. Please check the [Authentication and Authorization docs](../auth_flow.md) for more details.

---
description: >-
  Efficiently manage and operate a large fleet of distributed nodes with remote
  execution, real-time monitoring, targeted job execution, and automated
  software updates.
---

# Fleet Management

## Overview

Managing a distributed fleet of compute nodes across multiple regions and environments comes with significant complexity, requiring efficient remote execution, monitoring, automation, and rapid incident response. Keeping systems up to date, collecting real-time metrics, and executing large-scale operations often involves extensive manual work and complex tooling. Bacalhau simplifies fleet management by providing a seamless way to run commands, update configurations, gather system metrics, and respond to incidents in real time across all nodes in a network.

## Key Capabilities

### 1. Remote Execution

Bacalhau allows you to execute commands across your entire fleet or on specific subsets of nodes, reducing the need for manual intervention and enabling real-time operational control.

- Run scripts, commands, or jobs across a distributed fleet without requiring SSH access.
- Execute commands on nodes dynamically selected based on their attributes (e.g., region, hardware type, role).
- Reduce the complexity of managing compute nodes across cloud, on-premise, and hybrid environments.

### 2. Software Deployment & Configuration Updates

Keeping software and configurations up to date across a large number of distributed nodes is challenging. Bacalhau simplifies this by allowing seamless deployment of updates.

- Distribute software updates efficiently without requiring centralized coordination.
- Deploy configuration changes dynamically based on workload needs.
- Ensure all nodes remain in sync with the latest versions of necessary tools and dependencies.

### 3. Real-Time Metrics & Logs Collection

Monitoring the health and performance of a large fleet requires collecting logs and metrics in real time. Bacalhau provides an efficient way to access this data across all nodes.

- Execute lightweight jobs to collect system statistics, disk usage, or network health metrics.
- Fetch logs from a specific subset of nodes dynamically for debugging and analysis.
- Reduce reliance on heavyweight monitoring tools by executing targeted status checks when needed.

### 4. Targeted & Ops Jobs Execution

Bacalhau supports **Ops Jobs**, a type of execution designed specifically for fleet-wide operations. These jobs run on all nodes that match a given selection criteria, making it easy to execute large-scale fleet management tasks.

- Run security audits, cleanup jobs, or health checks across all nodes.
- Query or modify system state at scale without impacting ongoing workloads.
- Filter job execution by node attributes (e.g., run a command only on GPU nodes or ARM-based instances).

### 5. Incident Response & Automated Recovery

When failures or security incidents occur, Bacalhau enables rapid fleet-wide response and mitigation through distributed execution.

- **Live Investigation** – Execute on-the-fly queries to collect logs and diagnostics from affected nodes.
- **Automated Mitigation** – Deploy quick-fix scripts across targeted nodes to isolate, restart, or remediate issues.
- **Network-Wide Patching** – Apply security patches or enforce policy changes across the fleet without manual intervention.

By enabling fast, targeted responses to issues, Bacalhau minimizes downtime and ensures operational resilience.

## Example Use Cases

- **Updating all nodes in a region with a new software version.**
- **Running a script to check disk space on all nodes and flag those nearing capacity.**
- **Restarting services across specific groups of nodes without manual intervention.**
- **Executing a security patch on all compute nodes matching a specific hardware profile.**
- **Investigating an outage by collecting logs from affected nodes in real time.**
- **Isolating compromised nodes during a security incident by modifying network rules instantly.**

## Next Steps

To start managing a distributed compute fleet using Bacalhau:

1. **Deploy Bacalhau agents** on all compute nodes across different regions.
2. **Use Ops Jobs** to execute large-scale operational and incident response tasks.
3. **Leverage remote execution** to trigger software updates, collect logs, and automate remediation.

By leveraging Bacalhau’s distributed execution model, fleet management becomes more efficient, scalable, and automated, reducing operational overhead while ensuring nodes remain up to date, resilient, and responsive to workload demands.

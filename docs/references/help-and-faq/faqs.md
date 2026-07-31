---
slug: /references/faq
title: Bacalhau Frequently Asked Questions
description: Direct answers about compute over data, Bacalhau architecture, workloads, data locality, execution engines, nodes, and job operations.
---

# FAQs

## What is compute over data?

Compute over data is an architecture that runs processing near the systems where data is generated or stored. It reduces unnecessary data transfer by sending workload instructions to the data location and returning only the required results.

## What is Bacalhau?

Bacalhau is an open-source distributed compute orchestration framework. An orchestrator schedules jobs, and compute nodes execute those jobs close to their input data across edge, on-premises, and cloud environments.

## When should I use Bacalhau?

Use Bacalhau when moving raw data to a central compute system is slow, expensive, unreliable, or restricted. Common workloads include distributed log processing, fleet operations, regional analytics, machine learning, and processing data at the edge.

## Does Bacalhau require data to move to a central cluster?

No. Bacalhau can schedule a workload on compute nodes near local or remote data sources. A job can process data in place and publish only its output, although the exact data movement depends on the input source, job specification, and selected compute node.

## Is Bacalhau open source?

Yes. The Bacalhau source code is available on [GitHub](https://github.com/bacalhau-project/bacalhau) under the [Apache 2.0 license](https://github.com/bacalhau-project/bacalhau/blob/main/LICENSE).

## Which workload formats can Bacalhau run?

Bacalhau supports Docker containers and WebAssembly modules. Existing containerized tools can usually run without being rewritten, while WebAssembly provides a lightweight execution option for compatible workloads.

## How do I restrict what nodes my jobs run on?

You can describe each node with labels in a `key=value` format, which can later be used as conditions for choosing nodes to run your jobs on:

```bash
bacalhau config set Labels=NodeType=WebServer
```

For multiple labels, use comma-separated values:

```bash
bacalhau config set Labels=foo=bar,baz=qaz
```

## How do I specify the orchestrator for my compute node?

The `Compute.Orchestrator` field in the config tells the Bacalhau compute node where to connect:

```bash
bacalhau config set Compute.Orchestrators=my-great-orchestrator.com
```

You can add protocol and port if needed:

```bash
bacalhau config set Compute.Orchestrators=nats://my-great-orchestrator.com:4222
```

## How do I enable the WebUI?

By default, the WebUI for Bacalhau is disabled for security reasons. To enable it:

```bash
bacalhau config set WebUI.Enabled=true
```

## Can I run non-Docker jobs?

Yes! You can run programs using WebAssembly instead. Refer to the [WebAssembly onboarding documentation](../../references/developers/workload-onboarding/wasm.md) for instructions.

## How do I see a job's progress while it's running?

Use the job describe command with your job ID:

```bash
bacalhau job describe b4491a4a-7b55-4fa7-a5af-80f3c99bc379
```

If your job writes to stdout or stderr while running, you can also view the output with the `logs` command.

## Can I stop a running job?

Yes. Given a valid `job ID`, you can use the `stop` command to cancel the job and stop it from running:

```bash
bacalhau job stop <job-id>
```

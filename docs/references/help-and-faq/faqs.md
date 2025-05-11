---
slug: /references/faq
---
# FAQs

### How do I restrict what nodes my jobs run on?

You can describe each node with labels in a `key=value` format, which can later be used as conditions for choosing nodes to run your jobs on:

```bash
bacalhau config set Labels=NodeType=WebServer
```

For multiple labels, use comma-separated values:

```bash
bacalhau config set Labels=foo=bar,baz=qaz
```

### How do I specify the orchestrator for my compute node?

The `Compute.Orchestrator` field in the config tells the Bacalhau compute node where to connect:

```bash
bacalhau config set Compute.Orchestrators=my-great-orchestrator.com
```

You can add protocol and port if needed:

```bash
bacalhau config set Compute.Orchestrators=nats://my-great-orchestrator.com:4222
```

### How do I enable the WebUI?

By default, the WebUI for Bacalhau is disabled for security reasons. To enable it:

```bash
bacalhau config set WebUI.Enabled=true
```

### Can I run non-Docker jobs?

Yes! You can run programs using WebAssembly instead. Refer to the [WebAssembly onboarding documentation](../../getting-started/workload-onboarding/wasm-workload-onboarding.md) for instructions.

### How do I see a job's progress while it's running?

Use the job describe command with your job ID:

```bash
bacalhau job describe b4491a4a-7b55-4fa7-a5af-80f3c99bc379
```

If your job writes to stdout or stderr while running, you can also view the output with the `logs` command.

### Can I stop a running job?

Yes. Given a valid `job ID`, you can use the `stop` command to cancel the job and stop it from running:

```bash
bacalhau job stop <job-id>
```
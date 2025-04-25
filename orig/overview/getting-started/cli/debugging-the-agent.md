# Debugging the Agent

The Bacalhau `agent` is the process your client directly communicates with. By default, this is running on `localhost:1234`, but can be changed using `--api-host` and `--api-port` flags. For local testing or small clusters, you'll frequently need to check the agent's health and examine its configuration.

### Checking Agent Health and Version

When troubleshooting connectivity or verifying your setup:

```bash
bacalhau agent alive
```

This returns a simple health check response, confirming your client can communicate with the agent.

To check which version you're running:

```bash
bacalhau agent version
```

This displays version information helpful when verifying installations, troubleshooting issues, or reporting bugs.

### Inspecting Agent Configuration

During setup or when diagnosing issues:

```bash
bacalhau agent config
```

This returns the complete configuration in YAML format, showing network parameters, resource limits, and admission control settings. Use this when jobs aren't being accepted or resources aren't properly allocated.

### Examining Node Details

To get detailed information about the agent's node:

```bash
bacalhau agent node
```

This shows information about node identity, available resources, and supported features. Use this when setting up a new node or troubleshooting job scheduling issues.

### Working with Remote Agents

To connect to a remote agent:

```bash
bacalhau agent version --api-host cluster.example.com --api-port 8080
```

This pattern works with all agent commands and is useful for monitoring production clusters or diagnosing connectivity issues between network components.

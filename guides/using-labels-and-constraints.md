---
icon: tags
---

# Using Labels and Constraints

This guide provides a comprehensive overview of Bacalhau's label and constraint system, which enables fine-grained control over job scheduling and resource allocation.

### Understanding Labels and Constraints

Labels in Bacalhau are key-value pairs attached to nodes that describe their characteristics, capabilities, and properties. Constraints are rules you define when submitting jobs to ensure they run on nodes with specific labels.

### Label Configuration

#### Command Line Configuration

Labels are defined when starting a Bacalhau node using the `-c Labels` flag:

```bash
bacalhau serve -c Labels="env=prod,gpu=true,arch=x64"
```

#### Configuration File

You can also define labels in a YAML configuration file:

```yaml
# config.yaml
labels:
  env: prod
  gpu: true
  arch: x64
  region: us-west
```

Then start the node with:

```bash
bacalhau serve --config-file config.yaml
```

#### Verifying Labels

Check node labels using:

```bash
bacalhau node list
```

### Constraint Operators

Bacalhau supports various operators for precise node selection:

| Operator | Example           | Description       |
| -------- | ----------------- | ----------------- |
| `=`      | `region=us-east`  | Exact match       |
| `!=`     | `env!=staging`    | Not equal         |
| `exists` | `gpu`             | Key exists        |
| `!`      | `!temporary`      | Key doesn't exist |
| `in`     | `zone in (a,b,c)` | Value in set      |
| `gt`     | `mem-gb gt 32`    | Greater than      |
| `lt`     | `cpu-cores lt 16` | Less than         |

### Job Submission Patterns

#### Basic Constraint Usage

```bash
# Single constraint
bacalhau docker run --constraints "env=prod" alpine

# Multiple constraints
bacalhau docker run \
  --constraints "env=prod" \
  --constraints "gpu=true" \
  nvidia/cuda:11.0-base
```

#### Advanced Constraint Patterns

```bash
# Resource requirements
bacalhau docker run \
  --constraints "mem-gb gt 16" \
  --constraints "cpu-cores gt 4" \
  --constraints "gpu-count gt 1" \
  heavy-workload

# Geographic constraints
bacalhau docker run \
  --constraints "region=eu-west" \
  --constraints "zone in (a,b,c)" \
  geo-specific-job
```

### Label Management Best Practices

#### Naming Conventions

Follow these patterns for consistent label naming:

* Use lowercase alphanumeric characters
* Separate words with hyphens
* Use descriptive prefixes for categorization

Examples:

```
team-ml-gpu
env-prod-tier1
storage-ssd-nvme
```

#### Label Hierarchies

Organize labels hierarchically for better management:

```bash
# Parent node
bacalhau serve -c Labels="tier=core,env=prod"

# Specialized child node
bacalhau serve -c Labels="tier=edge,env=prod,gpu=true"
```

### Maintenance and Operations

#### Node Updates

```bash
# Exclude nodes labeled for maintenance nodes
bacalhau job run --constraints "!maintenance" critical-job.yaml
```

#### Monitoring and Troubleshooting

```bash
# List all node labels
bacalhau node list --output json | jq '.[] | .Labels'

# Check job constraint matches
bacalhau job describe JOB_ID --include-events
```

### Security and Compliance

#### Secure Workload Placement

```bash
# Ensure compliance requirements
bacalhau run \
  --constraints "security=hipaa" \
  --constraints "keypair-present=abc-key-pair" \
  sensitive-data-job

# Network isolation
bacalhau run \
  --constraints "network=private" \
  --constraints "public-access=false" \
  internal-job
```

### Advanced Use Cases

#### Resource Optimization

```bash
# Cost-optimized scheduling
bacalhau run \
  --constraints "instance-type=spot" \
  --constraints "cost-tier=low" \
  batch-job

# Performance optimization
bacalhau run \
  --constraints "storage-type=nvme" \
  --constraints "network-speed gt 10" \
  latency-sensitive-job
```

#### Multi-team Coordination

```bash
# Shared resource access
bacalhau run \
  --constraints "team in (research,engineering)" \
  --constraints "project=genomics-2024" \
  shared-resource-job
```

### Troubleshooting Common Issues

#### No Matching Nodes

If your job fails with no matching nodes:

1.  Check available nodes and their labels:

    ```bash
    bacalhau node list --output json
    ```
2.  Verify your constraints aren't too restrictive:

    ```bash
    # Instead of
    --constraints "mem-gb gt 128"
    # Try
    --constraints "mem-gb gt 64"
    ```
3.  Ensure required nodes are online:

    ```bash
    bacalhau node list --labels "required-label=value"
    ```

#### Label Updates Not Taking Effect

Remember that label changes require node restarts. After updating labels:

1. Gracefully stop the node
2. Apply new configuration
3. Restart the node
4. Verify labels with `bacalhau node list`

### Conclusion

Effective use of Bacalhau's label and constraint system enables precise control over workload placement and resource utilization. Follow these best practices:

1. Use consistent naming conventions
2. Document your label taxonomy
3. Regularly audit and clean up unused labels
4. Test constraints before production deployment
5. Monitor constraint patterns for optimization opportunities

For additional support, consult the Bacalhau documentation or community resources.

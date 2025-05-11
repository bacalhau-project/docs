---
icon: tags
---

# Labels and Constraints

This guide provides a comprehensive overview of Bacalhau's label and constraint system, which enables fine-grained control over job scheduling and resource allocation.

## Understanding Labels and Constraints

Labels in Bacalhau are key-value pairs attached to nodes that describe their characteristics, capabilities, and properties. Constraints are rules you define when submitting jobs to ensure they run on nodes with specific labels.

## Label Configuration

### Command Line Configuration

You define labels when starting a Bacalhau node using the `-c Labels` flag:

```bash
bacalhau serve -c Labels="env=prod,gpu=true,arch=x64"
```

### Configuration File

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
bacalhau serve --config config.yaml
```

### Verifying Labels

Check node labels using:

```bash
bacalhau node list
```

## Constraint Operators

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

## Job Submission Patterns

### Basic Constraint Usage

Common patterns for submitting jobs with constraints:

```bash
# Single constraint
bacalhau docker run --constraints "env=prod" alpine

# Multiple constraints
bacalhau docker run \
  --constraints "env=prod" \
  --constraints "gpu=true" \
  nvidia/cuda:11.0-base nvidia-smi
```

### Resource-Specific Constraints

```bash
# Data processing with specific architecture requirements
bacalhau docker run \
  --constraints "arch in (x64,arm64)" \
  --constraints "mem-gb gt 16" \
  --constraints "storage-tier!=hdd" \
  my-data-processing-job

# High-memory workloads
bacalhau docker run --constraints "mem-gb gt 64" in-memory-db

# GPU workloads
bacalhau docker run \
  --constraints "gpu-model=a100" \
  --constraints "gpu-count gt 1" \
  llm-training
```

### Environment-Specific Patterns

```bash
# Production workloads
bacalhau docker run --constraints "env=prod,data-tier=hot" spark-job

# Development/testing
bacalhau docker run --constraints "env=dev" test-runner

# Geographic requirements
bacalhau docker run --constraints "region=eu,compliance=gdpr" data-processor

# Multi-zone deployments
bacalhau docker run --constraints "zone in (us-east-1a,us-east-1b)" ha-service
```

### Common Failure Scenarios

```bash
# No SSD nodes available
bacalhau docker run --constraints "disk=ssd" alpine echo "failed"

# Insufficient CPU
bacalhau docker run --constraints "cpu-cores gt 64" alpine echo "failed"
```

## Best Practices

### Naming Conventions

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

### Label Hierarchies

Organize labels hierarchically for better management:

```bash
# Parent node
bacalhau serve -c Labels="tier=core,env=prod"

# Specialized child node
bacalhau serve -c Labels="tier=edge,env=prod,gpu=true"
```

### Constraint Composition

```bash
# AND logic (all must match)
bacalhau docker run \
  --constraints "storage=ssd" \
  --constraints "cpu-arch=x64" \
  high-performance-job

# OR logic with value lists
bacalhau docker run \
  --constraints "zone in (us-east1,us-west2)" \
  multi-region-job

# Exclusion patterns
bacalhau docker run \
  --constraints "maintenance!=true" \
  time-sensitive-job
```

## Advanced Use Cases

### Security and Compliance

```bash
# Ensure compliance requirements
bacalhau docker run \
  --constraints "security=hipaa" \
  --constraints "encryption=enabled" \
  sensitive-data-job

# Network isolation
bacalhau docker run \
  --constraints "network=private" \
  --constraints "public-access=false" \
  internal-job
```

### Resource Optimization

```bash
# Cost-optimized scheduling
bacalhau docker run \
  --constraints "instance-type=spot" \
  --constraints "cost-tier=low" \
  batch-job

# Performance optimization
bacalhau docker run \
  --constraints "storage-type=nvme" \
  --constraints "network-speed gt 10" \
  latency-sensitive-job
```

### Multi-team Coordination

```bash
# Team resource allocation
bacalhau docker run \
  --constraints "team in (data,research)" \
  --constraints "project=genomics-2024" \
  shared-resource-job

# Label deprecation management
bacalhau serve -c Labels="legacy-system=phase-out,retirement-date=2025-Q1"
```

## Monitoring and Maintenance

### Label Updates

Remember that label changes require node restarts. After updating labels:

1. Gracefully stop the node
2. Apply new configuration
3. Restart the node
4. Verify labels with `bacalhau node list`

### Monitoring and Troubleshooting

```bash
# List all node labels
bacalhau node list --output json | jq 'map(.Info.Labels)'

# Check job constraint matches
bacalhau job describe JOB_ID --include-events
```

## Troubleshooting Common Issues

### No Matching Nodes

If your job fails with no matching nodes:

1. Check available nodes and their labels:
   ```bash
   bacalhau node list --output json
   ```

2. Verify your constraints aren't too restrictive:
   ```bash
   # Instead of
   --constraints "mem-gb gt 128"
   # Try
   --constraints "mem-gb gt 64"
   ```

3. Ensure required nodes are online:
   ```bash
   bacalhau node list --labels "required-label=value"
   ```

## Conclusion

Effective use of Bacalhau's label and constraint system enables precise control over workload placement and resource utilization. Follow these best practices:

1. Use consistent naming conventions
2. Document your label taxonomy
3. Regularly audit and clean up unused labels
4. Test constraints before production deployment
5. Monitor constraint patterns for optimization opportunities

For additional support, consult the Bacalhau documentation or community resources.
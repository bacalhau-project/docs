---
sidebar_position: 30
---

# Docker Containers

This guide explains how to use existing Docker containers and create custom ones for your Bacalhau workloads.

## Prerequisites

1. [Install the Bacalhau client](/getting-started/installation.mdx)
2. [Docker](https://docs.docker.com/install/) (for both building custom containers and running on compute nodes)

## Understanding Docker Workloads in Bacalhau

Bacalhau uses a syntax that closely resembles Docker, allowing you to utilize the same containers.

#### Example: Docker Command
```bash
docker run alpine echo "Hello from Docker"
```

#### Equivalent Bacalhau Command
```bash
bacalhau docker run alpine echo "Hello from Bacalhau"
```

### Getting Job Results

```bash
# View job logs
bacalhau job logs JOB_ID

# Get detailed job information
bacalhau job describe JOB_ID
```

## Requirements for Docker Containers

1. **Container Registry**: Containers must be published to a registry that is accessible to your Bacalhau nodes

## Creating a Custom Container

Let's walk through creating a simple custom Docker container for Bacalhau.

### Step 1: Create Your Container Files

Create a simple Dockerfile:

```dockerfile
FROM alpine:latest
RUN echo '#!/bin/sh\necho "Hello from $1"' > /usr/local/bin/greet && \
    chmod +x /usr/local/bin/greet
```

### Step 2: Build and Test Your Container Locally

Build your Docker image:

```bash
docker build -t your-registry/simple-greeter:latest .
```

Test it locally:

```bash
docker run --rm your-registry/simple-greeter:latest sh -c 'greet "Local Test"'
```

### Step 3: Push Your Container to a Registry

```bash
# For multi-architecture support (recommended)
docker buildx build --platform linux/amd64,linux/arm64 --push -t your-registry/simple-greeter:latest .

# For single architecture
docker push your-registry/simple-greeter:latest
```

## Running Your Custom Container on Bacalhau

Run your container on Bacalhau:

```bash
bacalhau docker run your-registry/simple-greeter:latest \
  sh -c 'greet "Bacalhau"'
```

View your job logs:

```bash
bacalhau job logs JOB_ID
```
# Python Scripts

This tutorial shows how to run a simple Python script on Bacalhau. You'll execute a "Hello, World!" Python script using Bacalhau's distributed compute platform.

## Prerequisites

To get started, [install the Bacalhau client](broken-reference)

## 1. Create a Simple Python Script

Let's start with a basic Python script. Create a file called `hello-world.py`:

```python
# hello-world.py
print("Hello, world!")
```

Test it locally:

```bash
python3 hello-world.py
```

## 2. Running on Bacalhau

Now let's run the same script on Bacalhau. You can either use a local file or a URL.

### Using a Local File

```bash
bacalhau docker run \
  --input ./hello-world.py:/inputs/hello-world.py \
  python:3.10-slim \
  python3 /inputs/hello-world.py
```

### Using a URL

```bash
bacalhau docker run \
  --input https://raw.githubusercontent.com/bacalhau-project/examples/main/workload-onboarding/trivial-python/hello-world.py:/inputs/hello-world.py \
  python:3.10-slim \
  python3 /inputs/hello-world.py
```

This command:
1. Uses the official Python Docker image
2. Mounts the script at `/inputs/hello-world.py` inside the container
3. Runs the script with `python3`

## 3. Checking Job Status and Output

### View Job Status

Check the status of your job:

```bash
bacalhau job list --id-filter JOB_ID
```

### View Job Details

Get more information about your job:

```bash
bacalhau job describe JOB_ID
```

### View Job Output

See the output from your script:

```bash
bacalhau job logs JOB_ID
```

## 4. Using a YAML Job Description

You can also describe your job in YAML format:

```yaml
name: Python Hello World
type: batch
count: 1
tasks:
  - name: main
    Engine:
      type: docker
      params:
        Image: python:3.10-slim
        Parameters:
          - python3
          - /inputs/hello-world.py
    InputSources:
      - Target: /inputs
        Source:
          Type: urlDownload
          Params:
            URL: https://raw.githubusercontent.com/bacalhau-project/examples/main/workload-onboarding/trivial-python/hello-world.py
            Path: /inputs/hello-world.py
```

Save this to `hello-world.yaml` and run:

```bash
bacalhau job run hello-world.yaml
```

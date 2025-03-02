# Quick Start

This Quick Start guide shows how to run your first Bacalhau job with minimal setup. Bacalhau's design as a single self-contained binary makes it incredibly easy to set up your own distributed compute network in minutes.

### Prerequisites

* Docker installed on any machine that runs a compute node
* Bacalhau CLI installed (see below)

### 1. Installation

1. Install Bacalhau using the one-liner below (Linux/macOS) or see the [installation guide](quick-start.md#id-1.-installation) for Windows and Docker options.

```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```

2. Once installed, verify with:

```bash
bacalhau version
```



### 2. Start a Hybrid Node

Open a terminal and run:

```bash
bacalhau serve --orchestrator --compute
```

* This command launches both an orchestrator and a compute node in one process
* Keep it running; you'll see logs indicating it's ready

### 3. Submit a Data Analysis Job

Bacalhau supports two primary methods of job submission: Imperative (CLI) and Declarative (YAML). We'll demonstrate a word count job on the classic novel Moby Dick.

{% tabs %}
{% tab title="Imperative (CLI)" %}
```bash
bacalhau docker run \
  --input https://www.gutenberg.org/files/2701/2701-0.txt:/data/moby-dick.txt \
  --output outputs:/outputs \
  --publisher local \
  ghcr.io/bacalhau-project/word-count:latest -- --output-file /outputs/moby-dick-counts.txt /data/moby-dick.txt
```
{% endtab %}

{% tab title="Declarative (YAML)" %}
Create a `word-count.yaml` file:

```yaml
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ghcr.io/bacalhau-project/word-count:latest
        Parameters:
        - --output-file
        - /outputs/moby-dick-counts.txt
        - /data/moby-dick.txt
    Publisher:
      Type: local
    InputSources:
      - Alias: input_custom
        Target: /data/moby-dick.txt
        Source:
          Type: urlDownload
          Params:
            URL: https://www.gutenberg.org/files/2701/2701-0.txt
    ResultPaths:
    - Name: outputs
      Path: /outputs
```

Then run the job using:

```bash
bacalhau job run word-count.yaml
```
{% endtab %}
{% endtabs %}

* The job downloads a sample dataset and processes it locally
* Bacalhau will display job progress until completion
* You'll receive a Job ID once the job is submitted

### 4. Inspect the Job

```bash
bacalhau job describe <jobID>
```

* Replace `<jobID>` with the actual ID printed in step 2
* You can run `bacalhau job logs <job-id>` to just get the execution logs

### 5. Retrieve Results

Download and view your job results:

```bash
# Download the results
bacalhau job get <jobID>

# View the analysis output
head job-*/outputs/moby-dick-counts.txt
```

> **Note:** You should see a word frequency analysis of the Moby Dick text file!



### 🎉 Success!

You've just:

1. Started a local Bacalhau network
2. Submitted a job using both imperative and declarative methods
3. Tracked job progress with detailed descriptions
4. Retrieved and viewed job results

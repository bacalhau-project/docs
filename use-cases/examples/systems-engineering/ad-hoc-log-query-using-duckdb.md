---
icon: square-divide
---

# Ad-hoc log query using DuckDB

## Remote Log Analysis using DuckDB and Bacalhau

This guide provides an overview of using DuckDB with Bacalhau for remote log analysis. By leveraging these tools, you can perform detailed analyses without the need to download datasets locally.

### Overview

DuckDB is a powerful in-memory SQL database management system ideal for data analytics. Bacalhau facilitates decentralized job execution, meaning you can run jobs remotely without having to log in or build complicated services. Together, they make a powerful tool for remote, ad-hoc server interaction.

### Prerequisites

* You will need a Bacalhau cluster with the following configuration:

```
NameProvider: "uuid"
Compute:
  Enabled: true
  Orchestrators:
    - nats://<YOUR_ORCHESTRATOR_IP_HERE>:4222
  Auth:
    Token: YOUR_TOKEN
  TLS:
    RequireTLS: true
  AllowListedLocalPaths:
    - /var/log/logs_to_process:rw
JobAdmissionControl:
  AcceptNetworkedJobs: true
```

***

### 1. Run a DuckDB job on Bacalhau

To run a DuckDB job on Bacalhau, all you need to do is use the DuckDB container. To submit a job, run the following command:

```bash
bacalhau docker run \
  davidgasquez/datadex:v0.2.0 \
  -- duckdb -s "select 1")
```

#### Structure of the Command

1. **bacalhau docker run**: command to run a Docker container on Bacalhau
2. **davidgasquez/datadex:v0.2.0**: name and tag of the Docker image
3. **duckdb -s "select 1"**: the DuckDB CLI command to execute

When a job is submitted, Bacalhau prints out the related `job_id`. We store that ID in an environment variable (`JOB_ID`) so that we can reuse it later on.

***

### 3. Declarative Job Description

The same job can be submitted in a declarative format. Create a YAML file (e.g., `duckdb1.yaml`) with the following content:

```yaml
yamlCopy codename: DuckDB Hello World
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: davidgasquez/datadex:v0.2.0
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - duckdb -s "select 1"
```

Then run the command:

```bash
bashCopy codebacalhau job run duckdb1.yaml
```

***

### 4. Checking the State of Your Jobs

*   **Job Status**\
    Check the status of the job:

    ```bash
    bashCopy codebacalhau job list --id-filter ${JOB_ID}
    ```

    When it says `Published` or `Completed`, the job is done, and we can fetch the results.
*   **Job Information**\
    Get more details about your job:

    ```bash
    bashCopy codebacalhau job describe ${JOB_ID}
    ```
*   **Job Download**\
    Download your job results:

    ```bash
    bashCopy coderm -rf results && mkdir -p results
    bacalhau job get $JOB_ID --output-dir results
    ```

***

### 5. Viewing Your Job Output

Each job creates 3 subfolders in your results directory:

1. `combined_results`
2. `per_shard`
3. `raw`

To view the output file:

```bash
bashCopy codecat results/stdout
```

**Expected output:**

```
Copy code┌───┐
│ 1 │
├───┤
│ 1 │
└───┘
```

***

### 6. Running Arbitrary SQL Commands

Below is an example command to run arbitrary SQL queries against the NYC Yellow Taxi Trips dataset. This dataset is hosted on IPFS for demonstration purposes.

```bash
bashCopy codeexport JOB_ID=$(bacalhau docker run \
  -i ipfs://bafybeiejgmdpwlfgo3dzfxfv3cn55qgnxmghyv7vcarqe3onmtzczohwaq \
  --workdir /inputs \
  --id-only \
  --wait \
  davidgasquez/duckdb:latest \
  -- duckdb -s "select count(*) from '0_yellow_taxi_trips.parquet'")
```

#### Structure of the Command

1. **bacalhau docker run**: command to run a Docker container on Bacalhau
2. **-i ipfs://...**: specifying IPFS CIDs so Bacalhau can mount the data at `/inputs`
3. **--workdir /inputs**: sets the working directory inside the container to `/inputs`
4. **davidgasquez/duckdb:latest**: Docker image with DuckDB installed
5. **duckdb -s**: the DuckDB CLI command to execute

***

### 7. Declarative Job Description for Arbitrary SQL

You can also present the above job in YAML format. For example, `duckdb2.yaml`:

```yaml
yamlCopy codename: DuckDB Parquet Query
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        WorkingDirectory: "/inputs"
        Image: davidgasquez/duckdb:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - duckdb -s "select count(*) from '0_yellow_taxi_trips.parquet'"
    InputSources:
      - Target: "/inputs"
        Source:
          Type: "s3"
          Params:
            Bucket: "bacalhau-duckdb"
            Key: "*"
            Region: "us-east-1"
```

Then run:

```bash
bashCopy codebacalhau job run duckdb2.yaml
```

***

### 8. Checking Job Status, Describing, Downloading Results

*   **Job Status**

    ```bash
    bashCopy codebacalhau job list --id-filter ${JOB_ID} --wide
    ```
*   **Job Information**

    ```bash
    bashCopy codebacalhau job describe ${JOB_ID}
    ```
*   **Job Download**

    ```bash
    bashCopy coderm -rf results && mkdir -p results
    bacalhau job get $JOB_ID --output-dir results
    ```

#### Viewing Your Job Output

```bash
bashCopy codecat results/stdout
```

Sample output might look like this:

```scss
scssCopy code┌──────────────┐
│ count_star() │
│    int64     │
├──────────────┤
│     24648499 │
└──────────────┘
```

***

### Need Support?

If you have questions or need support or guidance, please reach out to the Bacalhau team via Slack (look for the #general channel).

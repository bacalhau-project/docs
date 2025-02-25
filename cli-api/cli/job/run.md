# Run

## Description

The `bacalhau job run` command facilitates the initiation of a job from a file or directly from the standard input (stdin). The command supports both JSON and YAML data formats. This command is particularly useful for quickly executing a job without the need for manual configurations.

## Usage

```
bacalhau job run [flags]
```

## Flags

* `--dry-run`:
  * Description: With this flag, the job will not be submitted. Instead, it will display what would have been submitted, providing a way to preview before actual submission.
* `-f`, `--follow`:
  * Description: If provided, the command will continuously display the output from the job as it runs.
* `--id-only`:
  * Description: On successful job submission, only the Job ID will be printed.
* `--node-details`:
  * Description: Displays details of all nodes. Note that this flag is overridden if `--id-only` is provided.
* `--show-warnings`:
  * Description: Shows any warnings that occur during the job submission.
* `--wait`:
  * Description: Waits for the job to finish execution. To set this to false, use --wait=false
  * Default: `true`
* `--wait-timeout-secs int`:
  * Description: If `--wait` is provided, this flag sets the maximum time (in seconds) the command will wait for the job to finish before it terminates.
  * Default: `600` seconds
* `-h`, `--help`:
  * Description: Displays help information for the `run` command.

## Global Flags

* `--api-host string`:
  * Description: Specifies the host used for RESTful communication between the client and server. The flag is disregarded if `BACALHAU_API_HOST` environment variable is set.
  * Default: `bootstrap.production.bacalhau.org`
* `--api-port int`:
  * Description: Determines the port for REST communication. If `BACALHAU_API_PORT` environment variable is set, this flag will be ignored.
  * Default: `1234`
* `--log-mode logging-mode`:
  * Description: Selects the desired log format. Options include: `default`, `station`, `json`, `combined`, and `event`.
  * Default: `default`
* `--repo string`:
  * Description: Defines the path to the bacalhau repository.
  * Default: `$HOME/.bacalhau`

## Examples

**Sample Job (`job.yaml`)**

A sample job used in the following examples is provided below:

```bash
cat job.yaml
```

```yaml
name: A Simple Docker Job
type: batch
count: 1
tasks:
  - name: My main task
    engine:
      type: docker
      params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo Hello Bacalhau!
```

This configuration describes a batch job that runs a Docker task. It utilizes the `ubuntu:latest` image and executes the command `echo Hello Bacalhau!`.

1.  **Running a Job using a YAML Configuration**:

    To run a job with a configuration provided in a `job.yaml` file:

    **Command:**

    ```bash
    bacalhau job run job.yaml
    ```

    **Expected Output:**

    ```plaintext
    Job successfully submitted. Job ID: j-2d0f513a-9eb1-49c2-8bc8-246c6fb41520
    Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

     Communicating with the network  ................  done ✅  0.1s
        Creating job for submission  ................  done ✅  0.6s

    To get more details about the run, execute:
     bacalhau job describe j-2d0f513a-9eb1-49c2-8bc8-246c6fb41520

    To get more details about the run executions, execute:
     bacalhau job executions j-2d0f513a-9eb1-49c2-8bc8-246c6fb41520
    ```
2.  **Running a Job and Following its Logs**:

    **Command:**

    ```bash
    bacalhau job run job.yaml --follow
    ```

    **Expected Output:**

    ```plaintext
    Job successfully submitted. Job ID: j-b89df816-7564-4f04-b270-e6cda89eda72
    Waiting for logs... (Enter Ctrl+C to exit at any time, your job will continue running):

    Hello Bacalhau!
    ```
3.  **Running a Job Without Waiting**:

    **Command:**

    ```bash
    bacalhau job run job.yaml --wait=false
    ```

    **Expected Output:**

    ```plaintext
    j-3fd396b3-e92e-42ca-bd87-0dc9eb15e6f9
    ```
4.  **Fetching Only the Job ID Upon Submission**:

    **Command:**

    ```bash
    bacalhau job run job.yaml --id-only
    ```

    **Expected Output:**

    ```plaintext
    j-5976ffb6-3465-4fec-8b3b-2c822cbaf417
    ```
5.  **Fetching Only the Job ID and Wait for Completion**:

    **Command:**

    ```bash
    bacalhau job run job.yaml --id-only --wait
    ```

    **Expected Output:**

    ```plaintext
    j-293f1302-3298-4aca-b06d-33fd1e3f9d2c
    ```
6.  **Running a Job with Node Details**:

    **Command:**

    ```bash
    bacalhau job run job.yaml --node-details
    ```

    **Expected Output:**

    ```plaintext
    Job successfully submitted. Job ID: j-05e65dd3-4e9e-4e20-a104-3c91ba934435
    Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

     Communicating with the network  ................  done ✅  0.1s
        Creating job for submission  ................  done ✅  0.6s

    Job Results By Node:
    • Node QmVXwmdZ:
     Hello Bacalhau!

    To get more details about the run, execute:
     bacalhau job describe j-05e65dd3-4e9e-4e20-a104-3c91ba934435

    To get more details about the run executions, execute:
     bacalhau job executions j-05e65dd3-4e9e-4e20-a104-3c91ba934435
    ```
7.  **Rerunning a previously submitting job**:

    **Command:**

    ```bash
    bacalhau job describe j-05e65dd3-4e9e-4e20-a104-3c91ba934435 | bacalhau job run
    ```

    **Expected Output:**

    ```plaintext
    Reading from /dev/stdin; send Ctrl-d to stop.Job successfully submitted. Job ID: j-d8625929-83f4-411a-b9aa-7bcfecb27a8b
    Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

     Communicating with the network  ................  done ✅  0.1s
        Creating job for submission  ................  done ✅  0.6s

    To get more details about the run, execute:
     bacalhau job describe j-d8625929-83f4-411a-b9aa-7bcfecb27a8b

    To get more details about the run executions, execute:
     bacalhau job executions j-d8625929-83f4-411a-b9aa-7bcfecb27a8b
    ```

## Job Templating

The `bacalhau job run` command also supports templating, which allows users to dynamically inject variables into their job specifications. Additional flags related to templating include:

* `--no-template`:
  * Description: Disable the templating feature. When this flag is set, the job spec will be used as-is, without any placeholder replacements.
* `-E, --template-envs`:
  * Description: Specify a regular expression pattern for selecting environment variables to be included as template variables in the job spec. e.g. `--template-envs ".*"` will include all environment variables.
* `-V, --template-vars`:
  * Description: Replace a placeholder in the job spec with a value. e.g. `--template-vars foo=bar`

### Overview

Templating is particularly useful when running multiple jobs with varying parameters such as DuckDB query, S3 buckets, prefixes, and time ranges without the need to edit each job specification file manually.

### Templating Implementation

The templating functionality in Bacalhau is built upon the Go text/template package. This powerful library offers a wide range of features for manipulating and formatting text based on template definitions and input variables.

For more detailed information about the Go text/template library and its syntax, please refer to the official documentation: [Go text/template Package](https://golang.org/pkg/text/template/).

### Basic Templating Example

**Sample Job Spec with Templating Variables**:

```yaml
Name: docker job
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ubuntu:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo {{.greeting}} {{.name}}
```

**Running with Templating**:

```
bacalhau job run job.yaml --template-vars "greeting=Hello,name=World"
```

**Defining Flag Multiple Times**:

```
bacalhau job run job.yaml --template-vars "greeting=Hello" --template-vars "name=World"
```

**Disabling Templating**:

```
bacalhau job run job.yaml --no-template
```

### Using Environment Variables for Templates

You can also use environment variables for templating:

```
export greeting=Hello
export name=World
bacalhau job run job.yaml --template-envs "*"
```

**Passing A Subset of Environment Variables**:

```
bacalhau job run job.yaml --template-envs "greeting|name"
```

### Dry Run to Preview Templated Spec

To preview the final templated job spec without actually submitting the job, you can use the `--dry-run` flag:

```
bacalhau job run job.yaml --template-vars "greeting=Hello,name=World" --dry-run
```

This will output the processed job specification, showing you how the placeholders have been replaced with the provided values.

### Advanced Templating Examples

#### Query Live Logs

```yaml
Name: Live logs processing
Type: ops
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: expanso/nginx-access-log-processor:1.0.0
        Parameters:
          - --query
          - {{.query}}
          - --start-time
          - {{or (index . "start-time") ""}}
          - --end-time
          - {{or (index . "end-time") ""}}
    InputSources:
      - Target: /logs
        Source:
          Type: localDirectory
          Params:
            SourcePath: /data/log-orchestration/logs
```

This is an ops job that runs on all nodes that match the job selection criteria. It accepts duckdb query variable, and two optional start-time and end-time variables to define the time range for the query.

To run this job, you can use the following command:

```
bacalhau job run job.yaml \
  -V "query=SELECT status FROM logs WHERE status LIKE '5__'" \
  -V "start-time=-5m"
```

#### Query S3 Logs

```yaml
Name: S3 logs processing
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: expanso/nginx-access-log-processor:1.0.0
        Parameters:
          - --query
          - {{.query}}
    InputSources:
      - Target: /logs
        Source:
          Type: s3
          Params:
            Bucket: {{.AccessLogBucket}}
            Key: {{.AccessLogPrefix}}
            Filter: {{or (index . "AccessLogPattern") ".*"}}
            Region: {{.AWSRegion}}
```

This is a batch job that runs on a single node. It accepts the duckdb query variable, and four other variables to define the S3 bucket, prefix, and pattern for the logs and the AWS region.

To run this job, you can use the following command:

```
bacalhau job run job.yaml  \
    -V "AccessLogBucket=my-bucket" \
    -V "AWSRegion=us-east-1" \
    -V "AccessLogPrefix=2023-11-19-*"  \
    -V "AccessLogPattern=^[10-12].*"
```

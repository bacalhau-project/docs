# Running a Python Script

This tutorial serves as an introduction to Bacalhau. In this example, you'll be executing a simple "Hello, World!" Python script hosted on a website on Bacalhau.

## Prerequisites[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#prerequisites) <a href="#prerequisites" id="prerequisites"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../../getting-started/installation.md)

## 1. Running Python Locally[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#1-running-python-locally) <a href="#id-1-running-python-locally" id="id-1-running-python-locally"></a>

We'll be using a very simple Python script that displays the [traditional first greeting](https://en.wikipedia.org/wiki/%22Hello,\_World!%22\_program). Create a file called `hello-world.py`:

```python
# hello-world.py
print("Hello, world!")
```

Running the script to print out the output:

```python
python3 hello-world.py
```

After the script has run successfully locally we can now run it on Bacalhau.

## 2. Running a Bacalhau Job[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#2-running-a-bacalhau-job) <a href="#id-2-running-a-bacalhau-job" id="id-2-running-a-bacalhau-job"></a>

To submit a workload to Bacalhau you can use the `bacalhau docker run` command. This command allows passing input data into the container using [content identifier (CID)](https://github.com/multiformats/cid) volumes, we will be using the `--input URL:path` [argument](../../../references/cli-reference/all-flags.md#docker-run) for simplicity. This results in Bacalhau mounting a _data volume_ inside the container. By default, Bacalhau mounts the input volume at the path `/inputs` inside the container.

{% hint style="info" %}
[Bacalhau overwrites the default entrypoint](https://github.com/bacalhau-project/bacalhau/blob/v0.2.3/cmd/bacalhau/docker\_run.go#L64), so we must run the full command after the `--` argument.
{% endhint %}

```bash
export JOB_ID=$(bacalhau docker run \
    --id-only \
    --input https://raw.githubusercontent.com/bacalhau-project/examples/151eebe895151edd83468e3d8b546612bf96cd05/workload-onboarding/trivial-python/hello-world.py \
    python:3.10-slim \
    -- python3 /inputs/hello-world.py)
```

#### Structure of the command[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

1. `bacalhau docker run`: call to Bacalhau
2. `--id-only`: specifies that only the job identifier (job\_id) will be returned after executing the container, not the entire output
3. `--input https://raw.githubusercontent.com/bacalhau-project/examples/151eebe895151edd83468e3d8b546612bf96cd05/workload-onboarding/trivial-python/hello-world.py \`: indicates where to get the input data for the container. In this case, the input data is downloaded from the specified URL, which represents the Python script "hello-world.py".
4. `python:3.10-slim`: the Docker image that will be used to run the container. In this case, it uses the Python 3.10 image with a minimal set of components (slim).
5. `--`: This double dash is used to separate the Bacalhau command options from the command that will be executed inside the Docker container.
6. `python3 /inputs/hello-world.py`: running the `hello-world.py` Python script stored in `/inputs`.

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

#### Declarative job description[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#declarative-job-description) <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../jobs/job.md) format. In this case, the description will look like this:

```yaml
name: Running Trivial Python
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: python:3.10-slim
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - python3 /inputs/hello-world.py
    InputSources:
      - Target: /inputs
        Source:
          Type: urlDownload
          Params:
            URL: https://raw.githubusercontent.com/bacalhau-project/examples/151eebe895151edd83468e3d8b546612bf96cd05/workload-onboarding/trivial-python/hello-world.py
            Path: /inputs/hello-world.py
```

The job description should be saved in `.yaml` format, e.g. `helloworld.yaml`, and then run with the command:

```
bacalhau job run helloworld.yaml
```

## 3. Checking the State of your Jobs[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#3-checking-the-state-of-your-jobs) <a href="#id-3-checking-the-state-of-your-jobs" id="id-3-checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau list`.

```
bacalhau list --id-filter ${JOB_ID} --no-style
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```
rm -rf results && mkdir results
bacalhau get ${JOB_ID} --output-dir results
```

## 4. Viewing your Job Output[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#4-viewing-your-job-output) <a href="#id-4-viewing-your-job-output" id="id-4-viewing-your-job-output"></a>

To view the file, run the following command:

```
cat results/stdout
```

### Support[​](http://localhost:3000/setting-up/workload-onboarding/Python/Python%20File#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

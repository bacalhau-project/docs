# Running a Simple R Script on Bacalhau

You can use official Docker containers for each language, like R or Python. In this example, we will use the official R container and run it on Bacalhau.

In this tutorial example, we will run a "hello world" R script on Bacalhau.

### Prerequisites[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#prerequisites) <a href="#prerequisites" id="prerequisites"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../../getting-started/installation.md)

### 1. Running an R Script Locally[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#1-running-an-r-script-locally) <a href="#id-1-running-an-r-script-locally" id="id-1-running-an-r-script-locally"></a>

To install R follow these instructions [A Installing R and RStudio | Hands-On Programming with R](https://rstudio-education.github.io/hopr/starting.html). After R and RStudio are installed, create and run a script called `hello.R`:

```r
# hello.R
print("hello world")
```

Run the script:

```bash
Rscript hello.R
```

Next, upload the script to your public storage (in our case, IPFS). We've already uploaded the script to IPFS and the CID is: `QmVHSWhAL7fNkRiHfoEJGeMYjaYZUsKHvix7L54SptR8ie`. You can look at this by browsing to one of the HTTP IPFS proxies like [ipfs.io](https://ipfs.tech/) or [w3s.link](https://github.com/web3-storage/w3link).

### 2. Running a Job on Bacalhau[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#2-running-a-job-on-bacalhau) <a href="#id-2-running-a-job-on-bacalhau" id="id-2-running-a-job-on-bacalhau"></a>

Now it's time to run the script on Bacalhau:

```
export JOB_ID=$(bacalhau docker run \
    --wait \
    --id-only \
    -i ipfs://QmQRVx3gXVLaRXywgwo8GCTQ63fHqWV88FiwEqCidmUGhk:/hello.R \
    r-base \
    -- Rscript hello.R)
```

#### Structure of the command[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

1. `bacalhau docker run`: call to Bacalhau
2. `i ipfs://QmQRVx3gXVLaRXywgwo8GCTQ63fHqWV88FiwEqCidmUGhk:/hello.R`: Mounting the uploaded dataset at `/inputs` in the execution. It takes two arguments, the first is the IPFS CID (`QmQRVx3gXVLaRXywgwo8GCTQ63fHqWV88FiwEqCidmUGhk`) and the second is file path within IPFS (`/hello.R`)
3. `r-base`: docker official image we are using
4. `Rscript hello.R`: execute the R script

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on:

#### Declarative job description[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#declarative-job-description) <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../../references/jobs/task/job.md) format. In this case, the description will look like this:

```
name: Running a Simple R Script
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: r-base:latest
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c        
          - Rscript /hello.R
    InputSources:
      - Target: "/"
        Source:
          Type: urlDownload
          Params:
            URL: https://raw.githubusercontent.com/bacalhau-project/examples/main/scripts/hello.R
            Path: /hello.R
```

The job description should be saved in `.yaml` format, e.g. `rhello.yaml`, and then run with the command:

```
bacalhau job run rhello.yaml
```

### 3. Checking the State of your Jobs[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#3-checking-the-state-of-your-jobs) <a href="#id-3-checking-the-state-of-your-jobs" id="id-3-checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID}
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe  ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir results
bacalhau job get ${JOB_ID} --output-dir results
```

### 4. Viewing your Job Output[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#4-viewing-your-job-output) <a href="#id-4-viewing-your-job-output" id="id-4-viewing-your-job-output"></a>

To view the file, run the following command:

```bash
cat results/stdout
```

#### Futureproofing your R Scripts[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#futureproofing-your-r-scripts) <a href="#futureproofing-your-r-scripts" id="futureproofing-your-r-scripts"></a>

You can generate the job request using `bacalhau job describe` with the `--spec` flag. This will allow you to re-run that job in the future:

```bash
bacalhau job describe ${JOB_ID} --spec > job.yaml
```

```bash
cat job.yaml
```

### Support[​](http://localhost:3000/setting-up/workload-onboarding/r-hello-world/#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

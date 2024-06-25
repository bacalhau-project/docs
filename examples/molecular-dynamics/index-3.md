# Genomics Data Generation

## Introduction[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#introduction) <a href="#introduction" id="introduction"></a>

Kipoi _(pronounce: kípi; from the Greek κήποι: gardens)_ is an API and a repository of ready-to-use trained models for genomics. It currently contains 2201 different models, covering canonical predictive tasks in transcriptional and post-transcriptional gene regulation. Kipoi's API is implemented as a [python package](https://github.com/kipoi/kipoi), and it is also accessible from the command line.

In this tutorial example, we will run a genomics model on Bacalhau.

## Prerequisite[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Running Locally​[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#running-locally) <a href="#running-locally" id="running-locally"></a>

To run locally you need to install kipoi-veff2. You can find out the information about installing and usage [here](https://github.com/kipoi/kipoi-veff2/blob/main/README.md)

In our case this will be the following command:

```bash
kipoi_veff2_predict ./examples/input/test.vcf ./examples/input/test.fa ./output.tsv -m "DeepSEA/predict" -s "diff" -s "logit"
```

## Containerize Script using Docker[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#containerize-script-using-docker) <a href="#containerize-script-using-docker" id="containerize-script-using-docker"></a>

To run Genomics on Bacalhau we need to set up a Docker container. To do this, you'll need to create a `Dockerfile` and add your desired configuration. The Dockerfile is a text document that contains the commands that specify how the image will be built.

```docker
FROM kipoi/kipoi-veff2:py37

RUN kipoi_veff2_predict ./examples/input/test.vcf ./examples/input/test.fa ./output.tsv -m "DeepSEA/predict" -s "diff" -s "logit"
```

We will use the `kipoi/kipoi-veff2:py37` image and perform variant-centered effect prediction using the `kipoi_veff2_predict` tool.

{% hint style="info" %}
See more information on how to containerize your script/app [here](https://docs.docker.com/get-started/02\_our\_app/)
{% endhint %}

### Build the container[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#build-the-container) <a href="#build-the-container" id="build-the-container"></a>

The `docker build` command builds Docker images from a Dockerfile.

```bash
docker build -t <hub-user>/<repo-name>:<tag> .
```

Before running the command replace:

**`hub-user`** with your docker hub username. If you don’t have a docker hub account [follow these instructions to create a Docker Account](https://docs.docker.com/docker-id/), and use the username of the account you created

**`repo-name`** with the name of the container, you can name it anything you want

**`tag`** this is not required but you can use the latest tag

In our case:

```bash
docker build -t jsacex/kipoi-veff2:py37 .
```

### Push the container[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#push-the-container) <a href="#push-the-container" id="push-the-container"></a>

Next, upload the image to the registry. This can be done by using the Docker hub username, repo name or tag.

```bash
docker push <hub-user>/<repo-name>:<tag>
```

## Running a Bacalhau job[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#running-a-bacalhau-job) <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

After the repo image has been pushed to Docker Hub, we can now use the container for running on Bacalhau. To submit a job for generating genomics data, run the following Bacalhau command:

```bash
export JOB_ID=$(bacalhau docker run \
    --id-only \
    --memory 20Gb \
    --wait \
    --timeout 3600 \
    --wait-timeout-secs 3600 \
    jsacex/kipoi-veff2:py37 \
    -- kipoi_veff2_predict ./examples/input/test.vcf ./examples/input/test.fa ../outputs/output.tsv -m "DeepSEA/predict" -s "diff" -s "logit")
```

### Structure of the command[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Let's look closely at the command above:

1. `bacalhau docker run`: call to Bacalhau
2. `jsacex/kipoi-veff2:py37`: the name of the image we are using
3. `kipoi_veff2_predict ./examples/input/test.vcf ./examples/input/test.fa ../outputs/output.tsv -m "DeepSEA/predict" -s "diff" -s "logit"`: the command that will be executed inside the container. It performs variant-centered effect prediction using the kipoi\_veff2\_predict tool
4. `./examples/input/test.vcf`: the path to a Variant Call Format (VCF) file containing information about genetic variants
5. `./examples/input/test.fa`: the path to a FASTA file containing DNA sequences. FASTA files contain nucleotide sequences used for variant effect prediction
6. `../outputs/output.tsv`: the path to the output file where the prediction results will be stored. The output file format is Tab-Separated Values (TSV), and it will contain information about the predicted variant effects
7. `-m "DeepSEA/predict"`: specifies the model to be used for prediction
8. `-s "diff" -s "logit"`: indicates using two scoring functions for comparing prediction results. In this case, the "diff" and "logit" scoring functions are used. These scoring functions can be employed to analyze differences between predictions for the reference and alternative alleles.

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

## Checking the State of your Jobs[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID} --wide
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau describe`.

```bash
bacalhau describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau get $JOB_ID --output-dir results
```

## Viewing your Job Output[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#viewing-your-job-output) <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

To view the file, run the following command:

```bash
cat results/outputs/output.tsv | head -n 10  
```

## Support[​](http://localhost:3000/examples/molecular-dynamics/Genomics/#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

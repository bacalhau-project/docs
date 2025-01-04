# Gromacs for Analysis

## Introduction​ <a href="#introduction" id="introduction"></a>

GROMACS is a package for high-performance molecular dynamics and output analysis. Molecular dynamics is a computer simulation method for analyzing the physical movements of atoms and molecules

In this example, we will make use of [gmx pdb2gmx](https://manual.gromacs.org/documentation/current/onlinehelp/gmx-pdb2gmx.html#description) program to add hydrogens to the molecules and generates coordinates in Gromacs (Gromos) format and topology in Gromacs format.

In this example tutorial, our focus will be on running Gromacs package with Bacalhau

## Prerequisites​ <a href="#prerequisites" id="prerequisites"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation/)

## Downloading datasets​ <a href="#downloading-datasets" id="downloading-datasets"></a>

Datasets can be found here [https://www.rcsb.org](https://www.rcsb.org/), In this example we use [RCSB PDB - 1AKI](https://www.rcsb.org/structure/1AKI) dataset. After downloading, place it in a folder called “input”

```bash
input
└── 1AKI.pdb
```

## Uploading the datasets to IPFS​ <a href="#uploading-the-datasets-to-ipfs" id="uploading-the-datasets-to-ipfs"></a>

The simplest way to upload the data to IPFS is to use a third-party service to "pin" data to the IPFS network, to ensure that the data exists and is available. To do this you need an account with a pinning service like [NFT.storage](https://nft.storage/) or [Pinata](https://pinata.cloud/). Once registered you can use their UI or API or SDKs to upload files.

Alternatively, you can upload your dataset to IPFS using [IPFS CLI](https://docs.ipfs.tech/install/command-line/#official-distributions):

```bash
ipfs add -r input/

added QmTCCqPzX3qSJHuMeSma9uCqUnriZ5eJX7MnxebxydL89f input/1AKI.pdb
added QmeeEB1YMrG6K8z43VdsdoYmQV46gAPQCHotZs9pwusCm9 input
 113.59 KiB / 113.59 KiB [=================================] 100.00%
```

Copy the CID in the end which is `QmeeEB1YMrG6K8z43VdsdoYmQV46gAPQCHotZs9pwusCm9`

## Running Bacalhau Job​ <a href="#running-bacalhau-job" id="running-bacalhau-job"></a>

Let's run a Bacalhau job that converts coordinate files to topology and FF-compliant coordinate files:

```bash
export JOB_ID=$(bacalhau docker run \
    --id-only \
    --wait \
    --timeout 3600 \
    --wait-timeout-secs 3600 \
    -i ipfs://QmeeEB1YMrG6K8z43VdsdoYmQV46gAPQCHotZs9pwusCm9:/input \
    gromacs/gromacs \
    -- /bin/bash -c 'echo 15 | gmx pdb2gmx -f input/1AKI.pdb -o outputs/1AKI_processed.gro -water spc')
```

### Structure of the command​ <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Lets look closely at the command above:

1. `bacalhau docker run`: call to Bacalhau
2. `-i ipfs://QmeeEB1YMrG6K8z43VdsdoYmQV46gAPQCHotZs9pwusCm9:/input`: here we mount the CID of the dataset we uploaded to IPFS to use on the job
3. `gromacs/gromacs`: we use the official [gromacs - Docker Image](https://hub.docker.com/r/gromacs/gromacs)
4. `gmx pdb2gmx`: command in GROMACS that performs the conversion of molecular structural data from the Protein Data Bank (PDB) format to the GROMACS format, which is used for conducting Molecular Dynamics (MD) simulations and analyzing the results. Additional parameters could be found here [gmx pdb2gmx — GROMACS 2022.2 documentation](https://manual.gromacs.org/documentation/current/onlinehelp/gmx-pdb2gmx.html)
5. `-f input/1AKI.pdb`: input file
6. `-o outputs/1AKI_processed.gro`: output file
7. `-water` Water model to use. In this case we use `spc`

{% hint style="info" %}
For a similar tutorial that you can try yourself, check out [KALP-15 in DPPC - GROMACS Tutorial](http://www.mdtutorials.com/gmx/membrane_protein/01_pdb2gmx.html)
{% endhint %}

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

### Declarative job description​ <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](http://localhost:3000/setting-up/jobs/job-specification/job) format. In this case, the description will look like this:

```yaml
name: Gromacs
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: gromacs/gromacs
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - echo 15 | gmx pdb2gmx -f input/1AKI.pdb -o outputs/1AKI_processed.gro -water spc
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs      
    InputSources:
      - Target: "/input"
        Source:
          Type: "s3"
          Params:
            Bucket: "bacalhau-gromacs"
            Key: "*"
            Region: "us-east-1"
```

The job description should be saved in `.yaml` format, e.g. `gromacs.yaml`, and then run with the command:

```bash
bacalhau job run gromacs.yaml
```

## Checking the State of your Jobs​ <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID} --wide
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau job get $JOB_ID --output-dir results
```

## Viewing your Job Output​ <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

To view the file, run the following command:

```bash
cat results/outputs/1AKI_processed.gro  
```

## Support​ <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

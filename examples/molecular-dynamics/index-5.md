# Molecular Simulation with OpenMM and Bacalhau

## Introduction

In this tutorial example, we will showcase how to containerize an OpenMM workload so that it can be executed on the Bacalhau network and take advantage of the distributed storage & compute resources. [OpenMM](https://github.com/openmm/openmm) is a toolkit for molecular simulation. It is a physic-based library that is useful for refining the structure and exploring functional interactions with other molecules. It provides a combination of extreme flexibility (through custom forces and integrators), openness, and high performance (especially on recent GPUs) that make it truly unique among simulation codes.

In this example tutorial, our focus will be on running OpenMM molecular simulation with Bacalhau.

## Prerequisite[​](http://localhost:3000/examples/molecular-dynamics/openmm/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Running Locally[​](http://localhost:3000/examples/molecular-dynamics/openmm/#running-locally) <a href="#running-locally" id="running-locally"></a>

#### Downloading Datasets[​](http://localhost:3000/examples/molecular-dynamics/openmm/#downloading-datasets) <a href="#downloading-datasets" id="downloading-datasets"></a>

We use a processed 2DRI dataset that represents the ribose binding protein in bacterial transport and chemotaxis. The source organism is the [Escherichia coli](https://en.wikipedia.org/wiki/Escherichia\_coli) bacteria.

<figure><img src="../../.gitbook/assets/2dri-image-b62b408d1846f383eaa00790f8599299.png" alt=""><figcaption></figcaption></figure>

Protein data can be stored in a `.pdb` file, this is a human-readable format. It provides for the description and annotation of protein and nucleic acid structures including atomic coordinates, secondary structure assignments, as well as atomic connectivity. See more information about PDB format [here](https://www.cgl.ucsf.edu/chimera/docs/UsersGuide/tutorials/pdbintro.html). For the original, unprocessed 2DRI dataset, you can download it from the RCSB Protein Data Bank [here](https://www.rcsb.org/structure/2dri).

The relevant code of the processed 2DRI dataset can be found [here](https://github.com/wesfloyd/openmm-test/blob/main/2dri-processed.pdb). Let's print the first 10 lines of the `2dri-processed.pdb` file. The output contains a number of ATOM records. These describe the coordinates of the atoms that are part of the protein.

```bash
head ./dataset/2dri-processed.pdb

Expected Output
    REMARK   1 CREATED WITH OPENMM 7.6, 2022-07-12
    CRYST1   81.309   81.309   81.309  90.00  90.00  90.00 P 1           1 
    ATOM      1  N   LYS A   1      64.731   9.461  59.430  1.00  0.00           N  
    ATOM      2  CA  LYS A   1      63.588  10.286  58.927  1.00  0.00           C  
    ATOM      3  HA  LYS A   1      62.707   9.486  59.038  1.00  0.00           H  
    ATOM      4  C   LYS A   1      63.790  10.671  57.468  1.00  0.00           C  
    ATOM      5  O   LYS A   1      64.887  11.089  57.078  1.00  0.00           O  
    ATOM      6  CB  LYS A   1      63.458  11.567  59.749  1.00  0.00           C  
    ATOM      7  HB2 LYS A   1      63.333  12.366  58.879  1.00  0.00           H  
    ATOM      8  HB3 LYS A   1      64.435  11.867  60.372  1.00  0.00           H  
```

### Writing the Script[​](http://localhost:3000/examples/molecular-dynamics/openmm/#writing-the-script) <a href="#writing-the-script" id="writing-the-script"></a>

To run the script above all we need is a Python environment with the [OpenMM library](http://docs.openmm.org/latest/userguide/application/01\_getting\_started.html) installed.

```python
# run_openmm_simulation.py
import os
from openmm import *
from openmm.app import *
from openmm.unit import *

# Input Files
input_path = '/inputs/2dri-processed.pdb'
os.path.exists(input_path) # check if input file exists
pdb = PDBFile(input_path)
forcefield = ForceField('amber14-all.xml', 'amber14/tip3pfb.xml')

# Output
output_path = '/outputs/final_state.pdbx'
if not os.path.exists(os.path.dirname(output_path)): # check if output dir exists
    os.makedirs(os.path.dirname(output_path))

# System Configuration

nonbondedMethod = PME
nonbondedCutoff = 1.0*nanometers
ewaldErrorTolerance = 0.0005
constraints = HBonds
rigidWater = True
constraintTolerance = 0.000001
hydrogenMass = 1.5*amu

# Integration Options

dt = 0.002*picoseconds
temperature = 310*kelvin
friction = 1.0/picosecond
pressure = 1.0*atmospheres
barostatInterval = 25

# Simulation Options

steps = 10
equilibrationSteps = 0
#platform = Platform.getPlatformByName('CUDA')
platform = Platform.getPlatformByName('CPU')
#platformProperties = {'Precision': 'single'}
platformProperties = {}
dcdReporter = DCDReporter('trajectory.dcd', 1000)
dataReporter = StateDataReporter('log.txt', 1000, totalSteps=steps,
    step=True, time=True, speed=True, progress=True, elapsedTime=True, remainingTime=True, potentialEnergy=True, kineticEnergy=True, totalEnergy=True, temperature=True, volume=True, density=True, separator='\t')
checkpointReporter = CheckpointReporter('checkpoint.chk', 1000)

# Prepare the Simulation

print('Building system...')
topology = pdb.topology
positions = pdb.positions
system = forcefield.createSystem(topology, nonbondedMethod=nonbondedMethod, nonbondedCutoff=nonbondedCutoff,
    constraints=constraints, rigidWater=rigidWater, ewaldErrorTolerance=ewaldErrorTolerance, hydrogenMass=hydrogenMass)
system.addForce(MonteCarloBarostat(pressure, temperature, barostatInterval))
integrator = LangevinMiddleIntegrator(temperature, friction, dt)
integrator.setConstraintTolerance(constraintTolerance)
simulation = Simulation(topology, system, integrator, platform, platformProperties)
simulation.context.setPositions(positions)

# Minimize and Equilibrate

print('Performing energy minimization...')
simulation.minimizeEnergy()
print('Equilibrating...')
simulation.context.setVelocitiesToTemperature(temperature)
simulation.step(equilibrationSteps)

# Simulate

print('Simulating...')
simulation.reporters.append(dcdReporter)
simulation.reporters.append(dataReporter)
simulation.reporters.append(checkpointReporter)
simulation.currentStep = 0
simulation.step(steps)

# Write a file with the final simulation state

state = simulation.context.getState(getPositions=True, enforcePeriodicBox=system.usesPeriodicBoundaryConditions())
with open(output_path, mode="w+") as file:
    PDBxFile.writeFile(simulation.topology, state.getPositions(), file)
print('Simulation complete, file written to disk at: {}'.format(output_path))
```

### Running the Script[​](http://localhost:3000/examples/molecular-dynamics/openmm/#running-the-script) <a href="#running-the-script" id="running-the-script"></a>

```bash
python run_openmm_simulation.py
```

## Uploading the Data to IPFS[​](http://localhost:3000/examples/molecular-dynamics/openmm/#uploading-the-data-to-ipfs) <a href="#uploading-the-data-to-ipfs" id="uploading-the-data-to-ipfs"></a>

The simplest way to upload the data to IPFS is to use a third-party service to "pin" data to the IPFS network, to ensure that the data exists and is available. To do this, you need an account with a pinning service like [Pinata](https://app.pinata.cloud/pinmanager) or [nft.storage](https://nft.storage/docs/how-to/nftup/). Once registered, you can use their UI or API or SDKs to upload files.

When you pin your data, you'll get a CID. Copy the CID as it will be used to access your data

## Containerize Script using Docker[​](http://localhost:3000/examples/molecular-dynamics/openmm/#containerize-script-using-docker) <a href="#containerize-script-using-docker" id="containerize-script-using-docker"></a>

To build your own docker container, create a `Dockerfile`, which contains instructions to build your image.

{% hint style="info" %}
See more information on how to containerize your script/app [here](https://docs.docker.com/get-started/02\_our\_app/)
{% endhint %}

```docker
FROM conda/miniconda3

RUN conda install -y -c conda-forge openmm

WORKDIR /project

COPY ./run_openmm_simulation.py /project

LABEL org.opencontainers.image.source https://github.com/bacalhau-project/examples

CMD ["python","run_openmm_simulation.py"]
```

### Build the container[​](http://localhost:3000/examples/molecular-dynamics/openmm/#build-the-container) <a href="#build-the-container" id="build-the-container"></a>

We will run `docker build` command to build the container:

```bash
docker build -t <hub-user>/<repo-name>:<tag> .
```

Before running the command, replace:

**`hub-user`** with your docker hub username, If you don’t have a docker hub account [follow these instructions to create docker account](https://docs.docker.com/docker-id/), and use the username of the account you created

**`repo-name`** with the name of the container, you can name it anything you want

**`tag`** this is not required but you can use the latest tag

In our case, this will be:

```bash
docker buildx build --platform linux/amd64 --push -t ghcr.io/bacalhau-project/examples/openmm:0.3 .
```

### Push the container[​](http://localhost:3000/examples/molecular-dynamics/openmm/#push-the-container) <a href="#push-the-container" id="push-the-container"></a>

Next, upload the image to the registry. This can be done by using the Docker hub username, repo name, or tag.

```bash
docker push <hub-user>/<repo-name>:<tag>
```

## Run a Bacalhau Job[​](http://localhost:3000/examples/molecular-dynamics/openmm/#run-a-bacalhau-job) <a href="#run-a-bacalhau-job" id="run-a-bacalhau-job"></a>

Now that we have the data in IPFS and the docker image pushed, we can run a job on the Bacalhau network.

```bash
export JOB_ID=$(bacalhau docker run \
    --input ipfs://bafybeig63whfqyuvwqqrp5456fl4anceju24ttyycexef3k5eurg5uvrq4 \
    --wait \
    --id-only \
    ghcr.io/bacalhau-project/examples/openmm:0.3 \
    -- python run_openmm_simulation.py)
```

### Structure of the command[​](http://localhost:3000/examples/molecular-dynamics/openmm/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Lets look closely at the command above:

1. `bacalhau docker run`: call to Bacalhau
2. `bafybeig63whfqyuvwqqrp5456fl4anceju24ttyycexef3k5eurg5uvrq4`: here we mount the CID of the dataset we uploaded to IPFS to use on the job
3. `ghcr.io/bacalhau-project/examples/openmm:0.3`: the name and the tag of the image we are using
4. `python run_openmm_simulation.py`: the script that will be executed inside the container

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

## Checking the State of your Jobs[​](http://localhost:3000/examples/molecular-dynamics/openmm/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter=${JOB_ID} --no-style
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau job get ${JOB_ID} --output-dir results # Download the results
```

## Viewing your Job Output[​](http://localhost:3000/examples/molecular-dynamics/openmm/#viewing-your-job-output) <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

To view the file, run the following command:

```bash
cat results/outputs/final_state.pdbx
```

## Support[​](http://localhost:3000/examples/molecular-dynamics/openmm/#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

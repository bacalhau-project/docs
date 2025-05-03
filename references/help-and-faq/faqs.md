---
icon: comments-question-check
---

# Bacalhau FAQs

### How do I accept (and run) networked jobs?

By default, for security purposes, Bacalhau jobs run with networking turned off. In order for your compute node to accept (and run) networked jobs, you need to enable it on a per compute node basis. To do so, you need to set the following:&#x20;

```bash
bacalhau config set JobAdmissionControl.AcceptNetworkedJobs=true
```

You will then be able to run jobs with the following criteria:

```bash
bacalhau docker run networked-job-container --network Full
```

### How do I restrict what nodes my jobs run on?

First, you need to describe each node with a labels in a `key=value` format. Later labels can be used by the job as conditions for choosing the node on which to run on. For example:

```bash
bacalhau config set Labels=NodeType=WebServer
```

`If you want to assign multiple targets, you can do so with key=value,key=value.`

```bash
bacalhau config set Labels=foo=bar,baz=qaz
```

### How do I specify the orchestrator for my compute node?&#x20;

The `Compute.Orchestrator`field in the config tells the Bacalhau compute node.

```bash
bacalhau config set Compute.Orchestrators=my-great-orchestrator.com
```

You can add the protocol and port, and it will apply this inline. E.g.

```bash
bacalhau config set Compute.Orchestrators=nats://my-great-orchestrator.com
```

Or:

```bash
bacalhau config set Compute.Orchestrators=nats://my-great-orchestrator.com:4222
```

### How do I enable the WebUI?

By default, the WebUI for Bacalhau is disabled for security reasons. To enable the WebUI, run the Bacalhau requester node with the following configuration:

```bash
bacalhau config set WebUI.Enabled=true
```

## Can I use multiple data sources in the same job?

You can use the `--input` or `-i` flag multiple times with multiple different CIDs, URLs or S3 objects, and give each of them a path to be mounted at.

For example, doing `bacalhau run cat/main.wasm -i ipfs://CID1:/input1 -i ipfs://CID2:/input2` will result in both the `input1` and `input2` folders being available to your running WASM with the CID contents. You can use `-i` as many times as you need.

### Can I run Bacalhau in a containerized setup (nested containers)?

Yes! We offer a Bacalhu Docker-in-Docker container. You can set something like this up by running the following container:

```bash
docker run -v ./orchestrator-config.yaml:/etc/bacalhau/config.yaml \
           -v node-info:/etc/node-info \
           bacalhauproject/bacalhau-dind-compute-node:latest
```

These two files are for configuring the Bacalhau node. The first is the orchestrator configuration, and will look something like this:

```yaml
NameProvider: "uuid"
Compute:
  Enabled: true
  Orchestrators:
    - nats://f503ee90-c4dc-4ac7-a7b5-a460aeb94fb3.us1.cloud.expanso.dev:4222
  Auth:
    Token: "VERY_SECURE_TOKEN"
  TLS:
    RequireTLS: true
  Engine:
    Resources:
      CPU: 1
      Memory: 1GB
JobAdmissionControl:
  AcceptNetworkedJobs: true
```

And the second is just a list of arbitrary key-value pairs for labeling the node. For example:

```bash
HOSTNAME=d4dfe593221956e74d59
OS=Linux
REGION=us-west-1
ZONE=us-west-1a
GPU=H100
```

### Can I run non Docker jobs?

Yes! You can run programs using WebAssembly instead. See the [onboarding WebAssembly](../../overview/getting-started/workload-onboarding/wasm-workload-onboarding.md) for information on how to do that.

### How do I run a script that requires installing packages from a package repository like pypi or apt?

We recommend building all requirements into your container or WASM before running it. However, if you need to download and install after starting the run, make sure you have the following configuration setting set:

```bash
bacalhau serve --compute \
               -c Job.AdmissionControl.AcceptNetworkedJobs=true
```

## How do I see a job’s progress while it’s running?

Type the following:

```basic
bacalhau job describe b4491a4a-7b55-4fa7-a5af-80f3c99bc379
```

If your job writes to stdout, or stderr, while it is running, you can also view the output with the [logs](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/cli/job/logs) command.

## How can I download and query SQLite when it complains about being in read-only directory?

When downloading content to run your code against, it is written to a read-only directory. Unfortunately, by default, SQLite requires the directory to be writable so that it can create utility files during its use.

If you run your command with the `immutable` setting set to 1, then it will work. From the sqlite3 command you can use `.open 'file:/inputs/database.db?immutable=1'` where you should replace "database.db" with your downloaded database filename.

## Can I stop a running job?

Yes. Given a valid `job ID`, you can use the [stop command](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/cli/job/stop) to cancel the job, and stop it from running.

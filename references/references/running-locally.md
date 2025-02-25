---
description: How to run a Bacalhau devstack locally
icon: location-exclamation
---

# Running Locally In Devstack

You can run a stand-alone Bacalhau network on your computer with the following guide.

The `devstack` command of `bacalhau` will start a 4 node cluster with 3 compute and 1 requester nodes.

This is useful to kick the tires and/or developing on the codebase. It's also the tool used by some tests.

## Pre-requisites

1. `x86_64` or `ARM64` architecture
   1. Ubuntu 20.0+ has most often been used for development and testing
2. [Docker Engine](https://docs.docker.com/get-docker/)
3. [Latest Bacalhau release](broken-reference)

## Install Bacalhau

You can install the Bacalhau CLI by running this command in a terminal:

```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```

See the [installation guide](broken-reference) for more installation options.

## Start the cluster

```bash
bacalhau devstack
```

This will start a 4 node Bacalhau cluster.

You can use [your own IPFS node](../setting-up/running-node/private-ipfs-network-setup.md) and connect it to the devstack by setting the IPFS endpoints via [configuration keys](../guides/configuration-management.md): `InputSources.Types.IPFS.Endpoint` and `Publishers.Types.IPFS.Endpoint`

```bash
bacalhau devstack \
--config InputSources.Types.IPFS.Endpoint=/ip4/127.0.0.1/tcp/5001 \
--config Publishers.Types.IPFS.Endpoint=/ip4/127.0.0.1/tcp/5001
```

Once everything has started up - you will see output like the following:

```bash
Devstack is ready!
No. of requester only nodes: 1
No. of compute only nodes: 3
No. of hybrid nodes: 0
To use the devstack, run the following commands in your shell:

export BACALHAU_API_HOST=0.0.0.0
export BACALHAU_API_PORT=34217
```

The message above contains the environment variables you need for a new terminal window. You can paste these into a new terminal so that `bacalhau` will use your local devstack. Execute the [bacalhau node list](broken-reference) command to see the devstack cluster structure:

```bash
bacalhau node list
 ID      TYPE       APPROVAL  STATUS     LABELS                                              CPU     MEMORY      DISK         GPU  
 node-0  Requester  APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux                                                 
                                         env=devstack id=node-0 name=node-0                                                        
 node-1  Compute    APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux           1.4 /   2.7 GB /    13.1 GB /    0 /  
                                         env=devstack id=node-1 name=node-1                  1.4     2.7 GB      13.1 GB      0    
 node-2  Compute    APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux           1.4 /   2.7 GB /    13.1 GB /    0 /  
                                         env=devstack id=node-2 name=node-2                  1.4     2.7 GB      13.1 GB      0    
 node-3  Compute    APPROVED  CONNECTED  Architecture=amd64 Operating-System=linux           1.4 /   2.7 GB /    13.1 GB /    0 /  
                                         env=devstack id=node-3 name=node-3                  1.4     2.7 GB      13.1 GB      0    
```

## New Terminal Window

Open an additional terminal window to be used for submitting jobs. Copy and paste environment variables from previous message into this window, e.g.:

```bash
export BACALHAU_API_HOST=0.0.0.0
export BACALHAU_API_PORT=34217
```

You are now ready to submit a job to your local devstack.

## Submit a simple job

This will submit a simple job to a single node:

```bash
bacalhau docker run \
--publisher local \
alpine echo "hello devstack test"
```

This should output something like the following:

```bash
Job successfully submitted. Job ID: j-5b0ee6dd-6080-4277-99ce-fdf179907b25
Checking job status... (Enter Ctrl+C to exit at any time, your job will continue running):

 TIME          EXEC. ID    TOPIC            EVENT         
 11:06:24.789              Submission       Job submitted 
 11:06:24.798  e-4fba1f7c  Scheduling       Requested execution on node-1 
 11:06:24.828  e-4fba1f7c  Execution        Running 
 11:06:25.173  e-4fba1f7c  Execution        Completed successfully 
                                             
To get more details about the run, execute:
	bacalhau job describe j-5b0ee6dd-6080-4277-99ce-fdf179907b25

To get more details about the run executions, execute:
	bacalhau job executions j-5b0ee6dd-6080-4277-99ce-fdf179907b25
To download the results, execute:
	bacalhau job get j-5b0ee6dd-6080-4277-99ce-fdf179907b25

```

Use [bacalhau job describe](broken-reference) command to view results:

```bash
bacalhau job describe j-5b0ee6dd-6080-4277-99ce-fdf179907b25
```

This should output info about job execution and results:

```bash
ID            = j-5b0ee6dd-6080-4277-99ce-fdf179907b25
Name          = j-5b0ee6dd-6080-4277-99ce-fdf179907b25
Namespace     = default
Type          = batch
State         = Completed
Count         = 1
Created Time  = 2024-10-30 10:06:24
Modified Time = 2024-10-30 10:06:25
Version       = 0

Summary
Completed = 1

Job History
 TIME                 TOPIC         EVENT         
 2024-10-30 11:06:24  Submission    Job submitted 
 2024-10-30 11:06:24  State Update  Running       
 2024-10-30 11:06:25  State Update  Completed     

Executions
 ID          NODE ID  STATE      DESIRED  REV.  CREATED    MODIFIED   COMMENT 
 e-4fba1f7c  node-1   Completed  Stopped  6     6m11s ago  6m11s ago          

Execution e-4fba1f7c History
 TIME                 TOPIC       EVENT                         
 2024-10-30 11:06:24  Scheduling  Requested execution on node-1 
 2024-10-30 11:06:24  Execution   Running                       
 2024-10-30 11:06:25  Execution   Completed successfully        

Standard Output
hello devstack test
```

Use [bacalhau job get](broken-reference) command to download job results:

```bash
bacalhau job get j-5b0ee6dd-6080-4277-99ce-fdf179907b25
```

Results will be downloaded to the current directory. Job results should have the following structure:

```
j-5b0ee6dd/
├── exitCode
├── stderr
└── stdout
```

If you execute `cat stdout` it should read `hello devstack test`. If you write any files in your job, they will appear in `volumes/output`.

## Support <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

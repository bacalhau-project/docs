# v1.4.0 Release Notes

{% hint style="info" %}
Release Notes for Bacalhau v.1.4.0

* Embedded libp2p/IPFS deprecation and migration to NATS.
* CLI command updates.&#x20;
* Updates to job spec v2, while deprecating job spec v1.
* Job queuing was extended with new job timeouts.
* Improved error reporting.&#x20;
* Introduction of Node Manager.
{% endhint %}

## Libp2p, IPFS deprecation and Migration to NATS (Warning)

We migrated to NATS already in v.1.3.0. (read more [here](https://blog.bacalhau.org/i/142946625/nats-based-networking)) and will deprecate IPFS/libp2p in v.1.4.0. natively. If you want to migrate to NATS, please make sure to read these docs on the process.

## CLI Command Updates

In version 1.4.0 of Bacalhau, all legacy commands will be removed. Here’s a breakdown of the old commands and their new equivalents:

| Old Commands                                      | New Commands                                            |
| ------------------------------------------------- | ------------------------------------------------------- |
| bacalhau <mark style="color:red;">create</mark>   | bacalhau <mark style="color:green;">job run</mark>      |
| bacalhau <mark style="color:red;">cancel</mark>   | bacalhau <mark style="color:green;">job stop</mark>     |
| bacalhau <mark style="color:red;">list</mark>     | bacalhau <mark style="color:green;">job list</mark>     |
| bacalhau <mark style="color:red;">logs</mark>     | bacalhau <mark style="color:green;">job logs</mark>     |
| bacalhau <mark style="color:red;">get</mark>      | bacalhau <mark style="color:green;">job get</mark>      |
| bacalhau <mark style="color:red;">describe</mark> | bacalhau <mark style="color:green;">job describe</mark> |
| bacalhau <mark style="color:red;">id</mark>       | bacalhau <mark style="color:green;">agent node</mark>   |
| bacalhau <mark style="color:red;">validate</mark> | bacalhau <mark style="color:green;">job validate</mark> |

For some commands there are actions required to migrate to Bacalhau v.1.4.0. In your network. In the following view these actions are specified.

Special Attention to create , validate and describe Commands

|                  | Old Command                                                                                                                       | New Command                                                                                               | Action Required                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| create Command   | <mark style="color:red;">create</mark> accepts a v1beta1 job spec.                                                                | <mark style="color:green;">job run</mark> accepts the current job spec.                                   | Users must update their job specifications to align with the new job run requirements.  |
| describe Command | <p><mark style="color:red;">describe</mark> returns a v1beta1 job spec and its corresponding state in YAML format.</p><p><br></p> | <mark style="color:green;">job describe</mark> provides columnar data detailing various parts of the job. | Users should expect a different output format with job describe compared to describe.   |
| validate Command | <mark style="color:red;">validate</mark> validates a v1beta1 job spec.                                                            | <mark style="color:green;">job validate</mark> validates the current job spec.                            | v1beta1 job specs will not be considered valid when passed to the job validate command. |

## Error Handling for Legacy Commands

If a user tries to use a legacy command, an error message will guide them to the correct new command. For example:

```bash
bacalhau list
Error: This command has moved! Please use `job list` to list jobs.
```

This error depends on the version you are running. There might also appear a failed request warning.

```bash
failed request: failed to authorize user: Unexpected response code: 403 ({
  "Error": "Client version is outdated. Update your client",
  "MinVersion": "1.4.0",
  "ClientVersion": "1.3.2",
  "ServerVersion": "1.4.0"
})
```

## Extended Job Queuing

In 1.3.2, we released limited queuing functionality on Compute nodes that would allow a [Job](https://docs.bacalhau.org/getting-started/architecture#chapter-2-job-cycle) to be scheduled on a Compute node if it expected that it would be able to start the job in a reasonable time, and that there wasn’t another node better suited to running it elsewhere.\
Though a useful enhancement of Job delegation across the network, we feel this isn’t the most optimal path for determining which nodes can execute which Jobs at which time. To that end, we’re introducing a Queuing system in the Requester nodes of a Bacalhau network.\


From 1.4.0, if a Job is submitted to a Bacalhau network, but no Compute node has the capacity to either execute, or prepare to execute the Job, the Requester node which received the Job will store it internally and either send it to a Compute node for processing, or until the Job timeout has elapsed.\
With this change, networks with heavy utilization should see a marked increase in the successful completion of Jobs. Fore more information about this go to [this guide](https://docs.bacalhau.org/setting-up/jobs/job-queuing).

## Improved Error Reporting

In the new version of Bacalhau the errors given to users were improved to give more granular feedback on what went wrong and to improve debugging. This makes errors more concise and faster to debug.

## Introduction of Node Manager

In Bacalhau 1.4.0, we’re introducing the Node Manager. This feature simplifies node operations, providing a clear view of all compute nodes and their status. You can approve, deny, or delete nodes as needed, making management straightforward. Heartbeats from nodes keep the Node Manager updated on their connectivity, enhancing overall stability and performance. For more information on this topic, check out the blog post about [our release notes for a previous version (v.1.3.1).](https://blog.bacalhau.org/p/introducing-bacalhau-131)

## Guidance for Users Not Ready for the Changes

Users who are not prepared for the changes in CLI behavior and job specification definitions are advised to remain on Bacalhau v1.3.1. This version continues to support the legacy commands and job specifications. Users can maintain their own private Bacalhau cluster using v1.3.1.

When users are ready to transition to the new CLI behavior and job specification requirements, they can upgrade to Bacalhau v1.4.

\

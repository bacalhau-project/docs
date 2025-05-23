# Selection Policy

When running a node, you can choose which jobs you want to run by using configuration options, environment variables, or flags to specify a job selection policy.

| Configuration key                       | Default value | Meaning                                                                                            |
| --------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| JobAdmissionControl.Locality            | Anywhere      | Only accept jobs that reference data we have locally ("local") or anywhere ("anywhere").           |
| JobAdmissionControl.ProbeExec           | unused        | Use the result of an external program to decide if we should take on the job.                      |
| JobAdmissionControl.ProbeHTTP           | unused        | Use the result of a HTTP POST to decide if we should take on the job.                              |
| JobAdmissionControl.RejectStatelessJobs | False         | Reject jobs that don't specify any [input data](../specifications/job/input-source.md).            |
| JobAdmissionControl.RejectNetworkedJobs | False         | Reject jobs that require [network access](./networking.md). By default, network access is enabled. |

## Job Selection Probes

If you want more control over making the decision to take on jobs, you can use the `JobAdmissionControl.ProbeExec` and `JobAdmissionControl.ProbeHTTP` configuration keys.

These are external programs that are passed the following data structure so that they can make a decision about whether to take on a job:

```json
{
  "node_id": "XXX",
  "job_id": "XXX",
  "spec": {
    "engine": "docker",
    "verifier": "ipfs",
    "job_spec_vm": {
      "image": "ubuntu:latest",
      "entrypoint": ["cat", "/file.txt"]
    },
    "inputs": [
      {
        "engine": "ipfs",
        "cid": "XXX",
        "path": "/file.txt"
      }
    ]
  }
}
```

The `exec` probe is a script to run that will be given the job data on `stdin`, and must exit with status code 0 if the job should be run.

The `http` probe is a URL to POST the job data to. The job will be rejected if the HTTP request returns a non-positive status code (e.g. >= 400).

If the HTTP response is a JSON blob, it should match the [following schema](https://github.com/bacalhau-project/bacalhau/blob/885d53e93b01fb343294d7ddbdbffe89918db800/pkg/bidstrategy/type.go#L18-L22) and will be used to respond to the bid directly:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "shouldBid": {
      "description": "If the job should be accepted",
      "type": "boolean"
    },
    "shouldWait": {
      "description": "If the node should wait for an async response that will come later. `shouldBid` will be ignored",
      "type": "boolean",
      "default": false
    },
    "reason": {
      "description": "Human-readable string explaining why the job should be accepted or rejected, or why the wait is required",
      "type": "string"
    }
  },
  "required": ["shouldBid", "reason"]
}
```

For example, the following response will reject the job:

```json
{
  "shouldBid": false,
  "reason": "The job did not pass this specific validation: ..."
}
```

If the HTTP response is not a JSON blob, the content is ignored and any non-error status code will accept the job.

# Job Specification

A `Job` represents a discrete unit of work that can be scheduled and executed. It carries all the necessary information to define the nature of the work, how it should be executed, and the resources it requires.

```yaml
Type: batch
Count: 1
Priority: 50
Meta:
  version: "1.2.5"
Labels:
  project: "my-project"
Constraints:
  - Key: Architecture
    Operator: '='
    Values:
      - arm64
  - Key: region
    Operator: '='
    Values:
      - us-west-2
Tasks:
  #...
```

## `job` Parameters

* **Name** `(string : <optional>)`: A logical name to refer to the job. Defaults to job ID.
* **Namespace** `(string: "default")`: The namespace in which the job is running. `ClientID` is used as a namespace in the public demo network.
* **Type** `(string: <required>)`: The type of the job, such as `batch`, `ops`, `daemon` or `service`. You can learn more about the supported jobs types in the [Job Types](job-types.md) guide.
* **Priority** `(int: 0`): Determines the scheduling priority.
* **Count** `(int: <required)`: Number of replicas to be scheduled. This is only applicable for jobs of type `batch` and `service`.
* **Meta** `(`[`Meta`](meta.md) `: nil)`: Arbitrary metadata associated with the job.
* **Labels** `(`[`Label`](label.md)`[] : nil)`: Arbitrary labels associated with the job for filtering purposes.
* **Constraints** `(`[`Constraint`](constraint.md)`[] : nil)`: These are selectors which must be true for a compute node to run this job.
* **Tasks** `(`[`Task`](task/)`[] : <required>)`:: Task associated with the job, which defines a unit of work within the job. Today we are only supporting single task per job, but with future plans to extend this.

## Server-Generated Parameters

The following parameters are generated by the server and should not be set directly.

* **ID** `(string)`: A unique identifier assigned to this job. It's auto-generated by the server and should not be set directly. Used for distinguishing between jobs with similar names.
* **State** `(`[`State`](../job-results/state.md)`)`: Represents the current state of the job.
* **Version** `(int)`: A monotonically increasing version number incremented on job specification update.
* **Revision** `(int)`: A monotonically increasing revision number incremented on each update to the job's state or specification.
* **CreateTime** `(int)`: Timestamp of job creation.
* **ModifyTime** `(int)`: Timestamp of last job modification.
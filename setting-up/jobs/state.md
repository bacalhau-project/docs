# State

## `State` Structure Specification

Within Bacalhau, the `State` structure is designed to represent the status or state of an object (like a [`Job`](job.md)), coupled with a human-readable message for added context. Below is a breakdown of the structure:

### `State` Parameters

1. **StateType** `(T : <required>)`: Represents the current state of the object. This is a generic parameter that will take on a specific value from a set of defined state types for the object in question. For jobs, this will be one of the [`JobStateType`](state.md#job-state-types) values.
2. **Message** `(string : <optional>)`: A human-readable message giving more context about the current state. Particularly useful for states like `Failed` to provide insight into the nature of any error.

## Job State Types

When `State` is used for a job, the `StateType` can be one of the following:

1. `Pending`: This indicates that the job is submitted but is not yet scheduled for execution.
2. `Running`: The job is scheduled and is currently undergoing execution.
3. `Completed`: This state signifies that a job has successfully executed its task. Only applicable for batch jobs.
4. `Failed`: A state indicating that the job encountered errors and couldn't successfully complete.
5. `JobStateTypeStopped`: The job has been intentionally halted by the user before its natural completion.

The inclusion of the `Message` field can offer detailed insights, especially in states like `Failed`, aiding in error comprehension and debugging.

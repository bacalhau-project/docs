# Task Specification

A `Task` signifies a distinct unit of work within the broader context of a `Job`. It defines the specifics of how the task should be executed, where the results should be published, what environment variables are needed, among other configurations

## `Task` Parameters

* **Name** `(string : <required>)`: A unique identifier representing the name of the task.
* **Engine** `(`[`SpecConfig`](https://github.com/bacalhau-project/docs/blob/main/setting-up/jobs/job-specification/spec-config/README.md) `: required)`: Configures the execution engine for the task, such as [Docker](https://github.com/bacalhau-project/docs/blob/main/setting-up/other-specifications/engines/docker/README.md) or [WebAssembly](https://github.com/bacalhau-project/docs/blob/main/setting-up/other-specifications/engines/wasm/README.md).
* **Publisher** `(`[`SpecConfig`](https://github.com/bacalhau-project/docs/blob/main/setting-up/jobs/job-specification/spec-config/README.md) `: optional)`: Specifies where the results of the task should be published, such as [S3](https://github.com/bacalhau-project/docs/blob/main/setting-up/other-specifications/publishers/s3/README.md) and [IPFS](https://github.com/bacalhau-project/docs/blob/main/setting-up/other-specifications/publishers/ipfs/README.md) publishers. Only applicable for tasks of type `batch` and `ops`.
* **Env** `(map[string]string : optional)`: A set of environment variables for the driver.
* **Meta** `(`[`Meta`](meta.md) `: optional)`: Allows association of arbitrary metadata with this task.
* **InputSources** `(`[`InputSource`](input-source.md)`[] : optional)`: Lists remote artifacts that should be downloaded before task execution and mounted within the task, such as from [S3](https://github.com/bacalhau-project/docs/blob/main/setting-up/other-specifications/sources/s3/README.md) or [HTTP/HTTPs](https://github.com/bacalhau-project/docs/blob/main/setting-up/other-specifications/sources/url/README.md).
* **ResultPaths** `(`[`ResultPath`](result-path.md)`[] : optional)`: Indicates volumes within the task that should be included in the published result. Only applicable for tasks of type `batch` and `ops`.
* **Resources** `(`[`Resources`](resources.md) `: optional)`: Details the resources that this task requires.
* **Network** `(`[`Network`](network.md) `: optional)`: Configurations related to the networking aspects of the task.
* **Timeouts** `(`[`Timeouts`](timeouts.md) `: optional)`: Configurations concerning any timeouts associated with the task.

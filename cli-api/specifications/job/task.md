# Task

A `Task` signifies a distinct unit of work within the broader context of a `Job`. It defines the specifics of how the task should be executed, where the results should be published, what environment variables are needed, among other configurations

## `Task` Parameters

1. **Name** `(string : <required>)`: A unique identifier representing the name of the task.
2. **Engine** `(`[`SpecConfig`](../other/specconfig.md) `: required)`: Configures the execution engine for the task, such as [Docker](../engines/docker.md) or [WebAssembly](../engines/wasm.md).
3. **Publisher** `(`[`SpecConfig`](../other/specconfig.md) `: optional)`: Specifies where the results of the task should be published, such as [S3](../publishers/s3.md) and [IPFS](../publishers/ipfs.md) publishers. Only applicable for tasks of type `batch` and `ops`.
4. **Env** `(map[string]string : optional)`: A set of environment variables for the driver.
5. **Meta** `(`[`Meta`](meta.md) `: optional)`: Allows association of arbitrary metadata with this task.
6. **InputSources** `(`[`InputSource`](input-source.md)`[] : optional)`: Lists remote artifacts that should be downloaded before task execution and mounted within the task, such as from [S3](../sources/s3.md) or [HTTP/HTTPs](../sources/url.md).
7. **ResultPaths** `(`[`ResultPath`](result-path.md)`[] : optional)`: Indicates volumes within the task that should be included in the published result. Only applicable for tasks of type `batch` and `ops`.
8. **Resources** `(`[`Resources`](resources.md) `: optional)`: Details the resources that this task requires.
9. **Network** `(`[`Network`](network.md) `: optional)`: Configurations related to the networking aspects of the task.
10. **Timeouts** `(`[`Timeouts`](timeouts.md) `: optional)`: Configurations concerning any timeouts associated with the task.

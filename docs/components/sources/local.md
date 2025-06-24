---
slug: /sources/local
---

# Local

The `local` input source allows Bacalhau jobs to access files and directories already present on the compute node. This is especially useful for utilizing locally stored datasets, configuration files, logs, or other necessary resources without fetching them from a remote source, ensuring faster job initialization and execution.

:::info
Note: The `local` provider can also be used with the name `localDirectory` and they are currently interchangeable. However, the `localDirectory` name is planned to be deprecated in future releases, so using `local` is recommended.
:::

## Source Specification Parameters

The `local` input source accepts the following parameters:

* **SourcePath** `(string: <required>)`: The absolute path on the compute node where the Local file or directory is located. Bacalhau will access this path to read data, and if permitted, write data as well.
* **ReadWrite** `(bool: false)`: A boolean flag that, when set to true, gives Bacalhau both read and write access to the specified Local file or directory. If set to false, Bacalhau will have read-only access.
* **CreateAs** `(string: "noCreate")`: A create strategy to be used when the `SourcePath` is empty. Possible values are:
  * `"dir"`: Creates a directory at the specified path
  * `"file"`: Creates a file at the specified path
  * `"noCreate"`: Does not create anything if the path is empty

:::info
Note: Bacalhau will only create a file or directory if `ReadWrite` is set to `true`. The `CreateAs` parameter has no effect when `ReadWrite` is `false`.
:::

## Compute Node Configuration

For security reasons, compute nodes must be explicitly configured to allow access to local file system. This requires configuring the `Compute.AllowListedLocalPaths` property with the paths that should be accessible and their permissions (`:rw` for read-write or `:ro` for read-only).

For example:
```bash
bacalhau config set Compute.AllowListedLocalPaths=/etc/config:rw,/etc/*.conf:ro
```

If permission errors occur when using local paths, verify that the compute node has the appropriate path allowlisted in its configuration.

### Examples (Jobs)

Below are examples of defining a `local` input source in YAML format.

#### Basic Read-Only Directory Mount

```yaml
InputSources:
  - Source:
      Type: "local"
      Params:
        SourcePath: "/etc/config"
        ReadWrite: false
    Target: "/config"
```

This example configures Bacalhau to access the `/etc/config` directory on the compute node. The content of this directory becomes available at the `/config` path within the task's environment, with read-only access.

#### Read-Write Access with Directory Creation

```yaml
InputSources:
  - Source:
      Type: "local"
      Params:
        SourcePath: "/var/data/job_input"
        ReadWrite: true
        CreateAs: "dir"
    Target: "/app/input"
```

This configuration allows read and write access to the local `/var/data/job_input` directory. If this directory doesn't exist, Bacalhau creates an empty one and makes it available at the `/app/input` path within the task's environment.

#### File Mount With Automatic Creation

```yaml
InputSources:
  - Source:
      Type: "local"
      Params:
        SourcePath: "/var/log/job.log"
        ReadWrite: true
        CreateAs: "file"
    Target: "/app/logs/job.log"
```

This example mounts a specific file with read-write permissions and creates the file if it doesn't exist.

#### File Mount Without Automatic Creation

```yaml
InputSources:
  - Source:
      Type: "local"
      Params:
        SourcePath: "/var/log/job.log"
        ReadWrite: true
        CreateAs: "noCreate"
    Target: "/app/logs/job.log"
```

Specifying `noCreate` explicitly (or omitting the `CreateAs` parameter) prevents Bacalhau from creating an empty file if it doesn't exist. In this case, the job will not execute on nodes that do not have an existing file at `/var/log/job.log`.

### Example (Imperative/CLI)

The Bacalhau CLI supports defining local input sources using the following imperative approach:

1.  **Mount readonly file to `/config`**:

    ```bash
    bacalhau docker run -i file:///etc/config:/config ubuntu ...
    ```
2.  **Mount writable file to default `/input`**:

    ```bash
    bacalhau docker run -i file:///var/checkpoints:/myCheckpoints,opt=rw=true ubuntu ...
    ```

---
slug: /sources/url
---
# URL

The URL Input Source provides a straightforward method for Bacalhau jobs to access and incorporate data available over HTTP/HTTPS. By specifying a URL, users can ensure the required file is retrieved and prepared in the task's execution environment, enabling direct and efficient data utilization.

## Source Specification Parameters

Here are the parameters that you can define for a URL input source:

* **URL** `(string: <required>)`: The HTTP/HTTPS URL pointing directly to the file you want to retrieve. Only a single file can be downloaded per URL input source.

:::info
Note: Bacalhau will attempt to infer the filename from the URL or the HTTP headers. This inferred filename is used when placing the file in the target directory.
:::

### Example

Below is an example of how to define a URL input source in YAML format.

```yaml
InputSources:
  - Source:
      Type: "urlDownload"
      Params:
        URL: "https://example.com/data/file.txt"
    Target: "/data"
```

In this setup, the file available at the specified URL is downloaded and stored in the "/data" directory within the task's environment. The actual path to the downloaded file will be "/data/file.txt".

### Example (Imperative/CLI)

When using the Bacalhau CLI to define the URL input source, you can employ the following imperative approach. Below are example commands demonstrating how to define the URL input source with various configurations:

1.  **Fetch data from an HTTP endpoint**: This command demonstrates fetching a file from a specific HTTP URL. The file will be mounted in the default `/inputs` directory.

    ```bash
    bacalhau docker run -i http://example.com/data.txt ubuntu -- cat /inputs/data.txt
    ```
2.  **Fetch data from an HTTPS endpoint and specify mount path**: This example fetches a file from a secure URL and mounts it to a custom directory path.

    ```bash
    bacalhau docker run -i https://secure.example.com/data.txt:/data ubuntu -- cat /data/data.txt
    ```

    In this case, the file "data.txt" is downloaded and placed in the "/data" directory, resulting in the path "/data/data.txt" within the container.

# WebAssembly (WASM)

The WASM Engine in Bacalhau allows tasks to be executed in a WebAssembly environment, offering compatibility and speed. This engine supports WASM and WASI (WebAssembly System Interface) jobs, making it highly adaptable for various use cases. Below are the parameters for configuring the WASM Engine.

## `WASM` Engine Parameters

- **EntryModule** `(`[`InputSource`](../job/input-source.md) `: required)`: Specifies the WASM module that contains the start function or the main execution code of the task. The InputSource should point to the location of the WASM binary.
- **Entrypoint** `(string: <optional>)`: The name of the function within the EntryModule to execute. For WASI jobs, this should typically be `_start`. The entrypoint function should have zero parameters and zero results.
- **Parameters** `(string[]: <optional>)`: An array of strings containing arguments that will be supplied to the program as ARGV. This allows parameterized execution of the WASM task.
- **EnvironmentVariables** `(map[string]string: <optional>)`: A mapping of environment variable keys to their values, made available within the executing WASM environment.
- **ImportModules** `(`[`InputSource`](../job/input-source.md)`[] : optional)`: An array of InputSources pointing to additional WASM modules. The exports from these modules will be available as imports to the EntryModule, enabling modular and reusable WASM code.

## Examples

### Using S3 bucket

```yaml
Engine:
Type: 'WASM'
Params:
  EntryModule:
    Source:
      Type: 's3'
      Params:
        Bucket: 'my-bucket'
        Key: 'entry.wasm'
  Entrypoint: '_start'
  Parameters:
    - '--option'
    - 'value'
  EnvironmentVariables:
    VAR1: 'value1'
    VAR2: 'value2'
  ImportModules:
    - Source:
        Type: 'localDirectory'
        Params:
          Path: '/local/path/to/module.wasm'
```

In this example, the task is configured to run in a WASM environment. The EntryModule is fetched from an S3 bucket, the entrypoint is `_start`, and parameters and environment variables are passed into the WASM environment. Additionally, an ImportModule is loaded from a local directory, making its exports available to the EntryModule.

## Using Local Provider

```yaml
Engine:
  Type: wasm
  Params:
    EntryModule:
      Source:
        Type: 'localDirectory'
        Params:
          SourcePath: '/app/main.wasm'
      Target: '/main.wasm'
    Entrypoint: 'start_app'
    Parameters:
      - '--assets'
      - '/app/data'
InputSources:
  - Source:
      Type: 'urlDownload'
      Params:
        URL: 'https://example.com/data/file.txt'
    Target: '/app/data'
```

In this example, the main WASM module is fetched from the local file system on the compute node. The entrypoint function is `start_app`, and it is given two arguments `"--assets"` and `"/app/data"`. Additionally, the WASM environment has access to `/app/data/file.txt` file downloaded from the given URL.

{% hint style="info" %}
Parameters are passed to the WASM module as command-line arguments. To access these arguments in your WASM module, you'll need to implement the appropriate code based on your programming language. For example, in Rust, you can retrieve the parameters as follows:

```rust
use std::env;

fn _start() {
  let args: Vec<String> = env::args().collect();
  // &args[0] is the program name, &args[1] is the first parameter
}
```

{% endhint %}

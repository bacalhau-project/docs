# WebAssembly (Wasm)

Bacalhau supports running programs compiled to [WebAssembly (Wasm)](https://webassembly.org/). This guide explains how to run Wasm programs on Bacalhau.

## Prerequisites

1. [Install the Bacalhau client](/getting-started/installation.mdx)
2. A Wasm program compiled for WebAssembly System Interface (WASI) Snapshot 1

## Limitations

- Supports only WASI Snapshot 1 compatible programs
- No multi-threading (WASI doesn't expose interfaces for it)

## Running a Wasm Program

### Basic Usage

Run a local Wasm file:

```bash
bacalhau wasm run program.wasm
```

Run a program with arguments:

```bash
bacalhau wasm run program.wasm arg1 arg2
```

Run with environment variables:

```bash
bacalhau wasm run program.wasm -e VAR1=value1 -e VAR2=value2
```

### Working with Input Data

Provide input data from a URL:

```bash
bacalhau wasm run program.wasm --input https://example.com/data.txt:/inputs/data.txt
```

Provide input data from a local file:

```bash
bacalhau wasm run program.wasm --input ./local-file.txt:/inputs/file.txt
```

### Working with Output Data

Wasm programs can write output to:

- Standard output (stdout)
- The filesystem at `/outputs` (default output location)
- Custom output locations specified with the `-o` flag

```bash
bacalhau wasm run program.wasm -o results:/custom/path
```

## Creating Wasm Programs for Bacalhau

### 1. Use Filesystem Operations Instead of Network Calls

Wasm programs on Bacalhau can't make network requests. Instead:

- Read input data from the filesystem (typically `/inputs`)
- Write output data to the filesystem (typically `/outputs`)

### 2. Compile Your Program for WASI

You need to compile your program to be WASI-compatible. For example, with Rust:

```bash
rustup target add wasm32-wasi
cargo build --target wasm32-wasi --release
```

The resulting Wasm file can be run on Bacalhau.

## Viewing Job Results

Check job status:

```bash
bacalhau job list --id-filter JOB_ID
```

View job output:

```bash
bacalhau job logs JOB_ID
```

See job details:

```bash
bacalhau job describe JOB_ID
```

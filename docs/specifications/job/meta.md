# Meta

In both the `Job` and `Task` specifications within Bacalhau, the `Meta` block is a versatile element used to attach arbitrary metadata. This metadata isn't utilized for filtering or categorizing jobs; there's a separate [`Labels`](label.md) block specifically designated for that purpose. Instead, the `Meta` block is instrumental for embedding additional information for operators or external systems, enhancing clarity and context.

## `Meta` Parameters in Job and Task Specs

The `Meta` block is comprised of key-value pairs, with both keys and values being strings. These pairs aren't constrained by a predefined structure, offering flexibility for users to annotate jobs and tasks with diverse metadata.

### User-Defined Metadata

Users can incorporate any arbitrary key-value pairs to convey descriptive information or context about the job or task.

#### Example:

```json
"Meta": {
    "project": "frontend",
    "version": "1.2.5",
    "owner": "team-alpha",
    "environment": "development"
}
```

1. **project**: Identifies the associated project.
2. **version**: Specifies the version of the application or service.
3. **owner**: Names the responsible team or individual.
4. **environment**: Indicates the stage in the development lifecycle.

## Auto-Generated Metadata by Bacalhau

Beyond user-defined metadata, Bacalhau automatically injects specific metadata keys for identification and security purposes.

### Bacalhau Auto-Generated Keys:

1. **bacalhau.org/orchestrator.id**: The ID of the orchestrator node that accepted the job.
2. **bacalhau.org/requester.id**: The same orchestrator ID under its legacy key, kept for backward compatibility.
3. **bacalhau.org/client.installation.id** and **bacalhau.org/client.instance.id**: Identify the client installation and client instance that submitted the job, when the client provides them.
4. **bacalhau.org/server.installation.id** and **bacalhau.org/server.instance.id**: Identify the orchestrator installation and instance that handled the job.

Keys under the `bacalhau.org/` prefix are reserved for Bacalhau.

#### Example:

```json
"Meta": {
    "bacalhau.org/orchestrator.id": "node-0",
    "bacalhau.org/requester.id": "node-0",
    "bacalhau.org/client.installation.id": "c5a5f4a4-2b6e-4c58-9a57-4c1f0c3b8d21",
    "bacalhau.org/client.instance.id": "0d2c1b5e-6f3a-4e7b-8c9d-1a2b3c4d5e6f"
}
```

### Implications and Utility

1. **Identification**: The metadata aids in uniquely identifying jobs and tasks, connecting them to their originators and executors.
2. **Context Enhancement**: Metadata can supplement jobs and tasks with additional data, offering insights and context that aren't captured by standard parameters.
3. **Traceability**: Auto-generated keys record which orchestrator and client handled a job, which helps when debugging across a cluster.

While the `Meta` block is distinct from the [`Labels`](label.md) block used for filtering, its contribution to providing context, security, and traceability is integral in managing and understanding the diverse jobs and tasks within the Bacalhau ecosystem effectively.

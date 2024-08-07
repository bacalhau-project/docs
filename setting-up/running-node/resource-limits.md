# Limits and Timeouts

## Resource Limits <a href="#resource-limits" id="resource-limits"></a>

These are the flags that control the capacity of the Bacalhau node, and the limits for jobs that might be run.

```bash
  --limit-job-cpu string                 Job CPU core limit for single job (e.g. 500m, 2, 8).
  --limit-job-gpu string                 Job GPU limit for single job (e.g. 1, 2, or 8).
  --limit-job-memory string              Job Memory limit for single job  (e.g. 500Mb, 2Gb, 8Gb).
  --limit-total-cpu string               Total CPU core limit to run all jobs (e.g. 500m, 2, 8).
  --limit-total-gpu string               Total GPU limit to run all jobs (e.g. 1, 2, or 8).
  --limit-total-memory string            Total Memory limit to run all jobs  (e.g. 500Mb, 2Gb, 8Gb).
```

The `--limit-total-*` flags control the total system resources you want to give to the network. If left blank, the system will attempt to detect these values automatically.

The `--limit-job-*` flags control the maximum amount of resources a single job can consume for it to be selected for execution.

Resource limits are not supported for Docker jobs running on Windows. Resource limits will be applied at the job bid stage based on reported job requirements but will be silently unenforced. Jobs will be able to access as many resources as requested at runtime.[​](http://localhost:3000/setting-up/running-node/resource-limits#windows-support)

## Windows Support

Running a Windows-based node is not officially supported, so your mileage may vary. Some features (like [resource limits](resource-limits.md#resource-limits)) are not present in Windows-based nodes.

Bacalhau currently makes the assumption that all containers are Linux-based. Users of the Docker executor will need to manually ensure that their Docker engine is running and [configured appropriately](https://docs.docker.com/desktop/install/windows-install/) to support Linux containers, e.g. using the WSL-based backend.[​](http://localhost:3000/setting-up/running-node/resource-limits#timeouts)

### Timeouts

Bacalhau can limit the total time a job spends executing. A job that spends too long executing will be cancelled, and no results will be published.

By default, a Bacalhau node does not enforce any limit on job execution time. Both node operators and job submitters can supply a maximum execution time limit. If a job submitter asks for a longer execution time than permitted by a node operator, their job will be rejected.

Applying job timeouts allows node operators to more fairly distribute the work submitted to their nodes. It also protects users from transient errors that result in their jobs waiting indefinitely.[​](http://localhost:3000/setting-up/running-node/resource-limits#configuring-execution-time-limits-for-a-job)

### Configuring Execution Time Limits

{% tabs %}
{% tab title="Job" %}
Job submitters can pass the `--timeout` flag to any Bacalhau job submission CLI to set a maximum job execution time. The supplied value should be a whole number of seconds with no unit.

The timeout can also be added to an existing job spec by adding the `Timeout` property to the `Spec`.
{% endtab %}

{% tab title="Node" %}
Node operators can pass the `--max-job-execution-timeout` flag to `bacalhau serve` to configure the maximum job time limit. The supplied value should be a numeric value followed by a time unit (one of `s` for seconds, `m` for minutes or `h` for hours).

Node operators can also use configuration properties to configure execution limits.

Compute nodes will use the properties:

<table><thead><tr><th width="370">Config property</th><th>Meaning</th></tr></thead><tbody><tr><td><code>Node.Compute.JobTimeouts.MinJobExecutionTimeout</code></td><td>The minimum acceptable value for a job timeout. A job will only be accepted if it is submitted with a timeout of longer than this value.</td></tr><tr><td><code>Node.Compute.JobTimeouts.MaxJobExecutionTimeout</code></td><td>The maximum acceptable value for a job timeout. A job will only be accepted if it is submitted with a timeout of shorter than this value.</td></tr><tr><td><code>Node.Compute.JobTimeouts.DefaultJobExecutionTimeout</code></td><td>The job timeout that will be applied to jobs that are submitted without a timeout value.</td></tr></tbody></table>

Requester nodes will use the properties:

<table><thead><tr><th width="374">Config property</th><th>Meaning</th></tr></thead><tbody><tr><td><code>Node.Requester.Timeouts.MinJobExecutionTimeout</code></td><td>If a job is submitted with a timeout less than this value, the default job execution timeout will be used instead.</td></tr><tr><td><code>Node.Requester.Timeouts.DefaultJobExecutionTimeout</code></td><td>The timeout to use in the job if a timeout is missing or too small.</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

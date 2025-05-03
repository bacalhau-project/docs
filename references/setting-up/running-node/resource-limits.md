# Limits and Timeouts

## Resource Limits <a href="#resource-limits" id="resource-limits"></a>

These are the configuration keys that control the capacity of the Bacalhau node, and the limits for jobs that might be run.

| Configuration key                | Description                                                                                                                                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Compute.AllocatedCapacity.CPU    | <p>Specifies the amount of CPU a compute node allocates for running jobs. It<br>can be expressed as a percentage (e.g., <code>85%</code>) or a Kubernetes resource string</p>                                                                                                                    |
| Compute.AllocatedCapacity.Disk   | <p>Specifies the amount of Disk space a compute node allocates for running<br>jobs. It can be expressed as a percentage (e.g., <code>85%</code>) or a Kubernetes resource string (e.g., <code>10Gi</code>)</p>                                                                                   |
| Compute.AllocatedCapacity.GPU    | <p>Specifies the amount of GPU a compute node allocates for running jobs. It can be expressed as a percentage (e.g., <code>85%</code>) or a Kubernetes resource string (e.g., <code>1</code>). </p><p>Note: When using percentages, the result is always rounded up to the nearest whole GPU</p> |
| Compute.AllocatedCapacity.Memory | Specifies the amount of Memory a compute node allocates for running jobs. It can be expressed as a percentage (e.g., `85%`) or a Kubernetes resource  string (e.g., `1Gi`)                                                                                                                       |

It is also possible to additionally specify the number of resources to be allocated to each job by default, if the required number of resources is not specified in the job itself. `JobDefaults.<`[`Job type`](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/job/type)`>.Task.Resources.<Resource Type>` configuration keys are used for this purpose. E.g. to provide each [Ops](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/job/type) job with 2Gb of RAM the following key is used: `JobDefaults.Ops.Task.Resources.Memory`:

```bash
bacalhau config set JobDefaults.Ops.Task.Resources.Memory=2Gi
```

See the complete [configuration keys list](../../guides/configuration-management/write-a-config.yaml.md) for more details.

Resource limits are not supported for Docker jobs running on Windows. Resource limits will be applied at the job bid stage based on reported job requirements but will be silently unenforced. Jobs will be able to access as many resources as requested at runtime.[​](http://localhost:3000/setting-up/running-node/resource-limits#windows-support)

## Windows Support

Running a Windows-based node is not officially supported, so your mileage may vary. Some features (like [resource limits](resource-limits.md#resource-limits)) are not present in Windows-based nodes.

Bacalhau currently makes the assumption that all containers are Linux-based. Users of the Docker executor will need to manually ensure that their Docker engine is running and [configured appropriately](https://docs.docker.com/desktop/install/windows-install/) to support Linux containers, e.g. using the WSL-based backend.[​](http://localhost:3000/setting-up/running-node/resource-limits#timeouts)

### Timeouts

Bacalhau can limit the total time a job spends executing. A job that spends too long executing will be cancelled, and no results will be published.

By default, a Bacalhau node does not enforce any limit on job execution time. Both node operators and job submitters can supply a maximum execution time limit. If a job submitter asks for a longer execution time than permitted by a node operator, their job will be rejected.

Applying job timeouts allows node operators to more fairly distribute the work submitted to their nodes. It also protects users from transient errors that result in their jobs waiting indefinitely.[​](http://localhost:3000/setting-up/running-node/resource-limits#configuring-execution-time-limits-for-a-job)

### Configuring Execution Time Limits

<Tabs>
<TabItem value="Job" label="Job">
Job submitters can pass the `--timeout` flag to any Bacalhau job submission CLI to set a maximum job execution time. The supplied value should be a whole number of seconds with no unit.

The timeout can also be added to an existing job spec by adding the `Timeout` property to the `Spec`.
</TabItem>

<TabItem value="Node" label="Node">
Node operators can use configuration keys to specify default and maximum job execution time limits. The supplied values should be a numeric value followed by a time unit (one of `s` for seconds, `m` for minutes or `h` for hours).

Here is a list of the relevant properties:

| JobDefaults.**Batch**.Task.Timeouts.**ExecutionTimeout**    | Default value for batch job execution timeouts on your current compute node. It will be assigned to batch jobs with no timeout requirement defined  |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| JobDefaults.**Ops**.Task.Timeout&#x73;**.ExecutionTimeout** | Default value for ops job execution timeouts on your current compute node. It will be assigned to ops jobs with no timeout requirement defined      |
| JobDefaults.**Batch.**&#x54;ask.Timeouts.**TotalTimeout**   | Default value for the maximum execution timeout this compute node supports for batch jobs. Jobs with higher timeout requirements will not be bid on |
| JobDefaults.**Ops.**&#x54;ask.Timeouts.**TotalTimeout**     | Default value for the maximum execution timeout this compute node supports for ops jobs. Jobs with higher timeout requirements will not be bid on   |

Note, that timeouts can not be configured for Daemon and Service jobs.
</TabItem>
</Tabs>

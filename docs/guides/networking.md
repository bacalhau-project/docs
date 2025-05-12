# Networking

By default, Bacalhau jobs have network access. This is configured at the node level and can be restricted based on your infrastructure requirements and security policies.

## Specifying Job Network Access

To run Docker jobs on Bacalhau with different network access levels, you can specify one of the following:

1. **host**: unfiltered network access for any protocol `--network=host` (default)
2. **http**: HTTP(S)-only network access to a specified list of domains `--network=http`
3. **none**: no network access `--network=none`

:::info
Specifying `none` will still allow Bacalhau to download and upload data before and after the job using a Publisher.
:::

Jobs using `http` must specify the domains they want to access when the job is submitted.

So, putting it together the job run should look like this:

```bash
bacalhau docker run --network=host alpine curl https://google.com
```

Jobs with `http` networking will be provided with [`http_proxy` and `https_proxy` environment variables](https://about.gitlab.com/blog/2021/01/27/we-need-to-talk-no-proxy/) which contain a TCP address of an HTTP proxy to connect through. Most tools and libraries will use these environment variables by default. If not, they must be used by user code to configure HTTP proxy usage. Note that proxy environment variables are only provided in `http` mode, not in `host` mode.

The required networking can be specified using the `--network` flag. For `http` networking, the required domains can be specified using the `--domain` flag, multiple times for as many domains as required. Specifying a domain starting with a `.` means that all sub-domains will be included. For example, specifying `.example.com` will cover `some.thing.example.com` as well as `example.com`.

:::info
If you encounter the following (or any DNS) error, you likely set the `--network=none` flag or are connecting to a node that has network access disabled:
:::

```
Execution e-0d59d223: error:
Failed to fetch: https://pypi.org/simple/pyyaml/
  Caused by: Could not connect, are you offline?
  Caused by: Request failed after 3 retries
  Caused by: error sending request for url (https://pypi.org/simple/pyyaml/)
  Caused by: client error (Connect) Caused by: dns error: failed to lookup address information: Try again
  Caused by: failed to lookup address information: Try again
```

:::warning
Bacalhau jobs are explicitly prevented from starting other Bacalhau jobs, even if a Bacalhau requester node is specified on the HTTP allowlist.
:::

## Setting Up Your Nodes

Network access for jobs is enabled by default at the node level. If you wish to disable it, you can configure this using an Admission Controller setting in the node configuration:

```yaml
Compute:
  Enabled: true
  TLS:
    RequireTLS: true
JobAdmissionControl:
  RejectNetworkedJobs: true
```

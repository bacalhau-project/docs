# Accessing the Internet from Jobs

By default, Bacalhau jobs do not have any access to the internet. This is to keep both compute providers and users safe from malicious activities.

However, by using data volumes, you can read and access your data from within jobs and write back results.

## Specifying Jobs to Access the Internet

To run Docker jobs on Bacalhau to access the internet, you'll need to specify one of the following:

1. **full**: unfiltered networking for any protocol `--network=full`
2. **http**: HTTP(S)-only networking to a specified list of domains `--network=http`
3. **none**: no networking at all, the default `--network=none`

{% hint style="info" %}
Specifying `none` will still allow Bacalhau to download and upload data before and after the job using a Publisher.
{% endhint %}

Jobs using `http` must specify the domains they want to access when the job is submitted.

Jobs will be provided with [`http_proxy` and `https_proxy` environment variables](https://about.gitlab.com/blog/2021/01/27/we-need-to-talk-no-proxy/) which contain a TCP address of an HTTP proxy to connect through. Most tools and libraries will use these environment variables by default. If not, they must be used by user code to configure HTTP proxy usage.

The required networking can be specified using the `--network` flag. For `http` networking, the required domains can be specified using the `--domain` flag, multiple times for as many domains as required. Specifying a domain starting with a `.` means that all sub-domains will be included. For example, specifying `.example.com` will cover `some.thing.example.com` as well as `example.com`.

{% hint style="warning" %}
Bacalhau jobs are explicitly prevented from starting other Bacalhau jobs, even if a Bacalhau requester node is specified on the HTTP allowlist.
{% endhint %}

### Setting Up Your Nodes
Submitting a job is the first part, the second part is ensuring your network can handle networking. You can set nodes up to accept jobs using an Admission Controller setting in the node config. For example:
```yaml
Compute:
  Enabled: true
  TLS:
    RequireTLS: true
JobAdmissionControl:
  AcceptNetworkedJobs: true
```

# Step 1: Install the Bacalhau CLI

## Install the Bacalhau CLI

In this tutorial, you'll learn how to install and run a job with the Bacalhau client using the Bacalhau CLI or Docker.

The Bacalhau client is a command-line interface (CLI) that allows you to submit jobs to the Bacalhau. The client is available for Linux, macOS, and Windows. You can also run the Bacalhau client in a Docker container.

{% hint style="info" %}
By default, you will submit to the Bacalhau public network, but the same CLI can be configured to submit to a private Bacalhau network. For more information, please read Running [Bacalhau on a Private Network](broken-reference).
{% endhint %}

To install the CLI, choose your ennvironment, and run the command(s) below.

{% tabs %}
{% tab title="Linux/macOS (CLI)" %}
You can install or update the Bacalhau CLI by running the commands in a terminal. You may need sudo mode or root password to install the local Bacalhau binary to `/usr/local/bin`:

```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```
{% endtab %}

{% tab title="Windows (CLI)" %}
Windows users can download the [latest release tarball from Github](https://github.com/bacalhau-project/bacalhau/releases) and extract `bacalhau.exe` to any location available in the PATH environment variable.
{% endtab %}

{% tab title="Docker" %}
```bash
docker pull ghcr.io/bacalhau-project/bacalhau:latest
```

To run a specific version of Bacalhau using Docker, use the command `docker run -it docker.io/bacalhauproject/bacalhau:vX.Y.Z`, where `vX.Y.Z` is the version you want to run.
{% endtab %}
{% endtabs %}

### Verify the Installation

To verify installation and check the version of the client and server, use the `version` command. To run a Bacalhau client command with Docker, prefix it with `docker run ghcr.io/bacalhau-project/bacalhau:latest`.

{% tabs %}
{% tab title="Linux/macOS/Windows (CLI)" %}
```bash
bacalhau version
```
{% endtab %}

{% tab title="Docker" %}
```bash
docker run -it ghcr.io/bacalhau-project/bacalhau:latest version
```
{% endtab %}
{% endtabs %}

If you're wondering which server is being used, the Bacalhau Project has a demo network that's shared with the community. This network allows you to familiarize with Bacalhau's capabilities and launch jobs from your computer without maintaining a compute cluster on your own.

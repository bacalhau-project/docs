---
title: curl -sL https://get.bacalh...
---

{% tabs %}
{% tab title="Linux/macOS (CLI)" %}
```bash
curl -sL https://get.bacalhau.org/install.sh | bash
```

* This fetches the latest Bacalhau release and places it in `/usr/local/bin` or a similar path.
* You many need sudo mode or root access to install the binary at the desired path
{% endtab %}

{% tab title="Windows (CLI)" %}
Windows users can download the [latest release tarball from Github](https://github.com/bacalhau-project/bacalhau/releases) and extract `bacalhau.exe` to any location available in the PATH environment variable.
{% endtab %}

{% tab title="Docker" %}
**Base Image**

```bash
docker pull ghcr.io/bacalhau-project/bacalhau:latest
```

* Suitable for running orchestrators, clients or compute nodes with no docker support

\
**Docker in Docker**

```bash
docker pull ghcr.io/bacalhau-project/bacalhau:latest-dind
```

* Suitable for running compute nodes that can run docker based jobs
* Require `--privileged`mode when running the container
{% endtab %}
{% endtabs %}

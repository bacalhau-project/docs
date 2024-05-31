# Windows support

Running a Windows-based node is not officially supported, so your mileage may vary. Some features (like [resource limits](resource-limits.md)) are not present in Windows-based nodes.

Bacalhau currently makes the assumption that all containers are Linux-based. Users of the Docker executor will need to manually ensure that their Docker engine is running and [configured appropriately](https://docs.docker.com/desktop/install/windows-install/) to support Linux containers, e.g. using the WSL-based backend.

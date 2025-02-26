# Table of contents

## Operators & Deployment <a href="#operations" id="operations"></a>

* [Deployment Guide](README.md)
  * [Setting Up a Cluster on Amazon Web Services (AWS) with Terraform 🚀](operations/deployment-guide/setting-up-a-cluster-on-amazon-web-services-aws-with-terraform.md)
  * [Setting Up a Cluster on Google Cloud Platform (GCP) With Terraform 🚀](operations/deployment-guide/setting-up-a-cluster-on-google-cloud-platform-gcp-with-terraform.md)
  * [Setting Up a Cluster on Azure with Terraform 🚀](operations/deployment-guide/setting-up-a-cluster-on-azure-with-terraform.md)
  * [Marketplace Deployments](operations/deployment-guide/marketplace-deployments/README.md)
    * [Google Cloud Marketplace](operations/deployment-guide/marketplace-deployments/google-cloud-marketplace.md)

## Setting Up

* [Running Nodes](setting-up/running-node/README.md)
  * [Node Onboarding](setting-up/running-node/quick-start-docker.md)
  * [GPU Installation](setting-up/running-node/gpu.md)
  * [Job selection policy](setting-up/running-node/job-selection.md)
  * [Access Management](setting-up/running-node/auth.md)
  * [Persistent State](setting-up/running-node/databases.md)
  * [Configuring Your Input Sources](setting-up/running-node/storage-providers.md)
  * [Configuring Transport Level Security](setting-up/running-node/configuring-tls.md)
  * [Limits and Timeouts](setting-up/running-node/resource-limits.md)
  * [Bacalhau WebUI](setting-up/running-node/webui.md)
* [Workload Onboarding](setting-up/workload-onboarding/README.md)
  * [Container](setting-up/workload-onboarding/container/README.md)
    * [Docker Workload Onboarding](setting-up/workload-onboarding/container/docker-workload-onboarding.md)
    * [WebAssembly (Wasm) Workloads](setting-up/workload-onboarding/container/wasm-workload-onboarding.md)
    * [Bacalhau Docker Image](setting-up/workload-onboarding/container/index.md)
    * [How To Work With Custom Containers in Bacalhau](setting-up/workload-onboarding/container/index-1.md)
  * [Python](setting-up/workload-onboarding/python/README.md)
    * [Building and Running Custom Python Container](setting-up/workload-onboarding/python/building-and-running-custom-python-container.md)
    * [Running Pandas on Bacalhau](setting-up/workload-onboarding/python/running-pandas-on-bacalhau.md)
    * [Running a Python Script](setting-up/workload-onboarding/python/running-a-python-script.md)
    * [Running Jupyter Notebooks on Bacalhau](setting-up/workload-onboarding/python/index-3.md)
    * [Scripting Bacalhau with Python](setting-up/workload-onboarding/python/index-4.md)
  * [R (language)](setting-up/workload-onboarding/r-custom-docker-prophet/README.md)
    * [Building and Running your Custom R Containers on Bacalhau](setting-up/workload-onboarding/r-custom-docker-prophet/index.md)
    * [Running a Simple R Script on Bacalhau](setting-up/workload-onboarding/r-custom-docker-prophet/running-a-simple-r-script-on-bacalhau.md)
  * [Run CUDA programs on Bacalhau](setting-up/workload-onboarding/run-cuda-programs-on-bacalhau.md)
  * [Running a Prolog Script](setting-up/workload-onboarding/index-1.md)
  * [Reading Data from Multiple S3 Buckets using Bacalhau](setting-up/workload-onboarding/index-2.md)
  * [Running Rust programs as WebAssembly (WASM)](setting-up/workload-onboarding/index-3.md)
  * [Generate Synthetic Data using Sparkov Data Generation technique](setting-up/workload-onboarding/index-4.md)
* [Networking Instructions](setting-up/networking-instructions/README.md)
  * [Accessing the Internet from Jobs](setting-up/networking-instructions/networking.md)
  * [Utilizing NATS.io within Bacalhau](setting-up/networking-instructions/utilizing-nats.io-within-bacalhau.md)
* [GPU Workloads Setup](setting-up/gpu.md)
* [Automatic Update Checking](setting-up/update-checks.md)
* [Node Management](setting-up/node_management.md)
* [Authentication & Authorization](setting-up/auth_flow.md)
* [Inter-Nodes TLS](setting-up/inter-nodes-tls.md)
* [Hardware Setup](setting-up/hardware-setup.md)

## Developer Resources <a href="#developers" id="developers"></a>

* [Running Locally In Devstack](developers/running-locally.md)

## Guides

* [Jobs Guide](guides/jobs/README.md)
  * [Queuing](guides/jobs/job-queuing.md)
  * [Labels and Constraints](guides/jobs/using-labels-and-constraints.md)
* [Configuration Management](guides/configuration-management/README.md)
  * [Write a config.yaml](guides/configuration-management/write-a-config.yaml.md)

## Help & FAQ

* [Bacalhau FAQs](help-and-faq/faqs.md)
* [Glossary](help-and-faq/glossary.md)
* [Release Notes](help-and-faq/release-notes/README.md)
  * [v1.6.0 Release Notes](help-and-faq/release-notes/v1.6.0-release-notes.md)
  * [v1.5.0 Release Notes](help-and-faq/release-notes/v1.5.0-release-notes.md)
  * [v1.4.0 Release Notes](help-and-faq/release-notes/release-notes.md)

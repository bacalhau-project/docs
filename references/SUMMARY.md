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
    * [Running a Python Script](setting-up/workload-onboarding/python/running-a-python-script.md)
  * [Run CUDA programs on Bacalhau](setting-up/workload-onboarding/run-cuda-programs-on-bacalhau.md)
  * [Running Rust programs as WebAssembly (WASM)](setting-up/workload-onboarding/index-3.md)
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

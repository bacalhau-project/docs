# Setting Up a Cluster on Amazon Web Services (AWS) with Terraform

## Setting Up Your Bacalhau Multi-Region Cluster on AWS 🚀

Welcome to the guide for setting up your own Bacalhau cluster across multiple AWS regions! This guide will walk you through creating a robust, distributed compute cluster that's perfect for running your Bacalhau workloads.

### What You'll Build

Think of this as building your own distributed supercomputer! Your cluster will provision compute nodes spread across different AWS regions for global coverage.

### Before You Start

You'll need a few things ready:

* Terraform (version 1.0.0 or newer)
* AWS CLI installed and configured
* An active AWS account with appropriate permissions
* Your AWS credentials configured
* An SSH key pair for securely accessing your nodes
* A Bacalhau network

{% include "../../.gitbook/includes/we-recommend-using-expanso-... (1).md" %}

### Quick Setup Guide

1. First, set up an orchestrator node. We recommend using [Expanso Cloud](https://cloud.expanso.io/) for this! But you can always set up your own - follow the instructions [here](https://docs.bacalhau.org/getting-started/create-private-network#start-initial-orchestrator-node).
2.  Create your environment configuration file:

    ```bash
    cp env.tfvars.example.json env.tfvars.json
    ```
3.  Fill in your AWS details in `env.tfvars.json`:

    ```json
    {
        "app_name": "bacalhau",
        "app_tag": "bacalhau-cluster",
        "bacalhau_installation_id": "EXAMPLE-c5c1-44fd-a0f3-1b90488f1b68",
        "bacalhau_data_dir": "/bacalhau_data",
        "bacalhau_node_dir": "/bacalhau_node",
        "username": "bacalhau-runner",
        "public_key_path": "/path/to/your/.ssh/id_rsa.pub",
        "private_key_path": "/path/to/your/.ssh/id_rsa"
    }
    ```
4.  Configure your desired regions in `locations.yaml`. Here's an example (we have a full list of these in all\_locations.yaml):

    ```yaml
    - us-west-2:
        region: us-west-2
        zone: us-west-2a
        instance_type: t3.medium
        instance_ami: ami-07d9cf938edb0739b
        node_count: 1
    - eu-central-1:
        region: eu-central-1
        zone: eu-central-1a
        instance_type: t3.medium
        instance_ami: ami-0e54671bdf3c8ed8d
        node_count: 1
    ```

{% hint style="warning" %}
Make sure the AMI exists in the region you need it to! You can confirm this by executing the following command:&#x20;
{% endhint %}

```bash
REGION=us-east-1
IMAGE_SUBSTRING=amzn2-ami-hvm
ARCH=x86_64
aws ec2 describe-images \
--region $REGION \
--filters "Name=name,Values=*$IMAGE_SUBSTRING*" "Name=architecture,Values=$ARCH" \
--query 'sort_by(Images, &CreationDate)[-10:].{AMI:ImageId, Name:Name, CreationDate:CreationDate}' \
--output table \
--no-cli-pager
```

1. Update your Bacalhau config/config.yaml (the defaults are mostly fine, just update the Orchestrator, and Token lines):

```
NameProvider: puuid
API:
  Port: 1234
Compute:
  Enabled: true
  Orchestrators:
    - nats://EXAMPLE-6ed7-4d95-8871-b46153007057.us1.cloud.expanso.dev:4222
  Auth:
    Token: "EXAMPLE.EFukWVffnf5jb9QkpNnwfiBWEk3475csM7ysudpbFTzYBap5c7sWr6"
  TLS:
    RequireTLS: true
  AllowListedLocalPaths:
    - /bacalhau_data:rw
JobAdmissionControl:
  AcceptNetworkedJobs: true
```

1.  Deploy your cluster using the Python deployment script:

    ```bash
    ./deploy.py create
    ```

### Understanding the Configuration

#### Why use a deployment script? Why not use Terraform directly?

Terraform on AWS requires switching to different workspaces when deploying to different availability zones. As a result, we had to setup a separate `deploy.py`  script which switches to each workspace for you under the hood, to make it easier.&#x20;

#### Core Configuration Files

* `env.tfvars.json`: Your main configuration file containing AWS-specific settings\`
* `locations.yaml`: Defines which regions to deploy to and instance configurations
* `config/config.yaml`: Bacalhau node configuration

#### Essential Settings in env.tfvars.json

* `app_name`: Name for your cluster resources
* `app_tag`: Tag for resource management
* `bacalhau_installation_id`: Unique identifier for your cluster
* `username`: SSH username for instances
* `public_key_path`: Path to your SSH public key
* `private_key_path`: Path to your SSH private key
* `bacalhau_config_file_path`: Path to the config file for this compute node (should point at the orchestrator and have the right token)

#### Location Configuration (locations.yaml)

Each region entry requires:

* `region`: AWS region (e.g., us-west-2)
* `zone`: Availability zone (e.g., us-west-2a)
* `instance_type`: EC2 instance type (e.g., t3.medium)
* `instance_ami`: AMI ID for the region
* `node_count`: Number of instances to deploy

### Taking Your Cluster for a Test Drive

Once everything's up and running, let's make sure it works!

1. First, make sure you have the Bacalhau CLI installed. You can read more about installing the CLI [here](https://docs.bacalhau.org/getting-started/installation).
2.  Configure your Bacalhau client:

    ```bash
    bacalhau config set -c API.Host=<orchestrator-ip> # Should be the same orchestrator
                                                      # IP from your config.yaml
    ```
3.  List your compute nodes:

    ```bash
    bacalhau node list
    ```
4.  Run a test job:

    ```bash
    bacalhau docker run ubuntu echo "Hello from my cluster!"
    ```
5.  Check job status:

    ```bash
    bacalhau list
    ```

### Troubleshooting Tips

#### Deployment Issues

*   Verify AWS credentials are properly configured:

    ```bash
    aws sts get-caller-identity
    ```
* Check IAM permissions
* Ensure you have quota available in target regions

#### Node Health Issues

*   SSH into a node:

    ```bash
    ssh -i ~/.ssh/id_rsa bacalhau-runner@<public-ip> # Or whatever username you set
    ```
*   Check Bacalhau service logs:

    ```bash
    journalctl -u bacalhau-startup.service
    ```
*   Check Docker container status:

    ```bash
    docker ps
    docker logs bacalhau-node-bacalhau-node-1
    ```

#### Network Issues

* Verify security group rules (ports 22, 80, and 4222 should be open)
* Check VPC and subnet configurations
* Ensure internet gateway is properly attached

#### Common Solutions

1. If nodes aren't joining the network:
   * Check NATS connection string in config.yaml
   * Verify security group allows port 4222
   * Ensure nodes can reach the orchestrator
2. If jobs aren't running:
   * Check compute is enabled in node config
   * Verify Docker is running properly
   * Check available disk space
3. If deployment fails:
   * Look for errors in Terraform output
   * Check AWS service quotas
   * Verify AMI availability in chosen regions

### Cleanup

Remove all resources:

```bash
./deploy.py destroy
```

#### Monitoring

*   Check node health:

    ```bash
    curl http://<node-ip>/healthz
    ```

### Understanding the Directory Structure

```
setting-up-bacalhau-with-terraform-on-AWS/
├── modules/
│   ├── instance/       # EC2 instance configuration
│   ├── network/        # VPC and subnet setup
│   ├── region/         # Region-specific resources
│   └── securityGroup/  # Security group rules
├── config/             # Bacalhau configuration
├── scripts/           # Deployment and utility scripts
├── locations.yaml     # Region definitions
└── env.tfvars.json    # Environment configuration
```



### Need Help?

If you get stuck or have questions:

* Check out the [official Bacalhau Documentation](https://docs.bacalhau.org/)
* Open an issue in our [GitHub repository](https://github.com/bacalhau-project/bacalhau)
* Join our [Slack](https://bit.ly/bacalhau-project-slack)

We're here to help you get your cluster running smoothly! 🌟

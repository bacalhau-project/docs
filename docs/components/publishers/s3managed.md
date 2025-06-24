---
slug: /publishers/s3managed
---

# Managed S3

Bacalhau's S3 Managed Publisher provides a secure method to publish job results to AWS S3 storage service without requiring compute nodes to have AWS credentials. Only the orchestrator requires access to the S3 bucket, significantly enhancing security in distributed environments. This publisher supports both AWS S3 and other S3-compatible services like MinIO.

## Publisher Parameters
The S3 managed publisher requires no specific parameters to be defined in the job publisher specification. The user only needs to indicate the publisher type as `s3managed`:

```yaml
Publisher:
  Type: "s3managed"
```

## Orchestrator Configuration

The S3 Managed Publisher must be configured in the orchestrator with the following parameters:

1. **Bucket** `(string: <required>)`: The name of the S3 bucket where job results will be stored.
2. **Key** `(string: <optional>)`: The object key within the specified bucket where the task results will be stored.
3. **Region** `(string: <required>)`: The region where the S3 bucket is located.
4. **Endpoint** `(string: <optional>)`: The endpoint URL of the S3 service (for S3-compatible services).
5. **PreSignedURLExpiration** `(string: "1h")`: The duration for which the generated pre-signed URLs are valid. Optional, default duration is 1 hour.

### YAML Configuration Example

```yaml
Publishers:
  Types:
    S3Managed:
      Bucket: "my-result-bucket"
      Key: "bacalhau-managed-publisher"
      Region: "us-east-1"
      Endpoint: "https://custom-s3.example.com"
      PreSignedURLExpiration: "1h"
```

### CLI Configuration Example

```bash
bacalhau serve \
  -c Publishers.Types.S3Managed.Bucket="my-result-bucket" \
  -c Publishers.Types.S3Managed.Key="bacalhau-managed-publisher" \
  -c Publishers.Types.S3Managed.Region="us-east-1" \
  -c Publishers.Types.S3Managed.Endpoint="https://custom-s3.example.com" \
  -c Publishers.Types.S3Managed.PreSignedURLExpiration="1h"
```

## Required AWS Resources
### S3 Bucket

To support this publisher, the S3 bucket specified in the orchestrator configuration must exist. The orchestrator will not attempt to create a bucket if it doesn't exist.

### AWS Credentials

The orchestrator needs to be given AWS credentials that grant both read and write access to the bucket. The orchestrator utilizes the default chain to retrieve them: 
1. **Environment variables**: AWS credentials can be specified using `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables.
2. **Credentials file**: The credentials file typically located at `~/.aws/credentials`.
3. **IAM Roles for Amazon EC2 Instances**: If you're running your tasks within an Amazon EC2 instance, IAM roles can be utilized to provide the necessary permissions and credentials.

For a more detailed overview on AWS credential management and other ways to provide these credentials, please refer to the AWS official documentation on [standardized credentials](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html).

### IAM Policy
To use this publisher, only the orchestrator node needs permissions to access the bucket. The compute nodes and requester nodes do not need any additional permissions.

#### Orchestrator Node
AWS credentials provided to the orchestrator node must grant the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-result-bucket/bacalhau-managed-publisher/*"
    }
  ]
}
```

## Examples

The job specification for using the S3 Managed Publisher is straightforward. Unlike the standard S3 publisher, no additional parameters are required in the job specification:

```yaml
name: managed-publisher-job
type: batch
count: 1
tasks:
  - name: main
    engine:
      type: docker
      params:
        image: busybox:1.37.0
        entrypoint:
          - /bin/sh
        parameters:
          - -c
          - echo Hello, I was stored by Managed Publisher!
    publisher:
      type: s3managed
```

## Caveats
Currently, Bacalhau does not provide lifecycle management for the results stored in the bucket used by this publisher. The user is responsible for managing the content and ensuring it is removed when no longer needed to avoid additional costs.
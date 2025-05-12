# S3 Partitioning

Bacalhau's S3 partitioning feature builds on the [core partitioning](partitioning.mdx) system to automatically handle data distribution from S3 buckets across multiple job executions. This specialized implementation includes graceful failure handling and independent retry of failed partitions specifically optimized for S3 data sources.

## Key Benefits

- **Automatic Data Distribution**: Intelligently distributes S3 objects across partitions
- **Multiple Partitioning Strategies**: Choose from various strategies based on your data organization
- **Clean Processing Logic**: Write code focused on processing, not partitioning
- **Failure Isolation**: Failures are contained to individual partitions
- **Independent Retries**: Failed partitions are retried automatically without affecting successful ones

## Partitioning Strategies

Bacalhau supports multiple S3 partitioning strategies to match different data organization patterns:

### No Partitioning (Shared Data)

When all executions need access to all the data, omit the partition configuration:

```yaml
inputSources:
  - target: /data
    source:
      type: s3
      params:
        bucket: config-bucket
        key: reference-data/
        # No partition config - all executions see all files
```

Perfect for:

- Loading shared reference data
- Processing configuration files
- Running analysis that needs the complete dataset

### Object-Based Distribution

Evenly distributes objects across partitions without specific grouping logic:

```yaml
inputSources:
  - target: /uploads
    source:
      type: s3
      params:
        bucket: data-bucket
        key: user-uploads/
        partition:
          type: object
```

Ideal for:

- Processing large volumes of user uploads
- Handling randomly named files
- Large-scale data transformation tasks

### Date-Based Partitioning

Process each day's data in parallel using a configurable date format:

```yaml
inputSources:
  - target: /logs
    source:
      type: s3
      params:
        bucket: app-logs
        key: 'logs/*'
        partition:
          type: date
          dateFormat: '2006-01-02'
```

Perfect for:

- Daily analytics processing
- Log aggregation and analysis
- Time-series computations

### Regex-Based Partitioning

Distribute data based on patterns in object keys:

```yaml
inputSources:
  - target: /sales
    source:
      type: s3
      params:
        bucket: global-sales
        key: 'regions/*'
        partition:
          type: regex
          pattern: '([^/]+)/.*'
```

Enables scenarios like:

- Regional sales analysis
- Geographic data processing
- Territory-specific reporting

### Substring-Based Partitioning

Distributes data based on substring segments in object keys:

```yaml
inputSources:
  - target: /segments
    source:
      type: s3
      params:
        bucket: customer-data
        key: segments/*
        partition:
          type: substring
          startIndex: 0
          endIndex: 3
```

Perfect for:

- Customer cohort analysis
- Segment-specific processing
- Category-based computations

## Combining Partitioned and Shared Data

You can combine partitioned data with shared reference data in the same job:

```yaml
inputSources:
  - target: /config
    source:
      type: s3
      params:
        bucket: config-bucket
        key: reference/*
        # No partitioning - all executions see all reference data
  - target: /daily-logs
    source:
      type: s3
      params:
        bucket: app-logs
        key: logs/*
        partition:
          type: date
          dateFormat: '2006-01-02'
```

This pattern supports:

- Processing daily logs with shared lookup tables
- Analyzing data using common reference files
- Running calculations that need both partitioned data and shared configuration

## Complete Job Examples

### Example 1: Object-Based Partitioning

Here's a complete job specification using object-based partitioning:

```yaml
name: process-uploads
count: 5
type: batch
tasks:
  - name: process-uploads
    engine:
      type: docker
      params:
        image: ubuntu:latest
        parameters:
          - bash
          - -c
          - |
            echo "Processing partition $BACALHAU_PARTITION_INDEX of $BACALHAU_PARTITION_COUNT"
            file_count=$(find /uploads -type f | wc -l)
            echo "Found $file_count files to process in this partition"
    inputSources:
      - target: /uploads
        source:
          type: s3
          params:
            bucket: data-bucket
            key: user-uploads/
            partition:
              type: object
```

### Example 2: Combining Partitioned and Shared Data

Here's a complete job specification that combines partitioned and shared data sources:

```yaml
name: daily-analysis
count: 7 # Process a week of data
type: batch
tasks:
  - name: daily-analytics
    engine:
      type: docker
      params:
        image: ubuntu:latest
        parameters:
          - bash
          - -c
          - |
            echo "Processing partition $BACALHAU_PARTITION_INDEX of $BACALHAU_PARTITION_COUNT"
            echo "Reference data files:"
            find /config -type f | sort
            echo "Daily log files for this partition:"
            find /daily-logs -type f | wc -l
    inputSources:
      - target: /config
        source:
          type: s3
          params:
            bucket: config-bucket
            key: reference/*
            # No partitioning - all executions see all reference data
      - target: /daily-logs
        source:
          type: s3
          params:
            bucket: app-logs
            key: logs/*
            partition:
              type: date
              dateFormat: '2006-01-02'
    outputs:
      - name: results
        path: /outputs
```

## Usage

To run a job with S3 partitioning, define your job with the appropriate partitioning strategy and set the number of partitions with the `count` parameter, then submit:

```bash
bacalhau job run job-spec.yaml
```

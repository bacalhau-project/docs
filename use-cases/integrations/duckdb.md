---
description: >-
  Extend DuckDB with distributed query execution, partitioned data processing,
  and scalable compute for large-scale analytics.
icon: lightbulb-cfl-on
---

# DuckDB

### Overview

[DuckDB](https://duckdb.org/) is a high-performance, in-process analytical database designed for fast SQL queries on structured data. However, it operates as a **single-instance database**, limiting its ability to efficiently handle large-scale datasets across multiple machines.

Bacalhau extends DuckDB by enabling:

* **Distributed query execution** across multiple compute nodes
* **Partitioning of large datasets** to optimize processing
* **Parallel SQL execution** for improved performance
* **Querying data in-place** without needing to centralize it

This allows users to **scale DuckDB beyond a single node**, making it ideal for distributed data processing and large-scale analytics.

### Limitations of DuckDB (Before Bacalhau)

While DuckDB is powerful for analytical workloads, it has inherent limitations:

* **Single-instance execution**: DuckDB is designed to run on a single machine, limiting scalability.
* **No built-in parallelism**: Queries run on a single node, unable to take advantage of multiple distributed compute resources.
* **Inefficient large-scale processing**: Large datasets require manual partitioning and splitting across multiple queries.

### How Bacalhau Extends DuckDB

To address these limitations, Bacalhau integrates with DuckDB and provides:

1. **Partitioned Query Execution**: Bacalhau distributes queries across nodes, automatically handling partitioning.
2. **Scalable Data Processing**: Users can run SQL queries across large datasets without moving data to a centralized warehouse.
3. **Custom Partitioning Functions**: Bacalhau introduces **User-Defined Functions (UDFs)** that handle partitioning logic natively within DuckDB.

### Partitioning Functions

Bacalhau introduces three User Defined Functions (UDF) for partitioning to improve DuckDB's scalability:

#### 1. Hash-Based Partitioning

Partitions datasets based on a hash function applied to file paths.

```sql
SET VARIABLE my_files = (
    SELECT LIST(file) FROM partition_by_hash('s3://bucket/*.parquet')
);
SELECT * FROM read_parquet(getvariable('my_files'));
```

#### 2. Regex-Based Partitioning

Partitions files based on regex pattern matching, useful for structured filenames.

```sql
SET VARIABLE my_files = (
    SELECT LIST(file) FROM partition_by_regex(
        's3://bucket/data_*.parquet',  
        'data_([A-Z]).*'  
    )
);
SELECT * FROM read_parquet(getvariable('my_files'));
```

#### 3. Date-Based Partitioning

Partitions data based on date patterns in filenames, allowing for time-series data queries.

```sql
SET VARIABLE my_files = (
    SELECT LIST(file) FROM partition_by_date(
        's3://bucket/logs/*.parquet',           
        'logs_(\d{4})(\d{2})(\d{2})\.parquet', 
        'month'                                 
    )
);
SELECT * FROM read_parquet(getvariable('my_files'));
```

### Key Use Cases

#### **1. Distributed Data Processing**

* Run SQL queries across multiple machines without data movement.
* Leverage **Bacalhau’s job orchestration** to distribute and parallelize workloads.

#### **2. Multi-Region Data Warehousing**

* Execute **scatter-gather queries** where data resides, avoiding centralization bottlenecks.
* Process only necessary data partitions instead of querying the entire dataset.

#### **3. Scalable Analytics**

* Perform **interactive and batch analytics** on large-scale datasets.
* Use partition-aware querying to speed up data retrieval and reduce costs.

### Usage Examples

#### 1. Run a Simple Query&#x20;

**Imperative (CLI):**

```bash
bacalhau docker run ghcr.io/bacalhau-project/duckdb \
  "SELECT 'Hello Bacalhau!' as greeting;"
```

**Declarative (YAML):**

```yaml
Name: Simple Query Example
Type: batch
Count: 1
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ghcr.io/bacalhau-project/duckdb
        Parameters:
          - -c
          - "SELECT 42 AS answer;"
```

#### 2. Process Partitioned Log Files

```yaml
Name: Process Logs
Type: batch
Count: 3
Tasks:
  - Name: main
    Engine:
      Type: docker
      Params:
        Image: ghcr.io/bacalhau-project/duckdb
        Parameters:
          - -c
          - >
            SET VARIABLE my_logs = (
              SELECT LIST(file) FROM partition_by_date(
                's3://my-bucket/logs/*.parquet',
                'logs_(\d{4})(\d{2})(\d{2})\.parquet',
                'month'
              )
            );
            SELECT * FROM read_parquet(getvariable('my_logs'));
```

### Why Use Bacalhau with DuckDB?

| Feature                         | Benefit                                                             |
| ------------------------------- | ------------------------------------------------------------------- |
| **Distributed Query Execution** | Run queries in parallel across multiple compute nodes.              |
| **Automatic Partitioning**      | Use built-in UDFs to efficiently split workloads.                   |
| **No Data Movement**            | Process data where it resides, avoiding costly transfers.           |
| **Scalable Analytics**          | Execute SQL queries efficiently across large datasets.              |
| **Stateless Compute**           | Run on-demand queries without needing a persistent database server. |

### Next Steps

To get started with Bacalhau and DuckDB:

1. **Deploy Bacalhau nodes** near the data sources.
2. **Submit distributed queries** using Bacalhau’s CLI or YAML job definitions.
3. **Leverage partitioning** to scale query execution efficiently.

By combining Bacalhau’s distributed execution with DuckDB’s high-performance analytics, users can achieve **scalable, efficient, and cost-effective SQL processing** across large and distributed datasets.

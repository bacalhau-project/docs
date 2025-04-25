# Listing  Jobs

This guide shows you how to view and filter the jobs in your Bacalhau environment. Being able to list jobs is essential for monitoring your workloads and finding specific jobs to inspect further.

### What You'll Learn

* How to list all your jobs
* How to filter jobs by various criteria
* How to customize the output format

### Basic Job Listing

To see your recent jobs, use:

```bash
bacalhau job list
```

By default, this shows your 10 most recent jobs with basic information.

#### Sample Output

```
 CREATED   ID          JOB     TYPE   STATE
 11:01:45  j-f827bd29  docker  batch  Completed
 17:24:37  j-feea35d9  docker  batch  Completed
 ...
 20:14:13  j-edce7319  docker  batch  Completed
To fetch more records use:
	bacalhau job list --limit 10 --next-token Ok46MTA6MTA
```

The output columns show:

* **CREATED**: When the job was created (time)
* **ID**: The job's unique identifier
* **JOB**: The job engine type (usually docker)
* **TYPE**: The job type (batch, service, etc.)
* **STATE**: Current job state (Completed, Running, Pending, Failed, etc.)

### Filtering Your Job List

You can refine your job list using various flags:

#### Limit the Number of Results

```bash
bacalhau job list --limit 5
```

#### Filter by Labels

Labels help organize and categorize your jobs:

```bash
bacalhau job list --labels "env=dev,project=research"
```

More complex label filtering:

```bash
bacalhau job list --labels "region in (us-east-1, us-west-1)"
```

#### Change Result Order

Order by creation time or job ID:

```bash
bacalhau job list --order-by created_at
```

Reverse the order (newest last):

```bash
bacalhau job list --order-reversed
```

#### Pagination

When you have many jobs, the output will include a pagination token:

```bash
# Use the next token from previous results
bacalhau job list --limit 10 --next-token Ok46MTA6MTA
```

### Customizing Output Format

By default, results appear in a table format. You can choose other formats:

#### JSON Output

```bash
bacalhau job list --output json
```

For more readable JSON:

```bash
bacalhau job list --output json --pretty
```

#### YAML Output

```bash
bacalhau job list --output yaml
```

#### CSV Output

Useful for importing into spreadsheets:

```bash
bacalhau job list --output csv
```

### Table Formatting Options

Additional options for table output:

```bash
# Show full values without truncation
bacalhau job list --wide

# Hide the header row
bacalhau job list --hide-header

# Remove table styling
bacalhau job list --no-style
```

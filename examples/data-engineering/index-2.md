# Convert CSV To Parquet Or Avro

## Introduction[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#introduction) <a href="#introduction" id="introduction"></a>

Converting from CSV to parquet or avro reduces the size of the file and allows for faster read and write speeds. With Bacalhau, you can convert your CSV files stored on ipfs or on the web without the need to download files and install dependencies locally.

In this example tutorial we will convert a CSV file from a URL to parquet format and save the converted parquet file to IPFS

## Prerequisites[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#prerequisites) <a href="#prerequisites" id="prerequisites"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## Running CSV to Avro or Parquet Locally​[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#running-csv-to-avro-or-parquet-locally) <a href="#running-csv-to-avro-or-parquet-locally" id="running-csv-to-avro-or-parquet-locally"></a>

### Downloading the CSV file[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#downloading-the-csv-file) <a href="#downloading-the-csv-file" id="downloading-the-csv-file"></a>

Let's download the `transactions.csv` file:

```bash
wget https://cloudflare-ipfs.com/ipfs/QmfKJT13h5k1b23ja3ZCVg5nFL9oKz2bVXc8oXgtwiwhjz/transactions.csv
```

{% hint style="info" %}
You can use the CSV files from [here](https://github.com/datablist/sample-csv-files?tab=readme-ov-file)
{% endhint %}

### Writing the Script[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#writing-the-script) <a href="#writing-the-script" id="writing-the-script"></a>

Write the `converter.py` Python script, that serves as a CSV converter to Avro or Parquet formats:

```python
# converter.py
import os
import sys
from abc import ABCMeta, abstractmethod

import fastavro
import numpy as np
import pandas as pd
from pyarrow import Table, parquet


class BaseConverter(metaclass=ABCMeta):
    """
    Base class for converters.

    Validate received parameters for future use.
    """
    def __init__(
        self,
        csv_file_path: str,
        target_file_path: str,
    ) -> None:
        self.csv_file_path = csv_file_path
        self.target_file_path = target_file_path

    @property
    def csv_file_path(self):
        return self._csv_file_path

    @csv_file_path.setter
    def csv_file_path(self, path):
        if not os.path.isabs(path):
            path = os.path.join(os.getcwd(), path)
        _, extension = os.path.splitext(path)
        if not os.path.isfile(path) or extension != '.csv':
            raise FileNotFoundError(
                f'No such csv file: {path}'
            )
        self._csv_file_path = path

    @property
    def target_file_path(self):
        return self._target_file_path

    @target_file_path.setter
    def target_file_path(self, path):
        if not os.path.isabs(path):
            path = os.path.join(os.getcwd(), path)
        target_dir = os.path.dirname(path)
        if not os.path.isdir(target_dir):
            raise FileNotFoundError(
                f'No such directory: {target_dir}\n'
                'Choose existing or create directory for result file.'
            )
        if os.path.isfile(path):
            raise FileExistsError(
                f'File {path} has already exists.'
                'Usage of existing file may result in data loss.'
            )
        self._target_file_path = path

    def get_csv_reader(self):
        """Return csv reader which read csv file as a stream"""
        return pd.read_csv(
            self.csv_file_path,
            iterator=True,
            chunksize=100000
        )

    @abstractmethod
    def convert(self):
        """Should be implemented in child class"""
        pass


class ParquetConverter(BaseConverter):
    """
    Convert received csv file to parquet file.

    Take path to csv file and path to result file.
    """
    def convert(self):
        """Read csv file as a stream and write data to parquet file."""
        csv_reader = self.get_csv_reader()
        writer = None
        for chunk in csv_reader:
            if not writer:
                table = Table.from_pandas(chunk)
                writer = parquet.ParquetWriter(
                    self.target_file_path, table.schema
                )
            table = Table.from_pandas(chunk)
            writer.write_table(table)
        writer.close()


class AvroConverter(BaseConverter):
    """
    Convert received csv file to avro file.

    Take path to csv file and path to result file.
    """
    NUMPY_TO_AVRO_TYPES = {
        np.dtype('?'): 'boolean',
        np.dtype('int8'): 'int',
        np.dtype('int16'): 'int',
        np.dtype('int32'): 'int',
        np.dtype('uint8'): 'int',
        np.dtype('uint16'): 'int',
        np.dtype('uint32'): 'int',
        np.dtype('int64'): 'long',
        np.dtype('uint64'): 'long',
        np.dtype('O'): ['null', 'string', 'float'],
        np.dtype('unicode_'): 'string',
        np.dtype('float32'): 'float',
        np.dtype('float64'): 'double',
        np.dtype('datetime64'): {
            'type': 'long',
            'logicalType': 'timestamp-micros'
        },
    }

    def get_avro_schema(self, pandas_df):
        """Generate avro schema."""
        column_dtypes = pandas_df.dtypes
        schema_name = os.path.basename(self.target_file_path)
        schema = {
            'type': 'record',
            'name': schema_name,
            'fields': [
                {
                    'name': name,
                    'type': AvroConverter.NUMPY_TO_AVRO_TYPES[dtype]
                } for (name, dtype) in column_dtypes.items()
            ]
        }
        return fastavro.parse_schema(schema)

    def convert(self):
        """Read csv file as a stream and write data to avro file."""
        csv_reader = self.get_csv_reader()
        schema = None
        with open(self.target_file_path, 'a+b') as f:
            for chunk in csv_reader:
                if not schema:
                    schema = self.get_avro_schema(chunk)
                fastavro.writer(
                    f,
                    schema=schema,
                    records=chunk.to_dict('records')
                )


if __name__ == '__main__':
    converters = {
        'parquet': ParquetConverter,
        'avro': AvroConverter
    }
    csv_file, result_path, result_type = sys.argv[1], sys.argv[2], sys.argv[3]
    if result_type.lower() not in converters:
        raise ValueError(
            'Invalid target type. Avalible types: avro, parquet.'
        )
    converter = converters[result_type.lower()](csv_file, result_path)
    converter.convert()
```

{% hint style="info" %}
You can find out more information about `converter.py` [here](https://github.com/bacalhau-project/examples/blob/ef3a657336934261cdfc50b10b8981b691cbf203/data-engineering/csv-to-avro-or-parquet/csv-to-avro-parquet/README.md?plain=1#L4)
{% endhint %}

### Installing Dependencies[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#installing-dependencies) <a href="#installing-dependencies" id="installing-dependencies"></a>

```bash
pip install fastavro numpy pandas pyarrow
```

### Converting CSV file to Parquet format[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#converting-csv-file-to-parquet-format) <a href="#converting-csv-file-to-parquet-format" id="converting-csv-file-to-parquet-format"></a>

```bash
python converter.py <path_to_csv> <path_to_result_file> <extension>
```

In our case:

```bash
python3 converter.py transactions.csv transactions.parquet parquet
```

### Viewing the parquet file:[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#viewing-the-parquet-file) <a href="#viewing-the-parquet-file" id="viewing-the-parquet-file"></a>

```python
import pandas as pd
pd.read_parquet('transactions.parquet').head()
```

## Containerize Script with Docker[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#containerize-script-with-docker) <a href="#containerize-script-with-docker" id="containerize-script-with-docker"></a>

{% hint style="info" %}
You can skip this section entirely and directly go to [Running on Bacalhau](index-2.md#running-a-bacalhau-job)
{% endhint %}

To build your own docker container, create a `Dockerfile`, which contains instructions to build your image.

```docker
FROM python:3.8

RUN apt update && apt install git

RUN git clone https://github.com/bacalhau-project/Sparkov_Data_Generation

WORKDIR /Sparkov_Data_Generation/

RUN pip3 install -r requirements.txt
```

{% hint style="info" %}
See more information on how to containerize your script/app [here](https://docs.docker.com/get-started/02\_our\_app/)
{% endhint %}

### Build the container[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#build-the-container) <a href="#build-the-container" id="build-the-container"></a>

We will run the `docker build` command to build the container:

```bash
docker build -t <hub-user>/<repo-name>:<tag> .
```

Before running the command replace:

**`hub-user`** with your docker hub username. If you don’t have a docker hub account [follow these instructions to create docker account](https://docs.docker.com/docker-id/), and use the username of the account you created

**`repo-name`** with the name of the container, you can name it anything you want

**`tag`** this is not required but you can use the latest tag

In our case:

```bash
docker build -t jsacex/csv-to-arrow-or-parquet .
```

### Push the container[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#push-the-container) <a href="#push-the-container" id="push-the-container"></a>

Next, upload the image to the registry. This can be done by using the Docker hub username, repo name or tag.

```bash
docker push <hub-user>/<repo-name>:<tag>
```

In our case:

```bash
docker push jsacex/csv-to-arrow-or-parquet
```

## Running a Bacalhau Job[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#running-a-bacalhau-job) <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

With the command below, we are mounting the CSV file for transactions from IPFS

```
export JOB_ID=$(bacalhau docker run \
    -i ipfs://QmTAQMGiSv9xocaB4PUCT5nSBHrf9HZrYj21BAZ5nMTY2W  \
    --wait \
    --id-only \
    jsacex/csv-to-arrow-or-parquet \
    -- python3 src/converter.py ../inputs/transactions.csv  ../outputs/transactions.parquet parquet)
```

### Structure of the command[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

Let's look closely at the command above:

1. `bacalhau docker run`: call to Bacalhau
2. `-i ipfs://QmTAQMGiSv9xocaB4PUCT5nSBHrf9HZrYj21BAZ5nMTY2W`: CIDs to use on the job. Mounts them at '/inputs' in the execution.
3. `jsacex/csv-to-arrow-or-parque`: the name and the tag of the docker image we are using
4. `../inputs/transactions.csv` : path to input dataset
5. `../outputs/transactions.parquet parquet`: path to the output
6. `python3 src/converter.py`: execute the script

When a job is submitted, Bacalhau prints out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

### Declarative job description[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#declarative-job-description) <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](../../setting-up/jobs/job.md) format. In this case, the description will look like this:

```yaml
name: Convert CSV To Parquet Or Avro
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: jsacex/csv-to-arrow-or-parquet
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - python3 src/converter.py ../inputs/transactions.csv  ../outputs/transactions.parquet parquet
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs
    InputSources:
      - Target: "/inputs"
        Source:
          Type: "ipfs"
          Params:
            CID: "QmTAQMGiSv9xocaB4PUCT5nSBHrf9HZrYj21BAZ5nMTY2W"
```

The job description should be saved in `.yaml` format, e.g. `convertcsv.yaml`, and then run with the command:

```bash
bacalhau job run convertcsv.yaml
```

## Checking the State of your Jobs[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#checking-the-state-of-your-jobs) <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau list`.

```bash
bacalhau list --id-filter ${JOB_ID} 
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results # Temporary directory to store the results
bacalhau job get ${JOB_ID} --output-dir results # Download the results
```

## Viewing your Job Output[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#viewing-your-job-output) <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

To view the file, run the following command:

```bash
ls results/outputs

transactions.parquet
```

Alternatively, you can do this:

```python
import pandas as pd
import os
pd.read_parquet('results/outputs/transactions.parquet')
```

## Support[​](http://localhost:3000/examples/data-engineering/csv-to-avro-or-parquet/#support) <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

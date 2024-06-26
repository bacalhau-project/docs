# Reading Data from Multiple S3 Buckets using Bacalhau

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/bacalhau-project/examples/blob/main/workload-onboarding/Reading-from-Multiple-S3-buckets/index.ipynb) [![Open In Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/bacalhau-project/examples/HEAD?labpath=workload-onboarding/Reading-from-Multiple-S3-buckets/index.ipynb) [![stars - badge-generator](https://img.shields.io/github/stars/bacalhau-project/bacalhau?style=social)](https://github.com/bacalhau-project/bacalhau)

## Introduction

Bacalhau, a powerful and versatile data processing platform, has recently integrated Amazon Web Services (AWS) S3, allowing users to seamlessly access and process data stored in S3 buckets within their Bacalhau jobs. This integration not only simplifies data input, output, and processing operations but also streamlines the overall workflow by enabling users to store and manage their data effectively in S3 buckets. With Bacalhau, you can process several Large s3 buckets in parallel. In this example, we will walk you through the process of reading data from multiple S3 buckets, converting TIFF images to JPEG format.

### Advantages of Converting TIFF to JPEG

There are several advantages to converting images from TIFF to JPEG format:

1. **Reduced File Size**: JPEG images use lossy compression, which significantly reduces file size compared to lossless formats like TIFF. Smaller file sizes lead to faster upload and download times, as well as reduced storage requirements.
2. **Efficient Processing**: With smaller file sizes, image processing tasks tend to be more efficient and require less computational resources when working with JPEG images compared to TIFF images.
3. **Training Machine Learning Models**: Smaller file sizes and reduced computational requirements make JPEG images more suitable for training machine learning models, particularly when dealing with large datasets, as they can help speed up the training process and reduce the need for extensive computational resources.

## Running the job on Bacalhau

We will use the S3 mount feature to mount bucket objects from s3 buckets. Let’s have a look at the example below:

```bash
-i src=s3://sentinel-s1-rtc-indigo/tiles/RTC/1/IW/10/S/DH/2017/S1A_20170125_10SDH_ASC/Gamma0_VH.tif,dst=/sentinel-s1-rtc-indigo/,opt=region=us-west-2
```

It defines S3 object as input to the job:

1. `sentinel-s1-rtc-indigo`: bucket’s name
2. `tiles/RTC/1/IW/10/S/DH/2017/S1A_20170125_10SDH_ASC/Gamma0_VH.tif`: represents the key of the object in that bucket. The object to be processed is called `Gamma0_VH.tif` and is located in the subdirectory with the specified path.
3. But if you want to specify the entire objects located in the path, you can simply add `*` to the end of the path (`tiles/RTC/1/IW/10/S/DH/2017/S1A_20170125_10SDH_ASC/*`)
4. `dst=/sentinel-s1-rtc-indigo`: the destination to which to mount the s3 bucket object
5. `opt=region=us-west-2` : specifying the region in which the bucket is located

### Prerequisite

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

## 1. Running the job on multiple buckets with multiple objects

In the example below, we will mount several bucket objects from public s3 buckets located in a specific region:

```bash
export JOB_ID=$(bacalhau docker run \
    --wait \
    --id-only \
    --timeout 3600 \
    --publisher=ipfs \
    --memory=10Gb \
    --wait-timeout-secs 3600 \
    -i src=s3://bdc-sentinel-2/s2-16d/v1/075/086/2018/02/18/*,dst=/bdc-sentinel-2/,opt=region=us-west-2  \
    -i src=s3://sentinel-cogs/sentinel-s2-l2a-cogs/28/M/CV/2022/6/S2B_28MCV_20220620_0_L2A/*,dst=/sentinel-cogs/,opt=region=us-west-2 \
    jsacex/gdal-s3)
```

The job has been submitted and Bacalhau has printed out the related `job_id`. We store that in an environment variable so that we can reuse it later on.

## 2. Checking the State of your Jobs

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter=${JOB_ID} --no-style
```

When it says `Published` or `Completed`, that means the job is done, and we can get the results.

**Job information**: You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

**Job download**: You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory (`results`) and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir results # Temporary directory to store the results
bacalhau job get ${JOB_ID} --output-dir results # Download the results
```

## 3. Viewing your Job Output

### Display the image

To view the images, download the job results and open the folder:

```
results/outputs/S2-16D_V1_075086_20180218_B04_TCI.jpg
```

![.png image](../../.gitbook/assets/index\_19\_1.png)

```
results/outputs/B04_TCI.jpg
```

![.jpg image](../../.gitbook/assets/index\_19\_3.png)

## Support

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

# Ethereum Blockchain Analysis with Ethereum-ETL and Bacalhau

## Introduction

Mature blockchains are difficult to analyze because of their size. Ethereum-ETL is a tool that makes it easy to extract information from an Ethereum node, but it's not easy to get working in a batch manner. It takes approximately 1 week for an Ethereum node to download the entire chain (even more in my experience) and importing and exporting data from the Ethereum node is slow.

For this example, we ran an Ethereum node for a week and allowed it to synchronize. We then ran ethereum-etl to extract the information and pinned it on Filecoin. This means that we can both now access the data without having to run another Ethereum node.

But there's still a lot of data and these types of analyses typically need repeating or refining. So it makes absolute sense to use a decentralized network like Bacalhau to process the data in a scalable way.

In this tutorial example, we will run Ethereum-ETL tool on Bacalhau to extract data from an Ethereum node.

## Prerequisite​ <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](broken-reference)

## Analysing Ethereum Data Locally​ <a href="#analysing-ethereum-data-locally" id="analysing-ethereum-data-locally"></a>

First let's download one of the IPFS files and inspect it locally:

```bash
wget -q -O file.tar.gz https://w3s.link/ipfs/bafybeifgqjvmzbtz427bne7af5tbndmvniabaex77us6l637gqtb2iwlwq
tar -xvf file.tar.gz
```

{% hint style="info" %}
You can see the full list of IPFS CIDs in the appendix at the bottom of the page.
{% endhint %}

If you don't already have the Pandas library, let's install it:

```bash
pip install pandas
```

```python
# Use pandas to read in transaction data and clean up the columns
import pandas as pd
import glob

file = glob.glob('output_*/transactions/start_block=*/end_block=*/transactions*.csv')[0]
print("Loading file %s" % file)
df = pd.read_csv(file)
df['value'] = df['value'].astype('float')
df['from_address'] = df['from_address'].astype('string')
df['to_address'] = df['to_address'].astype('string')
df['hash'] = df['hash'].astype('string')
df['block_hash'] = df['block_hash'].astype('string')
df['block_datetime'] = pd.to_datetime(df['block_timestamp'], unit='s')
df.info()

# Total volume per day
df[['block_datetime', 'value']].groupby(pd.Grouper(key='block_datetime', freq='1D')).sum().plot()
```

The following code inspects the daily trading volume of Ethereum for a single chunk (100,000 blocks) of data.

This is all good, but we can do better. We can use the Bacalhau client to download the data from IPFS and then run the analysis on the data in the cloud. This means that we can analyze the entire Ethereum blockchain without having to download it locally.

## Analysing Ethereum Data With Bacalhau​ <a href="#analysing-ethereum-data-with-bacalhau" id="analysing-ethereum-data-with-bacalhau"></a>

To run jobs on the Bacalhau network you need to package your code. In this example, I will package the code as a Docker image.

But before we do that, we need to develop the code that will perform the analysis. The code below is a simple script to parse the incoming data and produce a CSV file with the daily trading volume of Ethereum.

```python
# main.py
import glob, os, sys, shutil, tempfile
import pandas as pd

def main(input_dir, output_dir):
    search_path = os.path.join(input_dir, "output*", "transactions", "start_block*", "end_block*", "transactions_*.csv")
    csv_files = glob.glob(search_path)
    if len(csv_files) == 0:
        print("No CSV files found in %s" % search_path)
        sys.exit(1)
    for transactions_file in csv_files:
        print("Loading %s" % transactions_file)
        df = pd.read_csv(transactions_file)
        df['value'] = df['value'].astype('float')
        df['block_datetime'] = pd.to_datetime(df['block_timestamp'], unit='s')
        
        print("Processing %d blocks" % (df.shape[0]))
        results = df[['block_datetime', 'value']].groupby(pd.Grouper(key='block_datetime', freq='1D')).sum()
        print("Finished processing %d days worth of records" % (results.shape[0]))

        save_path = os.path.join(output_dir, os.path.basename(transactions_file))
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        print("Saving to %s" % (save_path))
        results.to_csv(save_path)

def extractData(input_dir, output_dir):
    search_path = os.path.join(input_dir, "*.tar.gz")
    gz_files = glob.glob(search_path)
    if len(gz_files) == 0:
        print("No tar.gz files found in %s" % search_path)
        sys.exit(1)
    for f in gz_files:
        shutil.unpack_archive(filename=f, extract_dir=output_dir)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print('Must pass arguments. Format: [command] input_dir output_dir')
        sys.exit()
    with tempfile.TemporaryDirectory() as tmp_dir:
        extractData(sys.argv[1], tmp_dir)
        main(tmp_dir, sys.argv[2])
```

Next, let's make sure the file works as expected:

```bash
python main.py . outputs/
```

And finally, package the code inside a Docker image to make the process reproducible. Here I'm passing the Bacalhau default `/inputs` and `/outputs` directories. The `/inputs` directory is where the data will be read from and the `/outputs` directory is where the results will be saved to.

```docker
FROM python:3.11-slim-bullseye
WORKDIR /src
RUN pip install pandas==1.5.1
ADD main.py .
CMD ["python", "main.py", "/inputs", "/outputs"]
```

We've already pushed the container, but for posterity, the following command pushes this container to GHCR.

```bash
docker buildx build --platform linux/amd64 --push -t ghcr.io/bacalhau-project/examples/blockchain-etl:0.0.1 .
```

### Running a Bacalhau Job​ <a href="#running-a-bacalhau-job" id="running-a-bacalhau-job"></a>

To run our analysis on the Ethereum blockchain, we will use the `bacalhau docker run` command.

```bash
export JOB_ID=$(bacalhau docker run \
    --id-only \
    --input ipfs://bafybeifgqjvmzbtz427bne7af5tbndmvniabaex77us6l637gqtb2iwlwq:/inputs/data.tar.gz \
    ghcr.io/bacalhau-project/examples/blockchain-etl:0.0.6)
```

The job has been submitted and Bacalhau has printed out the related job id. We store that in an environment variable so that we can reuse it later on.

The `bacalhau docker run` command allows passing input data volume with `--input` or `-i ipfs://CID:path` argument just like Docker, except the left-hand side of the argument is a [content identifier (CID)](https://github.com/multiformats/cid). This results in Bacalhau mounting a _data volume_ inside the container. By default, Bacalhau mounts the input volume at the path `/inputs` inside the container.

Bacalhau also mounts a data volume to store output data. The `bacalhau docker run` command creates an output data volume mounted at `/outputs`. This is a convenient location to store the results of your job.

### Declarative job description​ <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative ](broken-reference)format. In this case, the description will look like this:

```
name: Ethereum Blockchain Analysis with Ethereum-ETL
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        Image: ghcr.io/bacalhau-project/examples/blockchain-etl:0.0.6
    Publisher:
      Type: ipfs
    ResultPaths:
      - Name: outputs
        Path: /outputs
    InputSources:
      - Target: "/inputs/data.tar.gz"
        Source:
          Type: "ipfs"
          Params:
            CID: "bafybeifgqjvmzbtz427bne7af5tbndmvniabaex77us6l637gqtb2iwlwq"
```

The job description should be saved in `.yaml` format, e.g. `blockchain.yaml`, and then run with the command:

Copy

```
bacalhau job run blockchain.yaml
```

## Checking the State of your Jobs​ <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

**Job status**: You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID}
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

## Viewing your Job Output​ <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

To view the file, run the following command:

```bash
ls -lah results/outputs
```

#### Display the image​ <a href="#display-the-image" id="display-the-image"></a>

To view the images, we will use **glob** to return all file paths that match a specific pattern.

```python
import glob
import pandas as pd

# Get CSV files list from a folder
csv_files = glob.glob("results/outputs/*.csv")
df = pd.read_csv(csv_files[0], index_col='block_datetime')
df.plot()
```

<figure><img src="../../.gitbook/assets/Ethereum-Blockchain1-06aeb0d7b41288867785c4e7f39e105e.png" alt=""><figcaption></figcaption></figure>

### Massive Scale Ethereum Analysis​ <a href="#massive-scale-ethereum-analysis" id="massive-scale-ethereum-analysis"></a>

Ok, so that works. Let's scale this up! We can run the same analysis on the entire Ethereum blockchain (up to the point where I have uploaded the Ethereum data). To do this, we need to run the analysis on each of the chunks of data that we have stored on IPFS. We can do this by running the same job on each of the chunks.

See the appendix for the `hashes.txt` file.

```bash
printf "" > job_ids.txt
for h in $(cat hashes.txt); do \
    bacalhau docker run \
    --id-only \
    --wait=false \
    --input=ipfs://$h:/inputs/data.tar.gz \
    ghcr.io/bacalhau-project/examples/blockchain-etl:0.0.6 >> job_ids.txt 
done
```

Now take a look at the job id's. You can use these to check the status of the jobs and download the results:

```bash
cat job_ids.txt

d840df7b-9318-4e5b-ab06-adb72dd95394
09d01f9c-9409-42b9-829d-92e22fcdd062
0072758f-3575-44d7-b193-da4a22f6bc86
2043dee4-fc82-4768-92cb-4d23dd2514b1
36ef8e9e-9eae-4218-81e6-15883d0a5b8d
932aa406-cd29-4933-b09f-c8cea4d77164
1f3e5273-bdd4-4ef0-b7ed-b83591fab64e
8bfabe96-54e3-4fee-b344-a0517c683268
1cd588a1-5c76-4f91-ba90-af7931bca596
b9c29531-e1b4-4520-b03d-7406a22bbdb3
8665b8be-24a9-4c78-9913-803d3e3c9a65
06115147-bc83-49e8-bb71-7b447c8ad1bc
84afed3e-831c-462b-a3e3-9a23bc7d6fb8
ed6e55e6-98d3-4bde-8ece-1f05838d489e
...
```

You might want to double-check that the jobs ran ok by doing a `bacalhau job list`.

```bash
bacalhau job list -n 50
```

Wait until all of these jobs have been completed. And then download all the results and merge them into a single directory. This might take a while, so this is a good time to treat yourself to a nice Dark Mild. There's also been some issues in the past communicating with IPFS, so if you get an error, try again.

```bash
for id in $(cat job_ids.txt); do \
    rm -rf results_$id && mkdir results_$id
    bacalhau job get --output-dir results_$id $id &
done
wait
```

### Display the image​ <a href="#display-the-image-1" id="display-the-image-1"></a>

To view the images, we will use **glob** to return all file paths that match a specific pattern.

```python
import os, glob
import pandas as pd

# Get CSV files list from a folder
path = os.path.join("results_*", "outputs", "*.csv")
csv_files = glob.glob(path)

# Read each CSV file into a list of DataFrames
df_list = (pd.read_csv(file, index_col='block_datetime') for file in csv_files)

# Concatenate all DataFrames
df_unsorted = pd.concat(df_list, ignore_index=False)

# Some files will cross days, so group by day and sum the values
df = df_unsorted.groupby(level=0).sum()

# Plot
df.plot(figsize=(16,9))
```

<figure><img src="../../.gitbook/assets/Ethereum-Blockchain2-ab3710f0ed782425c7d57528db5b88cb.png" alt=""><figcaption></figcaption></figure>

That's it! There are several years of Ethereum transaction volume data.

```bash
rm -rf results_* output_* outputs results temp # Remove temporary results
```

## Appendix: List Ethereum Data CIDs​ <a href="#appendix-list-ethereum-data-cids" id="appendix-list-ethereum-data-cids"></a>

The following list is a list of IPFS CID's for the Ethereum data that we used in this tutorial. You can use these CID's to download the rest of the chain if you so desire. The CIDs are ordered by block number and they increase 50,000 blocks at a time. Here's a list of ordered CIDs:

```python
# hashes.txt
bafybeihvtzberlxrsz4lvzrzvpbanujmab3hr5okhxtbgv2zvonqos2l3i
bafybeifb25fgxrzu45lsc47gldttomycqcsao22xa2gtk2ijbsa5muzegq
bafybeig4wwwhs63ly6wbehwd7tydjjtnw425yvi2tlzt3aii3pfcj6hvoq
bafybeievpb5q372q3w5fsezflij3wlpx6thdliz5xowimunoqushn3cwka
bafybeih6te26iwf5kzzby2wqp67m7a5pmwilwzaciii3zipvhy64utikre
bafybeicjd4545xph6rcyoc74wvzxyaz2vftapap64iqsp5ky6nz3f5yndm
bafybeicgo3iofo3sw73wenc3nkdhi263yytjnds5cxjwvypwekbz4sk7ra
bafybeihvep5xsvxm44lngmmeysihsopcuvcr34an4idz45ixl5slsqzy3y
bafybeigmt2zwzrbzwb4q2kt2ihlv34ntjjwujftvabrftyccwzwdypama4
bafybeiciwui7sw3zqkvp4d55p4woq4xgjlstrp3mzxl66ab5ih5vmeozci
bafybeicpmotdsj2ambf666b2jkzp2gvg6tadr6acxqw2tmdlmsruuggbbu
bafybeigefo3esovbveavllgv5wiheu5w6cnfo72jxe6vmfweco5eq5sfty
bafybeigvajsumnfwuv7lp7yhr2sr5vrk3bmmuhhnaz53waa2jqv3kgkvsu
bafybeih2xg2n7ytlunvqxwqlqo5l3daykuykyvhgehoa2arot6dmorstmq
bafybeihnmq2ltuolnlthb757teihwvvw7wophoag2ihnva43afbeqdtgi4
bafybeibb34hzu6z2xgo6nhrplt3xntpnucthqlawe3pmzgxccppbxrpudy
bafybeigny33b4g6gf2hrqzzkfbroprqrimjl5gmb3mnsqu655pbbny6tou
bafybeifgqjvmzbtz427bne7af5tbndmvniabaex77us6l637gqtb2iwlwq
bafybeibryqj62l45pxjhdyvgdc44p3suhvt4xdqc5jpx474gpykxwgnw2e
bafybeidme3fkigdjaifkjfbwn76jk3fcqdogpzebtotce6ygphlujaecla
bafybeig7myc3eg3h2g5mk2co7ybte4qsuremflrjneer6xk3pghjwmcwbi
bafybeic3x2r5rrd3fdpdqeqax4bszcciwepvbpjl7xdv6mkwubyqizw5te
bafybeihxutvxg3bw7fbwohq4gvncrk3hngkisrtkp52cu7qu7tfcuvktnq
bafybeicumr67jkyarg5lspqi2w4zqopvgii5dgdbe5vtbbq53mbyftduxy
bafybeiecn2cdvefvdlczhz6i4afbkabf5pe5yqrcsgdvlw5smme2tw7em4
bafybeiaxh7dhg4krgkil5wqrv5kdsc3oewwy6ym4n3545ipmzqmxaxrqf4
bafybeiclcqfzinrmo3adr4lg7sf255faioxjfsolcdko3i4x7opx7xrqii
bafybeicjmeul7c2dxhmaudawum4ziwfgfkvbgthgtliggfut5tsc77dx7q
bafybeialziupik7csmhfxnhuss5vrw37kmte7rmboqovp4cpq5hj4insda
bafybeid7ecwdrw7pb3fnkokq5adybum6s5ok3yi2lw4m3edjpuy65zm4ji
bafybeibuxwnl5ogs4pwa32xriqhch24zbrw44rp22hrly4t6roh6rz7j4m
bafybeicxvy47jpvv3fi5umjatem5pxabfrbkzxiho7efu6mpidjpatte54
bafybeifynb4mpqrbsjbeqtxpbuf6y4frrtjrc4tm7cnmmui7gbjkckszrq
bafybeidcgnbhguyfaahkoqbyy2z525d3qfzdtbjuk4e75wkdbnkcafvjei
bafybeiefc67s6hpydnsqdgypbunroqwkij5j26sfmc7are7yxvg45uuh7i
bafybeiefwjy3o42ovkssnm7iihbog46k5grk3gobvvkzrqvof7p6xbgowi
bafybeihpydd3ivtza2ql5clatm5fy7ocych7t4czu46sbc6c2ykrbwk5uu
bafybeiet7222lqfmzogur3zlxqavlnd3lt3qryw5yi5rhuiqeqg4w7c3qu
bafybeihwomd4ygoydvj5kh24wfwk5kszmst5vz44zkl6yibjargttv7sly
bafybeidbjt2ckr4oooio3jsfk76r3bsaza5trjvt7u36slhha5ksoc5gv4
bafybeifyjrmopgtfmswq7b4pfscni46doy3g3z6vi5rrgpozc6duebpmuy
bafybeidsrowz46yt62zs64q2mhirlc3rsmctmi3tluorsts53vppdqjj7e
bafybeiggntql57bw24bw6hkp2yqd3qlyp5oxowo6q26wsshxopfdnzsxhq
bafybeidguz36u6wakx4e5ewuhslsfsjmk5eff5q7un2vpkrcu7cg5aaqf4
bafybeiaypwu2b45iunbqnfk2g7bku3nfqveuqp4vlmmwj7o7liyys42uai
bafybeicaahv7xvia7xojgiecljo2ddrvryzh2af7rb3qqbg5a257da5p2y
bafybeibgeiijr74rcliwal3e7tujybigzqr6jmtchqrcjdo75trm2ptb4e
bafybeiba3nrd43ylnedipuq2uoowd4blghpw2z7r4agondfinladcsxlku
bafybeif3semzitjbxg5lzwmnjmlsrvc7y5htekwqtnhmfi4wxywtj5lgoe
bafybeiedmsig5uj7rgarsjans2ad5kcb4w4g5iurbryqn62jy5qap4qq2a
bafybeidyz34bcd3k6nxl7jbjjgceg5eu3szbrbgusnyn7vfl7facpecsce
bafybeigmq5gch72q3qpk4nipssh7g7msk6jpzns2d6xmpusahkt2lu5m4y
bafybeicjzoypdmmdt6k54wzotr5xhpzwbgd3c4oqg6mj4qukgvxvdrvzye
bafybeien55egngdpfvrsxr2jmkewdyha72ju7qaaeiydz2f5rny7drgzta
```

## Support​ <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

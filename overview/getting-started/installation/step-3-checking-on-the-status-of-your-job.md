# Step 3: Checking on the Status of Your Job

After having deployed the job, we now can use the CLI for the interaction with the network. The jobs were sent to the public demo network, where it was processed and we can call the following functions. The `job_id` will differ for every submission.

You can find out more information about your job by using [`bacalhau job describe`](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/cli/job/describe).

```shell
bacalhau job describe j-de72aeff
```

Let's take a look at the results of the command execution in the terminal:

```shell
ID            = j-de72aeff-0f18-4f70-a07c-1366a0edcb64
Name          = j-de72aeff-0f18-4f70-a07c-1366a0edcb64
Namespace     = default
Type          = batch
State         = Completed
Count         = 1
Created Time  = 2024-10-07 13:32:50
Modified Time = 2024-10-07 13:32:50
Version       = 0

Summary
Completed = 1

Job History
 TIME                 TOPIC         EVENT         
 2024-10-07 15:32:50  Submission    Job submitted 
 2024-10-07 15:32:50  State Update  Running       
 2024-10-07 15:32:50  State Update  Completed     

Executions
 ID          NODE ID     STATE      DESIRED  REV.  CREATED    MODIFIED   COMMENT 
 e-6e4f2db9  n-f1c579e2  Completed  Stopped  6     4m18s ago  4m17s ago          

Execution e-6e4f2db9 History
 TIME                 TOPIC       EVENT                             
 2024-10-07 15:32:50  Scheduling  Requested execution on n-f1c579e2 
 2024-10-07 15:32:50  Execution   Running                           
 2024-10-07 15:32:50  Execution   Completed successfully            

Standard Output
helloWorld
```

This outputs all information about the job, including stdout, stderr, where the job was scheduled, and so on.

### Job Results Download

After the job runs, if it produces any output, the output will be stored according to the [publisher](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/publishers) setting for your job. You can download your job results directly by using `bacalhau job get`.

```shell
bacalhau job get j-de72aeff
```

Depending on selected publisher, this may result in:

```shell
\Fetching results of job 'j-de72aeff'...
Results for job 'j-de72aeff' have been written to...
/home/username/.bacalhau/job-j-de72aeff
```

After the download has finished you should see the following contents in the results directory.

<pre class="language-shell"><code class="lang-shell"><strong>job-j-de72aeff
</strong>├── exitCode
├── outputs
├── stderr
└── stdout
</code></pre>

Each of these files contain the following information:

* **`exitCode`** - the numeric exit code after your job ran (just like if you ran looked at the exit code on your local machine)
* **`outputs`** - a directory of everything you wrote in the job (if using [LocalPublisher](https://app.gitbook.com/s/GSmEKKGEGIXdhfaa5pa3/specifications/publishers/local)).
* **`stderr`** - the output of the [standard error](https://www.gnu.org/software/libc/manual/html_node/Standard-Streams.html) stream of the job.
* **`stdout`** - the output of the [standard out](https://www.gnu.org/software/libc/manual/html_node/Standard-Streams.html) stream of the job.


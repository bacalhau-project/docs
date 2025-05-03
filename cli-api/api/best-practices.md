# Best Practices

:::warning
The API changed in Bacalhau v.1.4.0, which can be seen in the [migration guide](migration-api.md) and the [release notes](broken-reference).
:::

## Introduction

We’re proud to say that we consider ourselves to be an “API-first” organization, that is, every decision we take to make something new in Bacalhau, we build it out from the API first. Everything else, from the SDK to the CLI derives its interface and operations from it. So, let’s take it for a spin!

## Getting info about your nodes

When working with Bacalhau Networks, it’s good to have an idea of how many nodes are on the network, and what they’re capable of running. We can get this information from the \`/api/v1/orchestrator/nodes\` endpoint at the IP address/URL of our Requester node.

```python
import os
import requests
import pprint
import json
import time


# You can set environment variables in your shell too
os.environ['BACALHAU_API_HOST'] = "<YOUR_REQUSTER_NODES_ADDR>"
os.environ['REQUESTER_API_PORT'] = "1234" # Port 1234 by default


REQUESTER_HOST = os.environ["BACALHAU_API_HOST"]
REQUESTER_API_PORT = os.environ['REQUESTER_API_PORT']
REQUESTER_BASE_URL = f"http://{REQUESTER_HOST}:{REQUESTER_API_PORT}"


getNodesInNetworkResp = requests.get(REQUESTER_BASE_URL + "/api/v1/orchestrator/nodes")
nodes_data = None


# Check if the request was successful
if getNodesInNetworkResp.status_code == 200:
    # Parse the JSON response
    nodes_data = getNodesInNetworkResp.json()
    
    # Pretty print the JSON data
    pprint.pprint(nodes_data)
else:
    print(f"Failed to retrieve nodes. HTTP Status code: {getNodesInNetworkResp.status_code}")
    print(f"Response: {getNodesInNetworkResp.text}")
```

This should output something like the following:

```yaml
{'NextToken': '',
 'Nodes': [{'Connection': 'CONNECTED',
            'Info': {'BacalhauVersion': {'BuildDate': '0001-01-01T00:00:00Z',
                                         'GOARCH': '',
                                         'GOOS': '',
                                         'GitCommit': '',
                                         'GitVersion': ''},
                     'ComputeNodeInfo': {'AvailableCapacity': {'CPU': 1.6,
                                                               'Disk': 4619603148,
                                                               'Memory': 3274942054},
                                         'EnqueuedExecutions': 0,
                                         'ExecutionEngines': ['docker', 'wasm'],
                                         'MaxCapacity': {'CPU': 1.6,
                                                         'Disk': 4619603148,
                                                         'Memory': 3274942054},
                                         'MaxJobRequirements': {'CPU': 1.6,
                                                                'Disk': 4619603148,
                                                                'Memory': 3274942054},
                                         'Publishers': ['noop', 'local'],
                                         'QueueCapacity': {},
                                         'RunningExecutions': 0,
                                         'StorageSources': ['urldownload',
                                                            'inline']},
                     'Labels': {'Architecture': 'amd64',
                                'EC2_DISK_GB': '8',
                                'EC2_INSTANCE_FAMILY': 't2',
                                'EC2_MEMORY_GB': '3',
                                'EC2_VCPU_COUNT': '2',
                                'HOSTNAME': 'ip-10-0-0-153.ap-northeast-1.compute.internal',
                                'IP': '54.249.87.141',
                                'ORCHESTRATORS': '35.91.101.81',
                                'Operating-System': 'linux'},
                     'NodeID': 'n-0d2d943b-004d-4712-b7d1-e9ee2dfffbb6',
                     'NodeType': 'Compute'},
            'Membership': 'APPROVED'},
…
]
```

But JSON structures aren’t always the best way to visualize complex systems. Fortunately, we’re working with Python! So, we can use Matplotlib to render out our Bacalhau network structure for us!\


Run the following install commands in your terminal:

```
pip install networkx
pip install matplotlib
```

And then append the following code to our previous code:

```
import matplotlib.pyplot as plt
import networkx as nx

G = nx.Graph()

# Function to truncate NodeID to only show up to the second hyphen
def truncate_node_id(node_id):
    parts = node_id.split('-')
    return '-'.join(parts[:2]) if len(parts) > 3 else node_id


# Find the requester node
requester_node = None
for node in nodes_data['Nodes']:
    if node['Info']['NodeType'] == 'Requester':
        requester_node = truncate_node_id(node['Info']['NodeID'])
        break


if requester_node is None:
    requester_node = 'Requester Node'  # Fallback in case no requester node is found
G.add_node(requester_node, label=requester_node)


# Add the connected nodes
for node in nodes_data['Nodes']:
    if node['Connection'] == 'CONNECTED':
        truncated_node_id = truncate_node_id(node['Info']['NodeID'])
        G.add_node(truncated_node_id, label=truncated_node_id)
        G.add_edge(requester_node, truncated_node_id)


# Plot the graph
plt.figure(figsize=(12, 8))
pos = nx.spring_layout(G)  # positions for all nodes
labels = nx.get_node_attributes(G, 'label')


# Draw the nodes with customized colors and sizes
node_colors = ['orange' if node == requester_node else 'skyblue' for node in G.nodes()]
node_sizes = [1000 if node == requester_node else 750 for node in G.nodes()]  # Reduce size by 50%


nx.draw(G, pos, labels=labels, with_labels=True, node_size=node_sizes, node_color=node_colors, font_size=10, font_weight='bold')
plt.title('Connected Nodes to the Requester Node')
plt.show()
```

We’ll get a handy graph showing us all of our nodes, and which Requester Nodes our Compute Nodes are connected to!

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXdkz1sAezJbE_8zhXFSDAp5gFpywQCLByFipWAtc5JekstQffUfyOV5XkBGT5B_GLJOTYLGQ06ti-kRr1xNzlBwFtLZ1eNm1TbGfHUxYvpbVJwgcqIsEos-cD2PoMZOxH9H1M7wtqJkAZuxjz9GFWyqOmNR?key=eQtgieaWn09rIZB-GzdWCg)&#x20;

#### Creating a Job

Now that we know what nodes we have, what they’re capable of, and how they’re connected to each other, we can start to think about scheduling Jobs.

The simplest Job type that can be executed on a Bacalhau network is a “batch” Job. This is a Job that’s run on the first instance that becomes available to execute it, so no need to worry too much about concurrency or parallelism at this point.\
\
To create a Job and execute it via the API, you can run the following code:

```yaml
import requests
import pprint
import json


job = '''
{
  "Job": {
    "Name": "test-job",
    "Type": "batch",
    "Count": 1,
    "Labels": {
      "foo": "bar",
      "env": "dev"
    },
    "Tasks": [
      {
        "Name": "task1",
        "Engine": {
          "Type": "docker",
          "Params": {
            "Image": "ubuntu:latest",
            "Entrypoint": [
              "echo",
              "hello, world"
            ]
          }
        },
        "Publisher": {
          "Type": "noop"
        }
      }
    ],
    "CreateTime": 1234
  }
}
'''

createJobResp = requests.put(REQUESTER_BASE_URL + "/api/v1/orchestrator/jobs", json=json.loads(job))
createJobRespData = None


if createJobResp.status_code == 200:
    # Parse the JSON response
    createJobRespData = createJobResp.json()
    pprint.pprint(createJobRespData)
else:
    print(f"Failed to retrieve nodes. HTTP Status code: {createJobResp.status_code}")
    print(f"Response: {createJobResp.text}")
```

Once that request completes, the createJobRespData variable will have a value something like the following:

```
{'EvaluationID': 'bb338a13-6abd-4c3f-b0dc-0842117cc95c',
 'JobID': 'j-9c2894ba-106f-4140-87f8-6279a1d07035',
 'Warnings': ['job create time is ignored when submitting a job']}
```

## Getting your Job Details

Now that we’ve submitted a Job, it would probably be helpful to get the results of that execution. And it’s super simple to do so! All we need is to pass the value of the JobID key that we received once we created our job to the \`/api/v1/orchestrator/jobs/{job\_id}/results\` endpoint.

Add the following code to the end of the last block:

```
job_id = createJobRespData["JobID"]


pprint.pprint(job_id)


createJobResp = requests.get(f"{REQUESTER_BASE_URL}/api/v1/orchestrator/jobs/{job_id}/results")


if createJobResp.status_code == 200:
    # Pretty print the JSON data
    pprint.pprint(createJobResp.json())
else:
    print(f"Failed to retrieve nodes. HTTP Status code: {createJobResp.status_code}")
    print(f"Response: {createJobResp.text}")
```

You should get something like this:

```
`{'Items': [], 'NextToken': ''}`
```

But wait! Where are our results? Well, when we created our job, we didn’t specify a publisher to send our results to. This doesn’t doesn’t mean that we span one up for nothing, though. The output of each Job is still stored in our network, and we can retrieve those by accessing our Job \`executions\`.

## Retrieve your Results

Retrieving our Job executions is very similar to retrieving our Job results. This time, we hit the `` `/api/v1/orchestrator/jobs/{job_id}/executions` `` endpoint instead.

Append the following code to the last block we executed:

```python
getJobExecResp = requests.get(f"{REQUESTER_BASE_URL}/api/v1/orchestrator/jobs/{job_id}/executions")
getJobExecRespData = None


if getJobExecResp.status_code == 200:
    # Pretty print the JSON data
    pprint.pprint(getJobExecResp.json())
    getJobExecRespData = getJobExecResp.json()
    
    for item in getJobExecRespData.get("Items", []):
      print(f"Execution ID: {item['ID']}")


      if item["RunOutput"] != None:
        print("Stdout:")
        print(item["RunOutput"]["Stdout"])
        print("-" * 20)  # Separator for readability
      else:
        print(f"No data returned at this point for execution {item['ID']}")


else:
    print(f"Failed to retrieve nodes. HTTP Status code: {createJobResp.status_code}")
    print(f"Response: {createJobResp.text}")
```

And when you run the code again, you should receive something like the following:

```yaml
{'Items': [{'AllocatedResources': {'Tasks': {}},
            'ComputeState': {'Message': 'Accepted job', 'StateType': 7},
            'CreateTime': 1720188410712557538,
            'DesiredState': {'Message': 'execution completed', 'StateType': 2},
            'EvalID': 'bb338a13-6abd-4c3f-b0dc-0842117cc95c',
            'FollowupEvalID': '',
            'ID': 'e-3c81a312-ba8f-4fd9-a1bd-86b0527b2f40',
            'JobID': 'j-9c2894ba-106f-4140-87f8-6279a1d07035',
            'ModifyTime': 1720188411253610712,
            'Name': '',
            'Namespace': 'default',
            'NextExecution': '',
            'NodeID': 'n-d83a84df-8309-4f06-ac42-d07f3806128c',
            'PreviousExecution': '',
            'PublishedResult': {'Type': ''},
            'Revision': 6,
            'RunOutput': {'ErrorMsg': '',
                          'ExitCode': 0,
                          'StderrTruncated': False,
                          'Stdout': 'hello, world\n',
                          'StdoutTruncated': False,
                          'stderr': ''}}],
 'NextToken': ''}
```

This time, we can see that our \`Items\` key has an array of objects which tells us when our Job was executed, where, and what the output of that Job was.&#x20;

The code also prints out the results of each execution of the Job along with it’s execution ID:

```
Execution ID: e-3c81a312-ba8f-4fd9-a1bd-86b0527b2f40
Stdout:
hello, world
```

If we had executed our Job on more than one Node (for instance, if the Job type was an “Ops” or “Service” Job which run on all available Nodes), our code would have output the results for each execution in the same \`Items\` array.

Find more information about the [Bacalhau API](index.md) or see the [API migration guide](migration-api.md).

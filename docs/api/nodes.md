---
description: Nodes API provides a way to query information about the nodes in the cluster.
---

# Nodes

## Describe Node <a href="#describe-node" id="describe-node"></a>

**Endpoint:** `GET /api/v1/orchestrator/nodes/:nodeID`

Retrieve information about a specific node.

**Parameters**:

1. `:nodeID`: Identifier of the node to describe. (e.g. `node-1`)

**Response**:

* **Node**: Detailed information about the requested node: its `Info` (ID, type, labels, compute capabilities and version), `Membership` approval state, `Connection` status and `ConnectionState` heartbeat details.

**Example**:

```bash
curl 127.0.0.1:1234/api/v1/orchestrator/nodes/node-1
{
  "Node": {
    "Info": {
      "NodeID": "node-1",
      "NodeType": "Compute",
      "Labels": {
        "name": "node-1",
        "os_arch": "amd64",
        "os_type": "linux",
        "region": "us-west"
      },
      "SupportedProtocols": [
        "bprotocol/v2",
        "ncl/v1"
      ],
      "ComputeNodeInfo": {
        "ExecutionEngines": [
          "wasm",
          "docker"
        ],
        "Publishers": [
          "local",
          "s3",
          "s3managed",
          "noop",
          "ipfs"
        ],
        "StorageSources": [
          "inline",
          "urldownload",
          "s3",
          "ipfs"
        ],
        "MaxCapacity": {
          "CPU": 12.8,
          "Memory": 53931121049,
          "Disk": 721417073459,
          "GPU": 1
        },
        "QueueCapacity": {},
        "AvailableCapacity": {
          "CPU": 12.8,
          "Memory": 53931121049,
          "Disk": 721417073459,
          "GPU": 1
        },
        "MaxJobRequirements": {
          "CPU": 12.8,
          "Memory": 53931121049,
          "Disk": 721417073459,
          "GPU": 1
        },
        "RunningExecutions": 0,
        "EnqueuedExecutions": 0,
        "address": ""
      },
      "BacalhauVersion": {
        "Major": "1",
        "Minor": "9",
        "GitVersion": "v1.9.6",
        "GitCommit": "a8cd25beef99a56d9b4c23af398b701241ce79e1",
        "BuildDate": "2026-11-25T01:55:56Z",
        "GOOS": "linux",
        "GOARCH": "amd64"
      }
    },
    "Membership": "APPROVED",
    "Connection": "CONNECTED",
    "ConnectionState": {
      "Status": "CONNECTED",
      "LastHeartbeat": "2026-11-25T01:35:26.860014Z",
      "ConnectedSince": "2026-11-25T01:35:21.857935Z",
      "DisconnectedSince": "0001-01-01T00:00:00Z"
    }
  }
}
```

## List Nodes <a href="#list-nodes" id="list-nodes"></a>

**Endpoint:** `GET /api/v1/orchestrator/nodes`

Retrieve a list of nodes.

**Parameters**:

1. `labels`: Use label-based criteria to filter nodes. See [Label Filtering](/guides/labels-and-constraints.md) for usage details.
2. `limit`: Set the maximum number of nodes to return.
3. `next_token`: Utilize this parameter for pagination continuation.
4. `order_by`: Determine the ordering of nodes. Choose between `id`, `type`, `available_cpu`, `available_memory`, `available_disk`, `available_gpu` or `status`. (default is `id`).
5. `reverse`: Opt to reverse the default order of displayed nodes.
6. `filter-approval`: Only return nodes with this approval state: `approved`, `pending` or `rejected`.
7. `filter-status`: Only return nodes with this connection status: `connected` or `disconnected`.

**Response**:

* **Nodes**: List of matching nodes.
* **NextToken** `(string)`: Pagination token.

**Example**:

Find two linux nodes with most available Memory

```bash
curl --get  "127.0.0.1:1234/api/v1/orchestrator/nodes?limit=2&order_by=available_memory&reverse=true" --data-urlencode 'labels=os_type=linux'
{
  "NextToken": "",
  "Nodes": [
    {
      "Info": {
        "NodeID": "node-1",
        "NodeType": "Compute",
        "Labels": {
          "name": "node-1",
          "os_arch": "amd64",
          "os_type": "linux",
          "region": "us-west"
        },
        "SupportedProtocols": [
          "bprotocol/v2",
          "ncl/v1"
        ],
        "ComputeNodeInfo": {
          "ExecutionEngines": [
            "wasm",
            "docker"
          ],
          "Publishers": [
            "local",
            "s3",
            "s3managed",
            "noop",
            "ipfs"
          ],
          "StorageSources": [
            "inline",
            "urldownload",
            "s3",
            "ipfs"
          ],
          "MaxCapacity": {
            "CPU": 12.8,
            "Memory": 53931121049,
            "Disk": 721417073459,
            "GPU": 1
          },
          "QueueCapacity": {},
          "AvailableCapacity": {
            "CPU": 12.8,
            "Memory": 53931121049,
            "Disk": 721417073459,
            "GPU": 1
          },
          "MaxJobRequirements": {
            "CPU": 12.8,
            "Memory": 53931121049,
            "Disk": 721417073459,
            "GPU": 1
          },
          "RunningExecutions": 0,
          "EnqueuedExecutions": 0,
          "address": ""
        },
        "BacalhauVersion": {
          "Major": "1",
          "Minor": "9",
          "GitVersion": "v1.9.6",
          "GitCommit": "a8cd25beef99a56d9b4c23af398b701241ce79e1",
          "BuildDate": "2026-11-25T01:55:56Z",
          "GOOS": "linux",
          "GOARCH": "amd64"
        }
      },
      "Membership": "APPROVED",
      "Connection": "CONNECTED",
      "ConnectionState": {
        "Status": "CONNECTED",
        "LastHeartbeat": "2026-11-25T01:35:26.860014Z",
        "ConnectedSince": "2026-11-25T01:35:21.857935Z",
        "DisconnectedSince": "0001-01-01T00:00:00Z"
      }
    },
    {
      "Info": {
        "NodeID": "node-2",
        "NodeType": "Compute",
        "Labels": {
          "name": "node-2",
          "os_arch": "amd64",
          "os_type": "linux",
          "region": "us-east"
        },
        "SupportedProtocols": [
          "bprotocol/v2",
          "ncl/v1"
        ],
        "ComputeNodeInfo": {
          "ExecutionEngines": [
            "wasm",
            "docker"
          ],
          "Publishers": [
            "local",
            "s3",
            "s3managed",
            "noop",
            "ipfs"
          ],
          "StorageSources": [
            "inline",
            "urldownload",
            "s3",
            "ipfs"
          ],
          "MaxCapacity": {
            "CPU": 3.2,
            "Memory": 12561049190,
            "Disk": 582010404864,
            "GPU": 0
          },
          "QueueCapacity": {},
          "AvailableCapacity": {
            "CPU": 3.2,
            "Memory": 12561049190,
            "Disk": 582010404864,
            "GPU": 0
          },
          "MaxJobRequirements": {
            "CPU": 3.2,
            "Memory": 12561049190,
            "Disk": 582010404864,
            "GPU": 0
          },
          "RunningExecutions": 0,
          "EnqueuedExecutions": 0,
          "address": ""
        },
        "BacalhauVersion": {
          "Major": "1",
          "Minor": "9",
          "GitVersion": "v1.9.6",
          "GitCommit": "a8cd25beef99a56d9b4c23af398b701241ce79e1",
          "BuildDate": "2026-11-25T01:55:56Z",
          "GOOS": "linux",
          "GOARCH": "amd64"
        }
      },
      "Membership": "APPROVED",
      "Connection": "CONNECTED",
      "ConnectionState": {
        "Status": "CONNECTED",
        "LastHeartbeat": "2026-11-25T01:35:26.860014Z",
        "ConnectedSince": "2026-11-25T01:35:21.857935Z",
        "DisconnectedSince": "0001-01-01T00:00:00Z"
      }
    }
  ]
}
```

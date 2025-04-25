# Migration API

{% hint style="warning" %}
The release v.1.4.0 introduced changes to the API and CLI. For more info check out this page and the release notes.
{% endhint %}

From v.1.3.2 onwards the HTTP API has been updated and the following endpoints have been migrated:

| Old API                            | New API                                      |
| ---------------------------------- | -------------------------------------------- |
| /api/v1/requester/list             | GET /api/v1/orchestrator/jobs                |
| /api/v1/requester/nodes            | GET /api/v1/orchestrator/nodes               |
| /api/v1/requester/states           | GET /api/v1/orchestrator/jobs/:jobID         |
| /api/v1/requester/results          | GET /api/v1/orchestrator/jobs/:jobID         |
| /api/v1/requester/events           | GET /api/v1/orchestrator/jobs/:jobID/history |
| /api/v1/requester/submit           | PUT /api/v1/orchestrator/jobs                |
| /api/v1/requester/cancel           | DELETE /api/v1/orchestrator/jobs/:jobID      |
| /api/v1/requester/debug            | GET /api/v1/orchestrator/nodes/:nodeID       |
| /api/v1/requester/websocket/events | GET /api/v1/orchestrator/jobs/:jobID/history |


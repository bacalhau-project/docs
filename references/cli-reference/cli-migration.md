# CLI Migration

{% hint style="warning" %}
Note that in version 1.4.0 the syntax for certain commands has changed. Check out the release notes and the description of the updated commands on this page.
{% endhint %}

In version 1.4.0 of Bacalhau, all legacy commands will be removed. Here’s a breakdown of the old commands and their new equivalents:

| **Old Commands**                                    | **New Commands**                                          |
| --------------------------------------------------- | --------------------------------------------------------- |
| bacalhau _<mark style="color:red;">create</mark>_   | bacalhau _<mark style="color:green;">job run</mark>_      |
| bacalhau _<mark style="color:red;">cancel</mark>_   | bacalhau _<mark style="color:green;">job stop</mark>_     |
| bacalhau _<mark style="color:red;">list</mark>_     | bacalhau _<mark style="color:green;">job list</mark>_     |
| bacalhau _<mark style="color:red;">logs</mark>_     | bacalhau _<mark style="color:green;">job logs</mark>_     |
| bacalhau _<mark style="color:red;">get</mark>_      | bacalhau _<mark style="color:green;">job get</mark>_      |
| bacalhau _<mark style="color:red;">describe</mark>_ | bacalhau _<mark style="color:green;">job describe</mark>_ |
| bacalhau _<mark style="color:red;">id</mark>_       | bacalhau _<mark style="color:green;">agent node</mark>_   |
| bacalhau _<mark style="color:red;">validate</mark>_ | bacalhau _<mark style="color:green;">job validate</mark>_ |

For some commands there are actions required to migrate to Bacalhau v.1.4.0. In your network. In the following view these actions are specified.

Special Attention to create , validate and describe Commands

\


| <p><br></p>          | **Old Command**                                                                                                                   | **New Command**                                                                                           | [**Action Required**](#user-content-fn-1)[^1]                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **create Command**   | <mark style="color:red;">create</mark> accepts a v1beta1 job spec.                                                                | <mark style="color:green;">job run</mark> accepts the current job spec.                                   | Users must update their job specifications to align with the new job run requirements.  |
| **describe Command** | <p><mark style="color:red;">describe</mark> returns a v1beta1 job spec and its corresponding state in YAML format.</p><p><br></p> | <mark style="color:green;">job describe</mark> provides columnar data detailing various parts of the job. | Users should expect a different output format with job describe compared to describe.   |
| **validate Command** | <mark style="color:red;">validate</mark> validates a v1beta1 job spec.                                                            | <mark style="color:green;">job validate</mark> validates the current job spec.                            | v1beta1 job specs will not be considered valid when passed to the job validate command. |

[^1]: These are the steps required to migrate to the new CLI commands

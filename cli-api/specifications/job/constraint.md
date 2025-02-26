# Constraint

A `Constraint` represents a condition that must be met for a compute node to be eligible to run a given job. Operators have the flexibility to manually define node labels when initiating a node using the bacalhau serve command. Additionally, Bacalhau boasts features like automatic resource detection and dynamic labeling, further enhancing its capability.

By defining constraints, you can ensure that jobs are scheduled on nodes that have the necessary requirements or conditions.

### `Constraint` Parameters:

1. **Key**: The name of the attribute or property to check on the compute node. This could be anything from a specific hardware feature, operating system version, or any other node property.
2. **Operator**: Determines the kind of comparison to be made against the `Key`'s value, which can be:
   1. `in`: Checks if the Key's value exists within the provided list of values.
   2. `notin`: Ensures the Key's value doesn't match any in the provided list of values.
   3. `exists`: Verifies that a value for the specified Key is present, regardless of its actual value.
   4. `!`: Confirms the absence of the specified Key. i.e DoesNotExist
   5. `gt`: Assesses if the Key's value is greater than the provided value.
   6. `lt`: Assesses if the Key's value is less than the provided value.
   7. `=` & `==`: Both are used to compare the Key's value for an exact match with the provided value.
   8. `!=`: Ensures the Key's value is not the same as the provided value.
3. **Values (optional)**: A list of values that the node attribute, specified by the `Key`, is compared against using the `Operator`. This is not needed for operators like `exists` or `!`.

### Example:

Consider a scenario where a job should only run on nodes with a GPU and an operating system version greater than `2.0`. The constraints for such a requirement might look like:

```yaml
constraints:
  - key: "hardware.gpu"
    operator: "exists"
  - key: "Operating-System"
    operator: "="
    values: ["linux"]
  - key: "region"
    operator: "in"
    values: ["eu-west-1,eu-west-2"]
```

In this example, the first constraint checks if the node has a GPU, the second constraint ensures the OS is linux, and deployed in eu-west-1 or eu-west-2\`.

### Notes:

1. Constraints are evaluated as a logical AND, meaning all constraints must be satisfied for a node to be eligible.
2. Using too many specific constraints can lead to a job not being scheduled if no nodes satisfy all the conditions.
3. It's essential to balance the specificity of constraints with the broader needs and resources available in the cluster.

# Authentication & Authorization

## Introduction

Robust authentication and authorization mechanisms are essential for maintaining security while enabling seamless collaboration. As of Bacalhau 1.7 release, we introduced a significant overhaul to its authentication and authorization systems, offering more flexibility, improved security, and better integration with enterprise environments.

## 1. Bacalhau Authentication

With Bacalhau 1.7, we have introduced three distinct authentication paths, each designed to cater to different use cases and environments. The authentication paths are:

1. **Basic HTTP Authentication**
2. **API Tokens Auth**
3. **Single Sign-On via OAuth 2.0**

### 1.1 HTTP Basic Authentication

The simplest approach leverages the time-tested HTTP Basic Authentication protocol, allowing users to access Bacalhau APIs using traditional username and password credentials. These credentials can be defined in the Node Configuration file, which offers two options for password storage:

- _Plain text passwords for simplicity and ease of setup_
- _Bcrypt-hashed passwords for enhanced security_

For CLI usage, users simply need to set the environment variables `BACALHAU_API_USERNAME` and `BACALHAU_API_PASSWORD`. For direct API calls, the standard Basic Authorization header with base64-encoded credentials can be used.

Below is a sample orchestrator config file that defines 3 users that can authenticate through basic auth.

```yaml
Orchestrator:
  Enabled: true
API:
  Port: 1234
  Auth:
    Users:
      # User with plain text password
      - Alias: Admin User
        Username: admin
        Password: secureAdminPassword
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['*']

      # User with limited permissions and plain text password
      - Alias: Read Only User
        Username: reader
        Password: readerPassword
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['read:*']

      # User with bcrypt hashed password
      - Alias: Job Manager
        Username: jobmanager
        # This is a bcrypt password hash for the password "MySecretPassword"
        Password: '$2a$10$3ZvxUe5OudgRIQQheomjMO/Ufx1Bb04SH/y0PXnR19oDRXNGps3r2'
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['read:job', 'write:job', 'read:node']
```

In the above configuration:

1. The first two users have plain text passwords, while the third uses a BCRYPT hashed password for added security.
2. We have three users with different permission levels. These capabilities will be covered in detail in the authorization section below.

To help users and operators generate secure hashed passwords, a convenient CLI command was added that generates a BCRYPT hash of a password of your choosing. This command takes a plain string and converts it into a BCRYPT hash.

```shell
bacalhau auth hash-password
```

To use this configuration with the Bacalhau CLI, you would set the following environment variables:

```shell
# For admin access
export BACALHAU_API_USERNAME=admin
export BACALHAU_API_PASSWORD=secureAdminPassword

# For read-only access
export BACALHAU_API_USERNAME=reader
export BACALHAU_API_PASSWORD=readerPassword

# For job management
# Please note: Set the password env variable to the actual password,
#              not the hashed password.
export BACALHAU_API_USERNAME=jobmanager
export BACALHAU_API_PASSWORD=MySecretPassword
```

For direct API calls, for example by using curl, you would encode the credentials in base64:

```shell
# For admin (base64 of "admin:secureAdminPassword")
curl -X GET -H "Authorization: Basic YWRtaW46c2VjdXJlQWRtaW5QYXNzd29yZA==" "http://orchestrator:1234/api/v1/orchestrator/nodes"

# For reader (base64 of "reader:readerPassword")
curl -X GET -H "Authorization: Basic cmVhZGVyOnJlYWRlclBhc3N3b3Jk" "http://orchestrator:1234/api/v1/orchestrator/nodes"

# For Job Manager (base64 of "jobmanager:MySecretPassword")
curl -X GET -H "Authorization: Basic am9ibWFuYWdlcjpNeVNlY3JldFBhc3N3b3Jk" "http://orchestrator:1234/api/v1/orchestrator/nodes"
```

---

### 1.2 Authentication through API Tokens

For applications and scenarios where password-based authentication isn't ideal, Bacalhau 1.7 introduces API token support. Instead of username and password pairs, users can generate and use API keys as bearer tokens in authorization headers.

Configuration is straightforward – API keys are defined in the orchestrator config under user profiles. To use them with the Bacalhau CLI, users set the `BACALHAU_API_KEY` environment variable. For direct API access, the token is included in the Authorization header using the Bearer scheme.

Please note that API Keys are opaque tokens.

Here's a sample configuration for API tokens in Bacalhau:

```yaml
Orchestrator:
  Enabled: true
API:
  Port: 1234
  Auth:
    Users:
      # Administrator API token with full access
      - Alias: Admin API Token
        APIKey: 8F42A91D7C6E4B3DA5E9F8C12B76D3A4
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['*']

      # Read-only API token
      - Alias: Monitoring Token
        APIKey: C5D8E3F1A7B94026895C1D4E3F2A0B78
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['read:*']

      # Job management API token
      - Alias: CI/CD Pipeline Token
        APIKey: 2E8D7F5B3A9C41608D2E6B7F4A5C3D9E
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['read:job', 'write:job', 'read:node']

      # Agent management API token
      - Alias: Agent Management Token
        APIKey: 1A3B5C7D9E0F2G4H6I8J0K2L4M6N8P0
        # The Capabilities section will be covered
        # in the Authorization section below
        Capabilities:
          - Actions: ['read:agent', 'write:agent']
```

In this configuration:

1. We have four API tokens with different permission levels:
   - An administrator token with full access to all capabilities
   - A monitoring token with read-only access to all resources
   - A CI/CD pipeline token that can view nodes and has full control over jobs
   - An agent management token that has full control over agents
2. Each token has a unique, randomly generated API key. You should generate strong, unique keys for your production environment using a secure random generator.

Please note that API keys do not support BCRYPT hashing.

To use these API tokens with the Bacalhau CLI, you would set the following environment variable:

```shell
export BACALHAU_API_KEY=8F42A91D7C6E4B3DA5E9F8C12B76D3A4
```

For direct API calls, for example by using curl, you would use the Bearer token authentication scheme:

```shell
curl -X GET -H "Authorization: Bearer 8F42A91D7C6E4B3DA5E9F8C12B76D3A4" "http://orchestrator:1234/api/v1/orchestrator/nodes"
```

---

### 1.3 Single Sign-On via OAuth 2.0

Perhaps the most significant addition since Bacalhau 1.7 is the support for OAuth 2.0 using the Device Code Flow. This enables Bacalhau to integrate seamlessly with enterprise identity providers such as Okta, Auth0, Azure Active Directory, and Google SSO.

This approach eliminates the need to define users directly in Bacalhau's configuration, instead delegating user management to the identity provider – a considerable advantage in corporate environments with existing identity infrastructure.

The configuration process involves specifying OAuth 2.0 endpoints, client IDs, and desired scopes. When users need to authenticate, they run **`bacalhau auth sso login`**, which presents a device code and URL. After completing authentication through their browser, they receive a JWT token that's automatically used for subsequent API calls (_this token exchange will be done seamlessly and the user is not required to perform any extra actions_).

Here's a sample configuration for OAuth 2.0 SSO in Bacalhau:

```yaml
Orchestrator:
  Enabled: true
API:
  Port: 1234
  Auth:
    Oauth2:
      # Identity provider details, those are names for your own reference only
      ProviderId: 'okta'
      ProviderName: 'Okta SSO'

      # OAuth 2.0 endpoints - Device Code Endpoint
      DeviceAuthorizationEndpoint: 'https://your-domain.okta.com/oauth2/v1/device/authorize'
      # The endpoint used to get the JWT token
      TokenEndpoint: 'https://your-domain.okta.com/oauth2/v1/token'
      # The Expected issuer, should match the issuer in the JWT token
      Issuer: 'https://your-domain.okta.com'
      # The JWKS URI
      JWKSUri: 'https://your-domain.okta.com/.well-known/jwks.json'

      # Client details
      DeviceClientId: '0ab2c3d4e5f6g7h8i9j0'
      # CLI polling interval to check if the device code was approved
      PollingInterval: 5

      # Audience: Expected "aud" in the JWT token
      Audience: 'https://bacalhau.your-company.com/api'

      # Scopes requested in the token exchange
      Scopes:
        - 'openid'
        - 'profile'
        - 'email'
```

For this to setup work properly:

1. Register an OAuth 2.0 application in your identity provider (Okta, Auth0, Azure AD, etc.)
2. Configure it to support the **Device Code Flow**. Make sure the provider supports OAuth2 Device code flow.
3. Set up appropriate roles or groups in your identity provider to map to Bacalhau permissions

The permission mapping would happen in your identity provider. For example, in Okta you might create:

- A "Bacalhau Admins" group with permissions: **`["*"]`**
- A "Bacalhau Readers" group with permissions: **`["read:*"]`**
- A "Bacalhau Job Managers" group with permissions: **`["read:job", "write:job", "read:node"]`**

These permissions should be included in the JWT token under the custom claim **`permissions`**.

To authenticate using this setup, users would run:

```shell
# Login
bacalhau auth sso login

# Logout
bacalhau auth sso logout
```

Then the CLI would display something like this:

```shell
To login, please:

1. Open this URL in your browser: <https://your-domain.okta.com/activate
2. Enter this code: ABCD-EFGH

Or, open this URL in your browser: [https://your-domain.okta.com/activate?user_code=ABCD-EFGH](https://your-domain.okta.com/activate?user_code=ABCD-EFGH)

Waiting for authentication with Okta SSO... (press Ctrl+C to cancel)
```

After completing authentication through their browser, the user would receive a JWT token that's automatically used for subsequent API calls. The token can be inspected with:

```shell
# Inspect JWT token obtained when logging in using SSO
bacalhau auth sso token
```

---

### 1.4 Authentication Priority in Bacalhau 1.7+

When configuring Bacalhau authentication, it's important to understand the precedence rules that determine which authentication method takes effect.

Environment variables take highest precedence in the authentication hierarchy, overriding any other configured methods. This means that if you have set **`BACALHAU_API_USERNAME`** and **`BACALHAU_API_PASSWORD`** for Basic Auth, or **`BACALHAU_API_KEY`** for API token authentication, these will be used regardless of any SSO tokens that may be stored locally from previous **`bacalhau auth sso login`** sessions.

If the **`BACALHAU_API_USERNAME/BACALHAU_API_PASSWORD`** and **`BACALHAU_API_PASSWORD`** are defined, an error message will be returned.

This design provides flexibility for users who need to temporarily switch between different authentication contexts without modifying configuration files

For example, a developer could have an SSO session for regular work but quickly switch to using an API key for testing by simply setting the appropriate environment variable. When the environment variable is unset, Bacalhau will fall back to the next available authentication method, typically returning to the previously established SSO session if available.

```shell
# Inspect current authentication status
bacalhau auth info
```

## 2. Granular Authorization in Bacalhau 1.7+

As of Bacalhau 1.7, we introduced a sophisticated authorization system built on a resource and capability model that brings fine-grained access control to the platform. This system divides API actions into specific combinations of resources and capabilities, enabling administrators to implement the principle of least privilege across their Bacalhau deployments.

### 2.1 Resource and Capability Framework

The permission structure is organized around two key dimensions:

- **Resources**: The objects being accessed or
  modified (Nodes, Jobs, and Agents)
- **Capabilities**: The types of operations
  being performed (Read and Write)

This creates a permission taxonomy following the pattern of **`action:resource`**, where permissions can be assigned individually or using wildcards for broader access grants.

### 2.2 Core Permission Set

Bacalhau supports the following core permissions:

1. **`"*"`** - The master permission granting full
   access to all capabilities across all resources
2. **`"read:*"`** - Provides read-only access across
   all resource types
3. **`"write:*"`** - Grants write access to all resource
   types
4. **`"read:node"`** - Allows viewing node information
5. **`"write:node"`** - Permits actions on the node
6. **`"read:job"`** - Enables querying job status,
   details, and logs, etc
7. **`"write:job"`** - Allows submitting, canceling,
   and managing job execution
8. **`"read:agent"`** - Provides access to agent information
   via `"bacalhau agent"` commands
9. **`"write:agent"`** - Any write actions on the agent.

### 2.3 Creating Role-Based Access Patterns

These permissions can be combined to create practical access patterns for different user roles and service accounts:

- **Administrator**: **`["*"]`** - Full access to all system functions
- **Read-only Analyst**: **`["read:*"]`** - Can view but not modify any resources
- **Job Manager**: **`["read:job", "write:job", "read:node"]`** - Complete control over jobs with visibility into nodes
- **Monitoring Service**: **`["read:node", "read:job"]`** - View-only access for system monitoring
- CI/CD Pipeline: **`["write:job", "read:job"]`** - Can submit and monitor jobs but can't access node details

### 2.4 Benefits for Different User Profiles

These authentication enhancements offer distinct advantages for different types of Bacalhau users:

- **Individual developers** benefit from the simplicity of Basic Auth for quick setup and experimentation
- **DevOps teams** can leverage API tokens for automation, CI/CD pipelines, and service-to-service communication
- **Enterprise environments** gain seamless integration with existing identity infrastructure through OAuth 2.0
- **Security teams** appreciate the granular permission model that enforces the principle of least privilege

## 3. Backward Compatibility with Previous Authentication Methods

Bacalhau 1.7 maintains backward compatibility with the previous authentication mechanism based on Open Policy Agent, ensuring a smooth transition path for existing deployments.

Users can continue to use their established OPA policies without immediate migration to the new authentication paths. However, it's important to note that while backward compatibility is preserved, mixing the old and new authentication methods within the same deployment is not supported.

Organizations must choose either to continue using the Open Policy Agent approach exclusively or to migrate fully to the new authentication system with Basic Auth, API Tokens, or OAuth 2.0.

This clean separation prevents potential security inconsistencies and configuration conflicts that could arise from overlapping authentication mechanisms.

For organizations planning to migrate, the Bacalhau team recommends first setting up the new authentication in a test environment, validating access patterns and permissions, and then performing a complete cutover rather than attempting a gradual or partial migration. This approach ensures security integrity throughout the transition while still providing flexibility in timing the upgrade to the enhanced authentication capabilities.

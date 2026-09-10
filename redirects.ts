import type { RedirectItem } from '@docusaurus/plugin-client-redirects/lib/types'

// docs.bacalhau.org currently forwards every legacy path to the same path under
// bacalhau.org/docs. These redirect pages resolve the legacy paths that moved
// to a different section of the current documentation.
const redirects: RedirectItem[] = [
  // The project blog lives on its dedicated host; do not index an empty local listing.
  { from: '/blog', to: 'https://blog.bacalhau.org/' },
  { from: '/docs/getting-started/cli/overview', to: '/docs/cli' },
  { from: '/docs/getting-started/cli', to: '/docs' },
  { from: '/docs/getting-started/architecture', to: '/docs/overview/architecture' },
  { from: '/docs/common-workflows/publishing-and-retrieving-results', to: '/docs/guides/publishing-results' },
  { from: '/docs/common-workflows/resource-constraints', to: '/docs/guides/resource-requirements' },
  { from: '/docs/common-workflows/', to: '/docs' },
  { from: '/docs/common-pitfalls', to: '/docs/references/troubleshooting' },
  { from: '/docs/guides/using-labels-and-constraints', to: '/docs/guides/labels-and-constraints' },
  { from: '/docs/use-cases/readme/log-processing', to: '/use-cases/log-processing' },
  { from: '/docs/use-cases/readme/distributed-data-warehousing', to: '/use-cases/distributed-data-warehousing' },
  { from: '/docs/use-cases/readme/fleet-management', to: '/use-cases/fleet-management' },
  { from: '/docs/use-cases/readme/distributed-machine-learning', to: '/use-cases/distributed-machine-learning' },
  { from: '/docs/use-cases/readme/edge-computing', to: '/use-cases/edge-computing' },
  { from: '/docs/cli-api', to: '/docs/cli' },
  { from: '/docs/cli-api/api/overview', to: '/docs/api' },
  { from: '/docs/community', to: '/community/social-media' },
  { from: '/docs/references/running-locally', to: '/docs/references/developers/running-locally' },
  { from: '/docs/references/setting-up/running-node/gpu', to: '/docs/references/operators/gpu' },
  { from: '/docs/references/setting-up/gpu', to: '/docs/references/operators/gpu' },
  { from: '/docs/references/setting-up/node_management', to: '/docs/references/operators/node-management' },
  { from: '/docs/guides/configuration-management', to: '/docs/references/operators/configuration-reference' },
  { from: '/docs/references/setting-up/auth_flow', to: '/docs/references/operators/security/auth' },
  { from: '/docs/references/setting-up/inter-nodes-tls', to: '/docs/references/operators/security/node-tls' },
  { from: '/docs/references/setting-up/running-node/auth', to: '/docs/references/operators/security/auth' },
  { from: '/docs/references/setting-up/running-node/configuring-tls', to: '/docs/references/operators/security/node-tls' },
  { from: '/docs/references/help-and-faq/faqs', to: '/docs/references/faq' },
  { from: '/docs/references/help-and-faq/glossary', to: '/docs/references/glossary' },
  { from: '/docs/references/setting-up/running-node/job-selection', to: '/docs/guides/selection-policy' },
  { from: '/docs/references/setting-up/running-node/storage-providers', to: '/docs/guides/mounting-input-data' },
  { from: '/docs/references/setting-up/running-node/resource-limits', to: '/docs/guides/resource-requirements' },
  { from: '/docs/references/setting-up/running-node/webui', to: '/docs/guides/webui' },
  { from: '/docs/references/setting-up/hardware-setup', to: '/docs/guides/resource-requirements' },
  { from: '/docs/references/guides/jobs/job-queuing', to: '/docs/guides/queueing' },
  { from: '/docs/references/guides/jobs/using-labels-and-constraints', to: '/docs/guides/labels-and-constraints' },
  { from: '/docs/references/jobs/job/job-types', to: '/docs/specifications/job/type' },
  { from: '/docs/references/setting-up', to: '/docs/getting-started/network-setup' },
  { from: '/docs/references/setting-up/running-node', to: '/docs/getting-started/network-setup' },
  { from: '/docs/references/setting-up/running-node/quick-start-docker', to: '/docs/getting-started/network-setup' },
  { from: '/docs/examples/data-engineering/duckdb', to: '/integrations/duckdb' },
  { from: '/docs/examples/case-studies/duckdb-log-processing', to: '/integrations/duckdb' },
  { from: '/docs/integrations/lilypad', to: '/integrations/lilypad' },
  { from: '/docs/references/api/index', to: '/docs/api' },
  { from: '/docs/setting-up/networking-instructions/networking', to: '/docs/guides/networking' },
  { from: '/docs/setting-up/running-node/private-ipfs-network-setup', to: '/docs/sources/ipfs' },
  { from: '/docs/next-steps/private-cluster', to: '/docs/getting-started/network-setup' },
  { from: '/docs/setting-up/running-node/quick-start-docker', to: '/docs/getting-started/network-setup' },
  { from: '/docs/setting-up/inter-nodes-tls', to: '/docs/references/operators/security/node-tls' },
  { from: '/docs/setting-up/running-node/gpu', to: '/docs/references/operators/gpu' },
  { from: '/docs/references/node_management', to: '/docs/references/operators/node-management' },
  { from: '/docs/v.1.3.2-1/setting-up/jobs/job-types', to: '/docs/specifications/job/type' },
  { from: '/docs/v.1.3.2-1/setting-up/running-node/storage-providers', to: '/docs/guides/mounting-input-data' },
  { from: '/docs/references/jobs/job/task/engines/docker', to: '/docs/engines/docker' },
  { from: '/docs/references/jobs/job/task/sources/ipfs', to: '/docs/sources/ipfs' },
  { from: '/docs/v.1.3.0/references/other-specifications/engines/docker', to: '/docs/engines/docker' },
  { from: '/docs/getting-started/workload-onboarding/docker-workload-onboarding', to: '/docs/references/developers/workload-onboarding/docker' },
  { from: '/docs/v.1.3.0/community/social-media', to: '/community/social-media' },
  { from: '/docs/integrations/python-sdk', to: '/docs' },
  { from: '/docs/references/databases', to: '/docs' },
  { from: '/docs/references/setting-up/update-checks', to: '/docs' },
]

const createRedirects = (existingPath: string): string[] | undefined => {
  return undefined
}

export { redirects, createRedirects }

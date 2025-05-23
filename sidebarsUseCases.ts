import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  useCases: [
    {
      type: 'category',
      label: 'Use Cases',
      collapsible: true,
      collapsed: false,
      link: {
        type: 'doc',
        id: 'use-cases/README',
      },
      items: [
        {
          type: 'doc',
          id: 'use-cases/log-processing',
          label: 'Log Processing',
        },
        {
          type: 'doc',
          id: 'use-cases/distributed-data-warehousing',
          label: 'Distributed Data Warehousing',
        },
        {
          type: 'doc',
          id: 'use-cases/fleet-management',
          label: 'Fleet Management',
        },
        {
          type: 'doc',
          id: 'use-cases/distributed-machine-learning',
          label: 'Distributed Machine Learning',
        },
        {
          type: 'doc',
          id: 'use-cases/edge-computing',
          label: 'Edge Computing',
        },
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'integrations',
        },
      ],
    },
  ],
}

export default sidebars

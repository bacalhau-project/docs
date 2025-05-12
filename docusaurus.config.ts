import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { redirects, createRedirects } from './redirects' // Add this line

const config: Config = {
  title: 'Bacalhau',
  tagline: 'Distributed Compute Over Data',
  favicon: 'img/favicon.png',

  url: 'https://bacalhau.org',
  baseUrl: '/',
  trailingSlash: true,

  // GitHub pages deployment config.
  organizationName: 'bacalhau-project', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  markdown: {
    format: 'detect',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: redirects,
        createRedirects: createRedirects,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'useCases',
        path: 'content/use-cases',
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebarsUseCases.ts'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'content/community',
        routeBasePath: '/community',
        sidebarPath: require.resolve('./sidebarsCommunity.ts'),
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebarsDocs.ts'),
          editUrl: 'https://github.com/bacalhau-project/docs/tree/main/',
          showLastUpdateTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    // Replace with your project's social card
    image: 'img/bacalhau-social.png',
    navbar: {
      title: 'Bacalhau',
      logo: {
        alt: 'Bacalhau Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'useCases',
          docsPluginId: 'useCases',
          position: 'left',
          label: 'Use Cases',
        },
        {
          type: 'docSidebar',
          sidebarId: 'cliApi',
          position: 'left',
          label: 'CLI & API',
        },
        {
          type: 'docSidebar',
          sidebarId: 'reference',
          position: 'left',
          label: 'References',
        },
        {
          type: 'docSidebar',
          sidebarId: 'community',
          docsPluginId: 'community',
          position: 'left',
          label: 'Community',
        },
        {
          href: 'https://github.com/bacalhau-project/bacalhau',
          className: 'header-github-link',
          label: 'GitHub',
          position: 'right',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://blog.bacalhau.org/',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://expanso.io/?_gl=1*sdzh2w*_gcl_au*ODM0MTE4NTkyLjE3NDIyOTQ5MDQ.*_ga*ODgxNjg0Mjg3LjE3NDIyOTQ5MDQ.*_ga_X1RJ0QGN3Z*czE3NDY1OTkyNDkkbzI5JGcxJHQxNzQ2NjAzMzIxJGoxMCRsMCRoMA..',
          label: 'Enterprise',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'What is Bacalhau?',
              to: '/docs/',
            },
            {
              label: 'Architecture',
              to: '/docs/overview/architecture',
            },
            {
              label: 'Quick Start',
              to: '/docs/getting-started/quick-start',
            },
          ],
        },
        {
          title: 'Use Cases',
          items: [
            {
              label: 'Log Processing',
              to: 'use-cases/log-processing',
            },
            {
              label: 'Distributed Data Warehousing',
              to: 'use-cases/distributed-data-warehousing',
            },

            {
              label: 'Distributed Machine Learning',
              to: 'use-cases/distributed-machine-learning',
            },
            {
              label: 'Edge Computing',
              to: 'use-cases/edge-computing',
            },
            {
              label: 'Fleet Management',
              to: 'use-cases/fleet-management',
            },
          ],
        },
        {
          title: 'Community & Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/bacalhau-project/bacalhau',
            },
            {
              label: 'Slack',
              href: 'https://bit.ly/bacalhau-project-slack',
            },
            {
              label: 'Twitter/X',
              href: 'https://twitter.com/BacalhauProject',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/showcase/bacalhau-project/posts',
            },
          ],
        },
        {
          title: 'Expanso & Cloud',
          items: [
            {
              label: 'Expanso.io',
              href: 'https://expanso.io',
            },
            {
              label: 'Expanso Cloud',
              href: 'https://cloud.expanso.io',
            },
            {
              label: 'Enterprise Support',
              href: 'https://expanso.io/contact',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bacalhau Project.`,
    },

    prism: {
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config

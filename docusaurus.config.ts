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
  // true = pages served at /path/ (with slash), /path redirects → /path/
  // Fixes GitHub Pages 404s when Google crawls slash variants of URLs
  trailingSlash: true,

  // GitHub pages deployment config.
  organizationName: 'bacalhau-project', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
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
        googleTagManager: {
          containerId: 'GTM-M4ZC5QX7',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          // Exclude pages that have noindex or are not useful for search
          ignorePatterns: [
            '/search',
            '/search/**',
            '/tags/**',
            '/docs/tags/**',
            '/community/tags/**',
          ],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'Bacalhau',
        url: 'https://bacalhau.org/',
        codeRepository: 'https://github.com/bacalhau-project/bacalhau',
        license: 'https://www.apache.org/licenses/LICENSE-2.0',
        programmingLanguage: 'Go',
        description:
          'Open-source distributed compute orchestration software that runs workloads near the data they process.',
        keywords: [
          'compute over data',
          'distributed computing',
          'data locality',
          'edge computing',
          'workload orchestration',
        ],
      }),
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap',
      },
    },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    // Replace with your project's social card
    image: 'img/bacalhau-social.png',
    algolia: {
      appId: 'K2MK84JXCM',
      apiKey: '00017896a702f2a79cf8b89a9dec5905',
      indexName: 'bacalhau',
      searchPagePath: 'search',
      insights: true,
      placeholder: 'Search Bacalhau...'
    },
    navbar: {
      title: 'Bacalhau',
      logo: {
        alt: 'Bacalhau Logo',
        src: 'img/logos/logo.svg',
        srcDark: 'img/logos/logo-dark.svg',
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
          href: 'https://blog.bacalhau.org/',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://github.com/bacalhau-project/bacalhau',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
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
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bacalhau Project.`,
    },

    prism: {
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config

import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { redirects, createRedirects } from './redirects'

const config: Config = {
  title: 'Bacalhau Documentation',
  tagline: 'Distributed compute orchestration - bringing compute to the data',
  favicon: 'img/favicon.png',

  // Correct URL where docs are actually hosted
  url: 'https://bacalhau.org',
  baseUrl: '/docs/',
  trailingSlash: false,

  // GitHub pages deployment config.
  organizationName: 'bacalhau-project',
  projectName: 'docs',

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
        routeBasePath: '/use-cases',
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
    [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/docs/tags/**'],
        filename: 'sitemap.xml',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebarsDocs.ts'),
          editUrl: 'https://github.com/bacalhau-project/docs/tree/main/',
          showLastUpdateTime: true,
          // Add schema markup for articles
          remarkPlugins: [],
          rehypePlugins: [],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        googleTagManager: {
          containerId: 'GTM-M4ZC5QX7',
        },
        // Ensure sitemap generation
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
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
    // Add JSON-LD structured data for organization
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Bacalhau Project',
        url: 'https://bacalhau.org',
        logo: 'https://bacalhau.org/img/logos/logo.svg',
        description: 'Open-source distributed compute orchestration framework',
        founder: {
          '@type': 'Organization',
          name: 'Expanso',
          url: 'https://expanso.io'
        },
        parentOrganization: {
          '@type': 'Organization',
          name: 'Expanso',
          url: 'https://expanso.io'
        }
      }),
    },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: 'img/bacalhau-social.png',
    algolia: {
      appId: 'K2MK84JXCM',
      apiKey: '00017896a702f2a79cf8b89a9dec5905',
      indexName: 'bacalhau',
      searchPagePath: 'search',
      insights: true,
      placeholder: 'Search Bacalhau Docs...'
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
          href: 'https://expanso.io',
          label: 'Enterprise',
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
              to: '/',
            },
            {
              label: 'Architecture',
              to: '/overview/architecture',
            },
            {
              label: 'Quick Start',
              to: '/getting-started/quick-start',
            },
          ],
        },
        {
          title: 'Use Cases',
          items: [
            {
              label: 'Log Processing',
              to: '/use-cases/log-processing',
            },
            {
              label: 'Distributed Data Warehousing',
              to: '/use-cases/distributed-data-warehousing',
            },
            {
              label: 'Distributed Machine Learning',
              to: '/use-cases/distributed-machine-learning',
            },
            {
              label: 'Edge Computing',
              to: '/use-cases/edge-computing',
            },
            {
              label: 'Fleet Management',
              to: '/use-cases/fleet-management',
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
          title: 'Expanso',
          items: [
            {
              label: 'Expanso.io',
              href: 'https://expanso.io',
            },
            {
              label: 'Enterprise Support',
              href: 'https://expanso.io/contact',
            },
            {
              label: 'About Expanso',
              href: 'https://expanso.io/about',
            },
          ],
        },
      ],
      copyright: `
        <div style="margin-top: 1rem;">
          <p>Copyright © ${new Date().getFullYear()} Bacalhau Project.</p>
          <p style="margin-top: 0.5rem; font-size: 0.875em; opacity: 0.8;">
            Bacalhau is built and maintained by <a href="https://expanso.io" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: none;">Expanso</a>, 
            the enterprise edge computing platform.
          </p>
        </div>
      `,
    },

    prism: {
      additionalLanguages: ['bash', 'yaml', 'json', 'python', 'go'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
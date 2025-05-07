import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Bacalhau",
  tagline: "Distributed Compute Over Data",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://bacalhau.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/docs/",

  // GitHub pages deployment config.
  organizationName: "bacalhau-project", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  onBrokenAnchors: "ignore",
  markdown: {
    format: "detect",
  },
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        //   docs: {
        //     path: './documentation',
        //     // Map to sub-domain
        //     routeBasePath: '/docs',
        //     sidebarPath: './documentation.js',
        //     showLastUpdateAuthor: true,
        //     showLastUpdateTime: true,
        // },
        docs: {
          path: "docs",
          // Map to sub-domain
          // routeBasePath: '/',
          sidebarPath: require.resolve("./docsSidebar.ts"),
          editUrl:
            "https://github.com/bacalhau-project/docs/tree/main/",
        },

        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // TODO: remove this when we are ready to go live
    metadata: [
      {name: 'robots', content: 'noindex, nofollow'},
    ],
    colorMode: {
      respectPrefersColorScheme: true
    },
    // Replace with your project's social card
    image: "img/bacalhau-social.png",
    navbar: {
      title: "Bacalhau",
      logo: {
        alt: "Bacalhau Logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          type: "docSidebar",
          sidebarId: "usecaseSidebar",
          position: "left",
          label: "Use Cases",
        },
        {
          type: "docSidebar",
          sidebarId: "cliapiSidebar",
          position: "left",
          label: "CLI & API",
        },
        {
          type: "docSidebar",
          sidebarId: "referenceSidebar",
          position: "left",
          label: "References",
        },
        {
          type: "docSidebar",
          sidebarId: "communitySidebar",
          position: "left",
          label: "Community",
        },
        {
          href: "https://github.com/bacalhau-project/bacalhau",
          className: 'header-github-link',
          label: "GitHub",
          position: "right",
          'aria-label': 'GitHub repository',
        },
        {
          href: "https://bacalhauproject.slack.com/",
          label: "Slack",
          position: "right",
        },
        {
          href: "https://blog.bacalhau.org/",
          label: "Blog",
          position: "right",
        },
        {
          href: "https://expanso.io/?_gl=1*sdzh2w*_gcl_au*ODM0MTE4NTkyLjE3NDIyOTQ5MDQ.*_ga*ODgxNjg0Mjg3LjE3NDIyOTQ5MDQ.*_ga_X1RJ0QGN3Z*czE3NDY1OTkyNDkkbzI5JGcxJHQxNzQ2NjAzMzIxJGoxMCRsMCRoMA..",
          label: "Enterprise",
          position: "right",
        },
      ],
    },
    footer: {
      style: 'dark',
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
              to: '/docs/use-cases/use-cases/log-processing',
            },
            {
              label: 'Distributed Data Warehousing',
              to: '/docs/use-cases/use-cases/distributed-data-warehousing',
            },

            {
              label: 'Distributed Machine Learning',
              to: '/docs/use-cases/use-cases/distributed-machine-learning',
            },
            {
              label: 'Edge Computing',
              to: '/docs/use-cases/use-cases/edge-computing',
            },
            {
              label: 'Fleet Management',
              to: '/docs/use-cases/use-cases/fleet-management',
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
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

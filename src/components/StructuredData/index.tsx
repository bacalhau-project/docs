import Head from '@docusaurus/Head'

type Faq = {
  answer: string
  question: string
}

type StructuredDataProps = {
  description: string
  faq: Faq[]
  path: string
  title: string
}

const siteUrl = 'https://bacalhau.org'

export default function StructuredData({
  description,
  faq,
  path,
  title,
}: StructuredDataProps) {
  const url = `${siteUrl}${path}`
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description,
      mainEntityOfPage: url,
      author: {
        '@type': 'Organization',
        name: 'Bacalhau Project',
        url: siteUrl,
      },
      about: ['compute over data', 'distributed computing', 'data locality'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Documentation',
          item: `${siteUrl}/docs/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: `${siteUrl}/docs/guides/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title,
          item: url,
        },
      ],
    },
  ]

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  )
}

import React from 'react';
import Head from '@docusaurus/Head';
import {PageMetadata} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {semanticTitle, socialImage} from '../../../seo/metadata.mjs';

export default function DocItemMetadata() {
  const {metadata, frontMatter} = useDoc();
  const title = semanticTitle(metadata.title, metadata.permalink);
  return <><PageMetadata title={title} description={metadata.description}
    keywords={frontMatter.keywords} image={socialImage(metadata.permalink)} />
    <Head><meta property="og:image:alt" content={title} />
      <meta name="twitter:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" /></Head></>;
}

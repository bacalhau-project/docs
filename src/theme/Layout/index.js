import React from 'react';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import OriginalLayout from '@theme-original/Layout';
import {socialImage} from '../../seo/metadata.mjs';

export default function Layout(props) {
  const {pathname} = useLocation();
  const image = useBaseUrl(socialImage(pathname), {absolute:true});
  const label = props.title || pathname.split('/').filter(Boolean).join(' · ').replaceAll('-', ' ') || 'Distributed Compute Over Data';
  return <><OriginalLayout {...props} /><Head>
    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />
    <meta property="og:image:alt" content={label} />
    <meta name="twitter:image:alt" content={label} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
  </Head></>;
}

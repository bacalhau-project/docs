import React, {useEffect} from 'react';
import Content from '@theme-original/NotFound/Content';
import {getCollector} from '../../../analytics/client';
export default function NotFoundContent(props) {
  useEffect(() => { getCollector()?.capture('page_not_found'); }, []);
  return <Content {...props} />;
}

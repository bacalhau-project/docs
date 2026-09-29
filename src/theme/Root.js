import React, {useEffect, useState} from 'react';
import {getCollector} from '../analytics/client';
import './analytics.css';

export default function Root({children}) {
  const [state, setState] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const collector = getCollector();

    if (collector) { setState(collector.getConsent()); setOpen(collector.getConsent() === 'unset'); }
  }, []);

  function choose(next) { getCollector()?.setConsent(next); setState(next); setOpen(false); }

  return <>{children}{state !== null && <aside className="analytics-choice" aria-label="Analytics preferences">
    {open ? <><p>We use PostHog and Google Analytics to measure page visits and basic actions without recording page content. Accept analytics to remember your browser between visits. Decline to keep measurement in memory for this page session only. Your preference is saved.</p>
      <p>Whatever you choose, Scarf anonymously counts every visit with a cookie-free image. It receives your IP address, user agent and page URL, and says it &ldquo;does not store the IP address itself&rdquo;.</p>
      <button onClick={() => choose('granted')}>Accept analytics</button>{' '}
      <button onClick={() => choose('denied')}>Decline persistent analytics</button>
    </> : <button onClick={() => setOpen(true)}>Analytics preferences</button>}
  </aside>}</>;
}

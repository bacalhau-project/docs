import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {installActions} from './actions.mjs';
test('observable actions send no clipboard, query, link text or email contents', () => {
  const dom = new JSDOM(`<div class="theme-code-block"><button aria-label="Copy code to clipboard"><span>Copy</span></button><code>private code</code></div><input type="search"><a href="https://example.org/private?email=private">Private</a><a href="mailto:private@example.org">Email</a><a href="/docs">Docs</a>`, {url: 'https://site.example/'});
  const calls = [];
  const stop = installActions(dom.window, {capture: (...args) => calls.push(args)});
  const doc = dom.window.document;
  doc.querySelector('span').click();
  const input = doc.querySelector('input'); input.value = 'private query'; input.dispatchEvent(new dom.window.Event('change', {bubbles: true}));
  for (const link of doc.querySelectorAll('a')) link.dispatchEvent(new dom.window.Event('click', {bubbles: true}));
  assert.deepEqual(calls, [['code_copy'], ['search_used', {search_length: 13}], ['outbound_click', {destination_host: 'example.org'}]]);
  stop(); doc.querySelector('span').click(); assert.equal(calls.length, 3);
  dom.window.close();
});

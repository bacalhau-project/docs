import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {Resvg} from '@resvg/resvg-js';
import {socialImage} from '../src/seo/metadata.mjs';

const escape = value => value.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]));
function lines(text, width, maximum) {
  const result = [''];
  for (const word of text.split(/\s+/)) {
    if ((result.at(-1) + ' ' + word).trim().length > width && result.at(-1)) result.push('');
    result[result.length - 1] = (result.at(-1) + ' ' + word).trim();
  }
  if (result.length > maximum) throw new Error('Social card text exceeds layout: ' + text);
  return result;
}
const sitemap = await readFile('build/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
const logo = (await readFile('static/img/logos/logo.svg')).toString('base64');
await mkdir('build/img/social', {recursive:true});
const manifest = [];
const images = new Set();
for (const url of urls) {
  const document = new JSDOM(await readFile(`build${url.pathname}index.html`, 'utf8')).window.document;
  const title = document.querySelector('meta[property="og:title"]')?.content?.split(' | ')[0] || document.title;
  const image = socialImage(url.pathname);
  if (images.has(image)) throw new Error('Social image path collision');
  images.add(image);
  const category = url.pathname.startsWith('/docs/') ? 'DOCUMENTATION' : url.pathname.startsWith('/community/') ? 'COMMUNITY' : 'COMPUTE OVER DATA';
  const titleLines = lines(title, 38, 3);
  const description = (document.querySelector('meta[name="description"]')?.content || '').replace(/\s+/g, ' ').trim();
  const summary = description.length > 150 ? description.slice(0, 147).replace(/\s+\S*$/, '') + '…' : description;
  const summaryLines = lines(summary, 75, 3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="background" x2="1" y2="1"><stop stop-color="#05132c"/><stop offset="1" stop-color="#102a51"/></linearGradient></defs><rect width="1200" height="630" fill="url(#background)"/><rect x="0" y="0" width="12" height="630" fill="#33ccff"/><circle cx="1150" cy="630" r="260" fill="#0055ff" opacity=".12"/><image href="data:image/svg+xml;base64,${logo}" x="972" y="54" width="160" height="100"/><g font-family="Nunito Sans" fill="white"><text x="68" y="99" font-size="24" fill="#33ccff" letter-spacing="3">${category}</text>${titleLines.map((line,index)=>`<text x="68" y="${205+index*72}" font-size="50" font-weight="700">${escape(line)}</text>`).join('')}${summaryLines.map((line,index)=>`<text x="68" y="${422+index*34}" font-size="24" fill="#bdcbe1">${escape(line)}</text>`).join('')}<text x="68" y="566" font-size="25" fill="#bdcbe1">${escape(url.hostname)} · Open-source distributed computing</text></g></svg>`;
  const renderer = new Resvg(svg, {font:{fontFiles:['tooling/social-font/NunitoSans-Bold.ttf'],loadSystemFonts:false,defaultFontFamily:'Nunito Sans'}});
  const png = renderer.render().asPng();
  await writeFile(`build${image}`, png);
  manifest.push({path:url.pathname,image,width:1200,height:630,sha256:createHash('sha256').update(png).digest('hex')});
}
await writeFile('build/img/social/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Generated ${manifest.length} page-specific social cards.`);

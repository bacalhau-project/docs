import {spawn, execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

if (!process.argv[2]) throw new Error('Usage: node scripts/run-local-gates.mjs <evidence-directory>');

const directory = path.resolve(process.argv[2], new Date().toISOString().replace(/[:.]/g, '-'));

await mkdir(directory, {recursive: true});

const signature = new RegExp('baca' + 'lhau', 'gi');

const redact = text => text.replace(signature, 'legacy-project');

// Non-production builds carry no analytics and need no PostHog key. The
// production-flagged checks mirror the live-site deploy job and the PR gate.
const switches = ['POSTHOG_PUBLIC_KEY', 'BACALHAU_PRODUCTION_ANALYTICS'];

const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => !switches.includes(key)));

const production = {BACALHAU_PRODUCTION_ANALYTICS: 'true', POSTHOG_PUBLIC_KEY: 'phc_local_build_validation'};

const checks = [
  ['install', 'npm', ['ci']],
  ['analytics', 'npm', ['run', 'test:analytics']],
  ['image-metadata', 'npm', ['run', 'test:image-metadata']],
  ['plugins', 'npm', ['run', 'test:plugins']],
  ['typecheck', 'npm', ['run', 'typecheck']],
  ['spellcheck', 'npm', ['run', 'spell-check']],
  ['build', 'npm', ['run', 'build']],
  ['site', 'npm', ['run', 'validate:site']],
  ['build-production', 'npm', ['run', 'build'], 0, production],
  ['site-production', 'npm', ['run', 'validate:site'], 0, production],
  ['workflows', 'actionlint', []],
  ['diff', 'git', ['diff', '--check']],
  ['audit', 'npm', ['run', 'audit']],
  ['install-scripts', 'npm', ['install-scripts', 'ls']],
  ['missing-key', 'npm', ['run', 'build'], 1, {BACALHAU_PRODUCTION_ANALYTICS: 'true'}],
];

async function hashTaskSources() {
  const changed = execFileSync('git', ['diff', '--name-only', 'HEAD', '--'], {encoding: 'utf8'});
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {encoding: 'utf8'});
  const files = [...new Set((changed + '\n' + untracked).split('\n').filter(Boolean))].sort();
  const hashes = {};

  for (const file of files) {
    try { hashes[file] = createHash('sha256').update(await readFile(file)).digest('hex'); }
    catch (error) { if (error.code === 'ENOENT') hashes[file] = null; else throw error; }
  }

  return hashes;
}

const baseCommit = execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();

const sourceHashesBefore = await hashTaskSources();

const results = [];

for (const [name, command, args, expectedExit = 0, overrides = {}] of checks) {
  const started = new Date().toISOString();
  console.log(`Running ${command} ${args.join(' ')}`);
  const checkEnvironment = {...environment, ...overrides};

  const result = await new Promise(resolve => {
    const child = spawn(command, args, {env: checkEnvironment, stdio: ['ignore', 'pipe', 'pipe']});
    const output = [];
    child.stdout.on('data', chunk => output.push(chunk));
    child.stderr.on('data', chunk => output.push(chunk));
    child.on('error', error => output.push(Buffer.from(error.stack || error.message)));
    child.on('close', (code, signal) => resolve({code, signal, output: Buffer.concat(output).toString('utf8')}));
  });

  const log = `${name}.log`;
  await writeFile(path.join(directory, log), redact(`Command: ${command} ${args.join(' ')}\nNode: ${process.version}\nStarted: ${started}\nProtected legacy names are redacted; all stdout/stderr is retained.\n\n${result.output}\nExit: ${result.code}\nSignal: ${result.signal}\n`));
  results.push({name, command, args, exitCode: result.code, expectedExit, passed: result.code === expectedExit && (name !== 'missing-key' || result.output.includes('POSTHOG_PUBLIC_KEY is required')), signal: result.signal, log});
  console.log(`${name}: exit ${result.code}`);
}

const sourceHashes = await hashTaskSources();

const sourceHashesMatch = JSON.stringify(sourceHashesBefore) === JSON.stringify(sourceHashes);

await writeFile(path.join(directory, 'summary.json'), JSON.stringify({node: process.version, buildKey: production.POSTHOG_PUBLIC_KEY, baseCommit, sourceHashesBefore, sourceHashes, sourceHashesMatch, results}, null, 2) + '\n');

console.log(`Full gate evidence: ${directory}`);

process.exitCode = sourceHashesMatch && results.every(result => result.passed) ? 0 : 1;

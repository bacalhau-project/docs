import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {readdir} from 'node:fs/promises';
const require = createRequire(import.meta.url);
const fromLoader = createRequire(require.resolve('@docusaurus/mdx-loader'));
const {imageSizeFromFile} = fromLoader('image-size/fromFile');
const {imageSize} = fromLoader('image-size');
test('Docusaurus resolves the replacement and original vulnerable parser exports are absent', () => {
  assert.match(fromLoader.resolve('image-size/fromFile'), /tooling\/image-metadata-adapter\/from-file.cjs$/);
  for (const type of ['icns', 'jxl', 'heif']) assert.throws(() => fromLoader.resolve('image-size/types/' + type));
});
test('standard web image headers retain dimensions', () => {
  const png = Buffer.alloc(24); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png); png.write('IHDR', 12); png.writeUInt32BE(32, 16); png.writeUInt32BE(24, 20);
  assert.deepEqual([imageSize(png).width, imageSize(png).height], [32, 24]);
  const gif = Buffer.from('47494638396120001800', 'hex');
  assert.deepEqual([imageSize(gif).width, imageSize(gif).height], [32, 24]);
  assert.deepEqual([imageSize(Buffer.from('<svg width="32" height="24"></svg>')).width, imageSize(Buffer.from('<svg viewBox="0 0 32 24"></svg>')).height], [32, 24]);
});
test('all checked-in web images are supported by the replacement', async () => {
  let count = 0;
  for (const entry of await readdir('static', {recursive: true, withFileTypes: true})) {
    if (!entry.isFile() || !/\.(png|jpeg|jpg|gif|svg|webp)$/i.test(entry.name)) continue;
    const size = await imageSizeFromFile(entry.parentPath + '/' + entry.name);
    assert.ok(size.width > 0 && size.height > 0);
    count++;
  }
  assert.ok(count >= 24);
});
test('zero-sized ICNS, JXL and HEIF boxes fail promptly rather than hanging the build', () => {
  const samples = ['69636e73000000106963703000000000', '0000000c4a584c200d0a870a000000006a786c63', '00000018667479706865696300000000686569636d696631000000006d657461'];
  for (const hex of samples) {
    const script = `const {imageSize}=require('./tooling/image-metadata-adapter');try{imageSize(Buffer.from('${hex}','hex'));process.exitCode=1}catch(error){if(!/Unsupported/.test(error.message))throw error}`;
    const result = spawnSync(process.execPath, ['-e', script], {timeout: 1500});
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr.toString());
  }
});
test('oversized data and malformed dimensions fail closed', () => {
  const oversized = Buffer.alloc(16 * 1024 * 1024 + 1);
  const originalFrom = Buffer.from;
  try {
    Buffer.from = () => { throw new Error('Unexpected allocation before size check'); };
    assert.throws(() => imageSize(oversized), /oversized/);
  } finally { Buffer.from = originalFrom; }
  assert.throws(() => imageSize(Buffer.from('<svg width="0" height="0"></svg>')), /Invalid/);
});

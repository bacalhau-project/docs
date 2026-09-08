const {open} = require('node:fs/promises');
const {imageSize, MAX_BYTES} = require('./index.cjs');
async function imageSizeFromFile(path) {
  const file = await open(path, 'r');
  try {
    const stat = await file.stat();
    if (!stat.isFile() || stat.size > MAX_BYTES) throw new Error('Unsupported or oversized web image');
    // Bound the actual read too, even if the file changes after stat().
    const buffer = Buffer.alloc(Math.min(stat.size + 1, MAX_BYTES + 1));
    const {bytesRead} = await file.read(buffer, 0, buffer.length, 0);
    return imageSize(buffer.subarray(0, bytesRead));
  } finally { await file.close(); }
}
module.exports = {imageSizeFromFile};

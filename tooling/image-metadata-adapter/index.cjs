const probe = require('probe-image-size/sync');
const MAX_BYTES = 16 * 1024 * 1024;
// Select only the site's web formats before invoking a parser. In particular,
// no ICNS, JPEG XL or HEIF parser is reachable, regardless of filename suffix.
function supported(buffer) {
  return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
    buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ||
    /^GIF8[79]a$/.test(buffer.subarray(0, 6).toString('ascii')) ||
    (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') ||
    /^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(buffer.subarray(0, 4096).toString('utf8'));
}
function imageSize(input) {
  if (!(input instanceof Uint8Array) || input.byteLength > MAX_BYTES) throw new Error('Unsupported or oversized web image');
  const buffer = Buffer.from(input);
  if (buffer.length > MAX_BYTES || !supported(buffer)) throw new Error('Unsupported or oversized web image');
  const result = probe(buffer);
  if (!result || !Number.isFinite(result.width) || !Number.isFinite(result.height) || result.width <= 0 || result.height <= 0) throw new Error('Invalid web image dimensions');
  return {width: result.width, height: result.height, type: result.type, orientation: result.orientation};
}
module.exports = {imageSize, MAX_BYTES};

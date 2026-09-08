# Bounded build-time image metadata

This private workspace replaces Docusaurus 3.10.2's `image-size/fromFile` dependency. The original library is absent: this is a small compatibility adapter over maintained `probe-image-size` 7.4.0, not a renamed vulnerable source tree.

The original ICNS/JPEG XL/HEIF zero-length-box loops are covered by `GHSA-w3rx-r6r6-pgpr` and `GHSA-5p2g-fcmc-qvqq`. GitHub upstream is archived; Codeberg has unmerged patch proposals but no published patched release. The adapter rejects these formats by content before parsing, and limits file input to 16 MiB. It retains PNG, JPEG, GIF, WebP and SVG dimensions needed by this site. Unsupported formats fail rather than silently returning fabricated dimensions.

Root package configuration:

```json
{
  "dependencies": {"image-size": "file:./tooling/image-metadata-adapter"},
  "overrides": {"image-size": "$image-size"},
  "workspaces": ["tooling/image-metadata-adapter"]
}
```

Workspace registration installs the adapter's own dependencies. The explicit root dependency avoids npm resolving the relative override below the transitive loader. Verify resolution from `@docusaurus/mdx-loader`, not an assumed hoisted location. Run a clean `npm ci`, adapter tests, `npm audit`, and the complete site build after copying to another checkout. The inventory test's minimum image count is specific to the legacy site; the owning site should verify its own inventory.

The adapter exposes `imageSize` and `imageSizeFromFile`, the only APIs used here. It does not implement other legacy parser exports or configuration methods.

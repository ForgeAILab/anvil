#!/usr/bin/env bun
// Make the publishable packages self-contained.
//
// `@forgeailab/spark` and `@forgeailab/create-spark` resolve their catalog
// (templates/, packs/, presets/, the canonical skills) by walking up to the
// monorepo root in development, or by finding it INSIDE the package when
// installed from npm (`findMonorepoRoot` in packages/create-spark/src/paths.ts).
// The second case only works if the catalog was copied into the package
// before `npm publish`, and the release workflow publishes with plain
// `npm publish` — so this script is the step that copies it in and adds the
// copied directories to each package's `files`.
//
// It is idempotent and does NOT restore anything: CI checkouts are
// ephemeral. For a local publish, `scripts/publish-all.ts` applies the same
// bundling through `bundleCatalogs` and restores the tree afterwards.
//
// Usage:
//   bun run scripts/bundle-catalogs.ts            # bundle in place (CI)
//   bun run scripts/bundle-catalogs.ts --check    # exit 1 if a package is missing its catalog

import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Per-package list of repo paths to copy INTO the package directory before
// publishing. Each entry is `[srcRelToRoot, dstRelToPackage]`.
export const CATALOG_BUNDLES: Record<string, Array<readonly [string, string]>> = {
  'packages/spark': [
    ['packs', 'packs'],
    ['presets', 'presets'],
    ['templates', 'templates'],
  ],
  'packages/create-spark': [
    ['packs', 'packs'],
    ['presets', 'presets'],
    ['templates', 'templates'],
    ['.claude/skills', '.claude/skills'],
    ['.codex/skills', '.codex/skills'],
    ['scripts/sync-skills.ts', 'scripts/sync-skills.ts'],
  ],
};

export type BundleResult = {
  /** Package dir (relative to root) -> top-level entries added under it. */
  added: Record<string, string[]>;
  /** Absolute paths created under package dirs, for callers that restore. */
  createdPaths: string[];
  /** package.json paths rewritten, with their prior contents. */
  packageJsonSnapshots: Map<string, string>;
};

/** Copy every catalog bundle into its package and list it in `files`. */
export function bundleCatalogs(root: string): BundleResult {
  const result: BundleResult = { added: {}, createdPaths: [], packageJsonSnapshots: new Map() };

  for (const [dir, bundles] of Object.entries(CATALOG_BUNDLES)) {
    const pkgPath = join(root, dir, 'package.json');
    if (!existsSync(pkgPath)) {
      continue;
    }
    const original = readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(original) as { files?: string[] };

    const addedTopLevel = new Set<string>();
    for (const [srcRel, dstRel] of bundles) {
      const src = join(root, srcRel);
      const dst = join(root, dir, dstRel);
      if (!existsSync(src)) {
        continue;
      }
      cpSync(src, dst, { recursive: true, dereference: false });
      // Track the top-level entry under the package so a restoring caller
      // removes the whole subtree, including parents that did not exist.
      addedTopLevel.add(dstRel.split('/')[0]);
    }

    const added = Array.from(addedTopLevel).toSorted();
    result.added[dir] = added;
    for (const top of added) {
      result.createdPaths.push(join(root, dir, top));
    }
    pkg.files = Array.from(new Set([...(pkg.files ?? []), ...added]));
    result.packageJsonSnapshots.set(pkgPath, original);
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  return result;
}

/** True when every package already carries the catalog it needs. */
export function catalogsAreBundled(root: string): boolean {
  return Object.entries(CATALOG_BUNDLES).every(([dir, bundles]) =>
    bundles.every(([srcRel, dstRel]) => {
      const src = join(root, srcRel);
      return !existsSync(src) || existsSync(join(root, dir, dstRel));
    }),
  );
}

if (import.meta.main) {
  const root = process.cwd();
  if (process.argv.includes('--check')) {
    if (catalogsAreBundled(root)) {
      console.log('Catalogs are bundled into every publishable package.');
    } else {
      console.error('A publishable package is missing its catalog. Run bun run scripts/bundle-catalogs.ts.');
      process.exit(1);
    }
  } else {
    const result = bundleCatalogs(root);
    for (const [dir, added] of Object.entries(result.added)) {
      console.log(`${dir}: bundled ${added.join(', ')}`);
    }
  }
}

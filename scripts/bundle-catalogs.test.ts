import { describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bundleCatalogs, catalogsAreBundled } from './bundle-catalogs.ts';

function skeleton(): string {
  const root = mkdtempSync(join(tmpdir(), 'spark-bundle-'));
  for (const dir of ['templates/nextjs', 'packs/db-sqlite', 'presets', '.claude/skills/start', '.codex/skills/start', 'scripts']) {
    mkdirSync(join(root, dir), { recursive: true });
  }
  writeFileSync(join(root, 'templates/nextjs/template.toml'), 'name = "nextjs"\n');
  writeFileSync(join(root, 'packs/db-sqlite/pack.toml'), 'name = "db-sqlite"\n');
  writeFileSync(join(root, 'presets/lean-saas.toml'), 'name = "lean-saas"\n');
  writeFileSync(join(root, '.claude/skills/start/SKILL.md'), '---\nname: start\ndescription: x\n---\n');
  writeFileSync(join(root, '.codex/skills/start/SKILL.md'), '---\nname: start\ndescription: x\n---\n');
  writeFileSync(join(root, 'scripts/sync-skills.ts'), '// sync\n');
  for (const pkg of ['spark', 'create-spark']) {
    mkdirSync(join(root, 'packages', pkg, 'src'), { recursive: true });
    writeFileSync(
      join(root, 'packages', pkg, 'package.json'),
      `${JSON.stringify({ name: `@forgeailab/${pkg}`, version: '0.0.0', files: ['src', 'README.md'] }, null, 2)}\n`,
    );
  }
  return root;
}

describe('bundleCatalogs', () => {
  test('copies the catalog into each publishable package and lists it in files', () => {
    const root = skeleton();
    try {
      expect(catalogsAreBundled(root)).toBe(false);
      const result = bundleCatalogs(root);

      expect(existsSync(join(root, 'packages/create-spark/templates/nextjs/template.toml'))).toBe(true);
      expect(existsSync(join(root, 'packages/create-spark/packs/db-sqlite/pack.toml'))).toBe(true);
      expect(existsSync(join(root, 'packages/create-spark/.claude/skills/start/SKILL.md'))).toBe(true);
      expect(existsSync(join(root, 'packages/create-spark/scripts/sync-skills.ts'))).toBe(true);
      expect(existsSync(join(root, 'packages/spark/templates/nextjs/template.toml'))).toBe(true);
      expect(existsSync(join(root, 'packages/spark/.claude'))).toBe(false);

      const createSpark = JSON.parse(readFileSync(join(root, 'packages/create-spark/package.json'), 'utf8')) as {
        files: string[];
      };
      expect(createSpark.files).toEqual(['src', 'README.md', '.claude', '.codex', 'packs', 'presets', 'scripts', 'templates']);
      expect(result.added['packages/create-spark']).toEqual(['.claude', '.codex', 'packs', 'presets', 'scripts', 'templates']);
      expect(result.added['packages/spark']).toEqual(['packs', 'presets', 'templates']);
      expect(catalogsAreBundled(root)).toBe(true);

      // Idempotent: a second run leaves the same file list.
      bundleCatalogs(root);
      const again = JSON.parse(readFileSync(join(root, 'packages/create-spark/package.json'), 'utf8')) as {
        files: string[];
      };
      expect(again.files).toEqual(createSpark.files);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/updates.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const context = { exports: {}, require: (name) => {
  if (name === '../package.json') return { version: '0.4.0' };
  throw new Error('Unexpected import: ' + name);
}};
runInNewContext(compiled, context);
const { compareVersions, selectNewestRelease } = context.exports;

const repoBase = 'https://github.com/Reign-in-blood/Idual_app/releases';
function release(tag, { prerelease = true, draft = false, withApk = true } = {}) {
  return {
    tag_name: tag,
    html_url: repoBase + '/tag/' + tag,
    prerelease,
    draft,
    assets: withApk ? [{
      name: 'iDual-Remote-' + tag + '.apk',
      browser_download_url: repoBase + '/download/' + tag + '/iDual-Remote-' + tag + '.apk',
      state: 'uploaded'
    }] : []
  };
}

test('versions are ordered numerically, not lexically', () => {
  assert.equal(compareVersions('0.10.0', '0.9.9'), 1);
  assert.equal(compareVersions('v0.4.0', '0.4.0'), 0);
  assert.equal(compareVersions('0.3.0', '0.4.0'), -1);
});

test('published GitHub prereleases with APK are accepted', () => {
  const newest = selectNewestRelease([
    release('v0.3.0'), release('v0.5.0'), release('v0.4.0')
  ]);
  assert.equal(newest.version, '0.5.0');
  assert.equal(newest.url, repoBase + '/tag/v0.5.0');
});

test('drafts, missing APK files and invalid tags are ignored', () => {
  const newest = selectNewestRelease([
    release('v10.0.0', { draft: true }),
    release('v9.0.0', { withApk: false }),
    release('nightly'),
    release('v0.4.0', { prerelease: true })
  ]);
  assert.equal(newest.version, '0.4.0');
});

test('untrusted or unexpected release URLs are ignored', () => {
  const invalid = release('v99.0.0');
  invalid.assets[0].browser_download_url = 'https://evil.example/app.apk';
  assert.equal(selectNewestRelease([invalid, release('v0.3.0')]).version, '0.3.0');
});

test('invalid GitHub response is reported', () => {
  assert.throws(() => selectNewestRelease({ message: 'Not Found' }));
});

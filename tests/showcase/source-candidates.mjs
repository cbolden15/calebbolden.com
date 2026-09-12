import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, rmSync, copyFileSync, statfsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

// One enumerated source transformation per invocation, bound to an exact committed source.
const [sha, state, evidenceArg] = process.argv.slice(2);
const states = ['legacy-before', 'rich-draft-before', 'approved-rich', 'draft-rollback', 'body-removal-rollback', 'four-new-drafts', 'shell'];
if (!/^[a-f0-9]{40}$/.test(sha ?? '') || !states.includes(state)) throw Error('Exact source SHA and known state required');
const candidate = process.cwd(); const evidence = resolve(evidenceArg); mkdirSync(evidence, { recursive: true });
const free = statfsSync(candidate); if (free.bavail * free.bsize < 5 * 1024 ** 3) throw Error('Less than 5 GiB reserve');
execFileSync('git', ['merge-base', '--is-ancestor', '78f529e50f06e2e3b428e60c224e154acaa0d4f4', sha]);
const scratch = mkdtempSync(join(tmpdir(), 'showcase-source-')); writeFileSync(join(evidence, 'owned-source-path.txt'), scratch+'\n');
const archive = join(scratch, 'source.tar'); execFileSync('git', ['archive', '--format=tar', '--output='+archive, sha]); execFileSync('tar', ['-xf', archive, '-C', scratch]); rmSync(archive);
symlinkSync(join(candidate, 'node_modules'), join(scratch, 'node_modules'));
const manifestPath = join(scratch, 'showcase-evidence.manifest.json'); const manifestBytes = readFileSync(manifestPath);
if (createHash('sha256').update(manifestBytes).digest('hex') !== 'd9c2258c8f6377344ac16d0c357211304b81a2d65d0d5b4070671b3db96c4c37') throw Error('Accepted manifest changed');
const manifest = JSON.parse(manifestBytes); const slugs = ['vora','prism','agent-team','agent-config','control-center'];
const changed = state === 'four-new-drafts' ? slugs.slice(1) : ['legacy-before','rich-draft-before','draft-rollback','body-removal-rollback'].includes(state) ? ['vora'] : [];
const markers = [];
for (const slug of changed) {
  const name = {vora:'vora',prism:'prism','agent-team':'agentTeam','agent-config':'agentConfig','control-center':'controlCenter'}[slug];
  const resolver = 'resolve'+name[0].toUpperCase()+name.slice(1)+'Page';
  const file = join(scratch, 'lib/work/projects/'+slug+'.ts'); copyFileSync(file, file.replace('.ts','.reviewed-fixture.ts'));
  const marker = 'Draft '+state+' '+slug+' authored boundary marker.'; const fixtureMarker = 'Private sample '+state+' '+slug+' fixture boundary marker.';
  const draft = state.includes('draft'); if(draft) markers.push(marker,fixtureMarker);
  const body = draft ? `{publication:'draft',story:{...reviewed.caseStudy!.story!,about:${JSON.stringify(marker)}},localFixture:{kind:${JSON.stringify(slug)},path:'lib/work/fixtures/${slug}.json'}}` : 'undefined';
  writeFileSync(file, `import type {ProjectRecord} from '../types';\nimport {${name} as reviewed} from './${slug}.reviewed-fixture';\nexport {${resolver}} from './${slug}.reviewed-fixture';\nif(reviewed.caseStudy?.publication !== 'published') throw Error('Expected approved source body');\nexport const ${name}: ProjectRecord = {...reviewed,caseStudy:${body}};\n`);
  const fixturePath = join(scratch,'lib/work/fixtures/'+slug+'.json'); const fixture = JSON.parse(readFileSync(fixturePath,'utf8'));
  if(draft) {
    const scenario = fixture.scenarios[0];
    if(slug==='vora') scenario.business=fixtureMarker;
    if(slug==='prism') scenario.events[0].description=fixtureMarker;
    if(slug==='agent-team') scenario.stages[0].artifact=fixtureMarker;
    if(slug==='agent-config') scenario.fragment.content=fixtureMarker;
    if(slug==='control-center') scenario.runs[0].host=fixtureMarker;
    writeFileSync(fixturePath,JSON.stringify(fixture,null,2)+'\n');
  }
}
const removed = manifest.snapshots.filter(snapshot => snapshot.fixtures.some(f => changed.some(slug => f.path === 'lib/work/fixtures/'+slug+'.json')));
for(const snapshot of removed) for(const media of snapshot.media) rmSync(join(scratch,media.path));
manifest.snapshots = manifest.snapshots.filter(snapshot => !removed.includes(snapshot)); writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
if (state==='shell') for(const slug of slugs) {
  const name = {vora:'Vora',prism:'Prism','agent-team':'AgentTeam','agent-config':'AgentConfig','control-center':'ControlCenter'}[slug];
  writeFileSync(join(scratch,'components/work/demos/'+name+'Demo.tsx'),`// Isolated matched source shell: no client entry or enhancement host.\nexport default function ${name}Demo(_props: {fixture: unknown}) { return null; }\n`);
}
const expectation = {sha,state,scratch,changed,markers,removedMedia:removed.flatMap(s=>s.media.map(m=>m.path.replace(/^public/,''))),counts:state==='four-new-drafts'?[3,3,0]:[7,3,4],homeCount:state==='four-new-drafts'?5:9,methodCount:state==='four-new-drafts'?0:4,manifestSha256:createHash('sha256').update(readFileSync(manifestPath)).digest('hex')};
writeFileSync(join(evidence,'expectation.json'),JSON.stringify(expectation,null,2));
// Preserve exact transformed public-only sources and immutable input hashes for reconstruction.
mkdirSync(join(evidence,'source'),{recursive:true});
for(const slug of changed) for(const [folder,ext] of [['projects','ts'],['fixtures','json']]) copyFileSync(join(scratch,'lib/work/'+folder+'/'+slug+'.'+ext),join(evidence,'source',slug+'.'+ext));
copyFileSync(manifestPath,join(evidence,'source/manifest.json'));
execFileSync(process.execPath, ['--import','tsx','tests/showcase/source-expectations.ts',join(evidence,'selectors.json')],{cwd:scratch,env:{...process.env,NODE_ENV:'production'},timeout:30000,stdio:'inherit'});
console.log(JSON.stringify(expectation));

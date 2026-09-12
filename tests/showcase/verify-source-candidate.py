"""Validate one generated source candidate; retain compact artifacts before explicit cleanup."""
import pathlib, json, os, subprocess, sys, tarfile, hashlib, shutil
root = pathlib.Path(__file__).resolve().parents[2]
evidence = pathlib.Path(sys.argv[1]).resolve()
expected = json.loads((evidence/'expectation.json').read_text())
source = pathlib.Path(expected['scratch'])
assert source.name.startswith('showcase-source-') and (evidence/'owned-source-path.txt').read_text().strip()==str(source)
env = dict(os.environ, SHOWCASE_SERVER='production', SHOWCASE_EXPECTATION=str(evidence/'expectation.json'), SHOWCASE_RESULTS=str(evidence/'browser'), SHOWCASE_SOURCE_SHA=expected['sha'])
env['PATH']='/Users/calebbolden/.nvm/versions/node/v22.21.0/bin:'+env['PATH']
runner = root/'tests/showcase/record-command.py'
def run(label, command):
    result = subprocess.run(['python3', str(runner), str(evidence/(label+'.log')), *command], cwd=source, env=env, timeout=300)
    if result.returncode: raise SystemExit(result.returncode)
build_log=evidence/'build-complete.log' if (evidence/'build-complete.log').exists() else evidence/'build.log'
if not build_log.exists():
    assert shutil.disk_usage(source).free>5*1024**3
    run('build',['npm','run','build'])
else:
    assert '\nEXIT 0\n' in build_log.read_text(), 'Existing failed build must be resolved explicitly'
(evidence/'build-id.txt').write_text((source/'.next/BUILD_ID').read_text())
with tarfile.open(evidence/'emitted-client-chunks.tgz','w:gz') as archive:
    archive.add(source/'.next/static',arcname='static')
attempt='browser'
number=1
while (evidence/(attempt+'.log')).exists():
    number+=1
    attempt='browser-'+str(number)
env['SHOWCASE_RESULTS']=str(evidence/attempt)
if expected['state']=='shell':
    env.update(SHOWCASE_MEASURE='shell', SHOWCASE_MEASUREMENT_DIR=str(evidence/'measurements'))
    run(attempt,['npx','playwright','test','tests/showcase/performance.spec.ts','--project=chromium'])
else:
    if expected['state'] not in ['legacy-before','approved-rich','four-new-drafts']:
        env['SHOWCASE_LEGACY_REFERENCE']=str(evidence.parent/'legacy-before/legacy-body.json')
    run(attempt,['npx','playwright','test','tests/showcase/source-states.spec.ts','--project=chromium'])
# No disposal here: the caller inspects the recorded results before releasing this exact owned source.

(evidence/'browser-result.json').write_text(json.dumps({'log':attempt+'.log','results':attempt,'exit':0},indent=2))

"""Release only a passed, recorded disposable source after preserving compact evidence."""
import json, pathlib, tempfile, shutil, os, sys, socket
folder=pathlib.Path(sys.argv[1]).resolve()
expected=json.loads((folder/'expectation.json').read_text())
source=pathlib.Path(expected['scratch'])
assert source.name.startswith('showcase-source-') and (folder/'owned-source-path.txt').read_text().strip()==str(source)
result=json.loads((folder/'browser-result.json').read_text())
assert result['exit']==0 and '\nEXIT 0\n' in (folder/result['log']).read_text()
assert (folder/'emitted-client-chunks.tgz').stat().st_size>0
if expected['state']=='four-new-drafts':
    assert json.loads((folder/'development-result.json').read_text())['exit']==0
    assert '\nEXIT 0\n' in (folder/'development-browser.log').read_text()
probe=socket.socket(); probe.settimeout(1)
assert probe.connect_ex(('localhost',3100))!=0, 'Release the current runtime before source cleanup'
probe.close()
record=folder.parent.parent/'owned-dependencies.txt'
if record.exists(): dependencies=pathlib.Path(record.read_text().strip())
else:
    dependencies=pathlib.Path(tempfile.mkdtemp(prefix='showcase-dependencies-'))
    record.write_text(str(dependencies)+'\n')
assert dependencies.name.startswith('showcase-dependencies-')
os.rename(source/'node_modules',dependencies/'node_modules')
shutil.rmtree(source)
(folder/'cleanup.json').write_text(json.dumps({'removedOwnedSource':str(source),'retainedDependencies':str(dependencies),'port3100Closed':True},indent=2))
print('Released '+str(source)+'; retained reusable installed hardlinks at '+str(dependencies))

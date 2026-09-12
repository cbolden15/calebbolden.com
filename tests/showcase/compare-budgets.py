"""Compare retained matched production measurements without refetching unchanged bytes."""
import json, pathlib, sys
candidate_dir, shell_dir, output = map(pathlib.Path, sys.argv[1:])
rows=[]
for slug in ['vora','prism','agent-team','agent-config','control-center']:
    candidate=json.loads((candidate_dir/(slug+'.json')).read_text())
    shell=json.loads((shell_dir/(slug+'.json')).read_text())
    assert candidate['source']==shell['source']
    assert candidate['node']==shell['node']=='22.21.0'
    assert candidate['zlib']==shell['zlib']=='1.3.1-470d3a2'
    for value in [candidate,shell]:
        assert len({f['sha256'] for f in value['files']})==len(value['files'])
        assert sum(f['gzipBytes'] for f in value['files'])==value['total']
    added=candidate['total']-shell['total']
    assert added<=100000, (slug,added)
    rows.append({'slug':slug,'source':candidate['source'],'candidateBuild':candidate['buildId'],'shellBuild':shell['buildId'],'candidateEager':candidate['eager'],'candidateTotal':candidate['total'],'shellEager':shell['eager'],'shellTotal':shell['total'],'added':added,'limit':100000})
output.write_text(json.dumps({'node':'22.21.0','zlib':'1.3.1-470d3a2','routes':rows},indent=2)+'\n')
for row in rows: print(json.dumps(row))

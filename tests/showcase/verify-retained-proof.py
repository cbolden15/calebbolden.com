"""Validate durable response identities and bodies before releasing a source build."""
import pathlib,json,gzip,hashlib,sys,urllib.parse,tarfile
folder=pathlib.Path(sys.argv[1]).resolve()
result=json.loads((folder/'browser-result.json').read_text())
proofs=list((folder/result['results']).rglob('source-state-proof.json'))
assert len(proofs)==1,proofs
proof=json.loads(proofs[0].read_text());expected=json.loads((folder/'expectation.json').read_text())
assert proof['expected']==expected
assert proof['buildId']==(folder/'build-id.txt').read_text().strip()
assert len(proof['checks'])==11 and len(proof['responses'])==21
inventory=[]
for response in proof['responses']:
 path=pathlib.Path(response['path']);assert path.is_relative_to(folder) and path.stat().st_size>0
 body=gzip.decompress(path.read_bytes());assert len(body)==response['bytes']>0;assert hashlib.sha256(body).hexdigest()==response['sha256']
 assert response['buildId']==proof['buildId']
 url=urllib.parse.urlparse(response['url']);route=urllib.parse.urlparse(response['route']);assert url.path==route.path
 draft=expected['state']=='four-new-drafts' and any(route.path=='/work/'+s for s in expected['changed'])
 assert response['status']==(404 if draft else 200)
 if response['name'].endswith('-rsc'):
  assert 'text/x-component' in response['headers']['content-type'];query=urllib.parse.parse_qs(url.query)
  assert query['_rsc']==['source-state'];assert query.get('category')==urllib.parse.parse_qs(route.query).get('category')
  assert response['request']['headers']=={'RSC':'1'}
 else:
  assert proof['buildId'].encode() in body or route.path=='/sitemap.xml'
 for marker in expected['markers']:assert marker.encode() not in body
 inventory.append({'path':str(path.relative_to(folder)),'gzipSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bodySha256':response['sha256'],'bytes':len(body)})
assert proof['chunkEvidence']
archive=folder/'emitted-client-chunks.tgz';assert archive.stat().st_size>0
with tarfile.open(archive) as chunks:
 for row in proof['chunkEvidence']:
  name=row['file'].removeprefix('.next/');body=chunks.extractfile(name).read();assert hashlib.sha256(body).hexdigest()==row['sha256']
inventory.append({'path':archive.name,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest()})
(folder/'verified-response-inventory.json').write_text(json.dumps({'source':expected['sha'],'applicationSource':expected['applicationSource'],'buildId':proof['buildId'],'responses':inventory},indent=2))
print('Verified 21 decompressed HTTP/RSC bodies, 11 route identities, explicit state/status/MIME/query, marker absence and retained chunk archive',proof['buildId'])

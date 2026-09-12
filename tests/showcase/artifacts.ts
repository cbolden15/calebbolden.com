import { writeFileSync, readFileSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import type { TestInfo } from '@playwright/test';
export async function artifact(info: TestInfo, name: string, value: unknown) {
  const path=info.outputPath(name+'.json'); const bytes=Buffer.from(JSON.stringify(value,null,2));
  if(bytes.length>5000000) throw Error('Bounded JSON evidence exceeded 5 MB');
  writeFileSync(path,bytes); JSON.parse(readFileSync(path,'utf8'));
  await info.attach(name,{path,contentType:'application/json'}); return path;
}
export async function responseArtifact(info: TestInfo, name: string, body: Buffer, identity: object) {
  if(!body.length || body.length>5000000) throw Error('Expected bounded nonempty HTTP body');
  const path=info.outputPath(name+'.gz');writeFileSync(path,gzipSync(body));
  if(!gunzipSync(readFileSync(path)).equals(body)) throw Error('Response evidence roundtrip failed');
  await info.attach(name,{path,contentType:'application/gzip'});
  return {name,path,bytes:body.length,sha256:createHash('sha256').update(body).digest('hex'),...identity};
}

import { writeFileSync } from 'node:fs';
import { projectRecords, evidenceManifest, getCatalog, getHomeProjects, getMethodProjects, getRelatedProjects, getPublishedCaseStudyPaths } from '../../lib/work/catalog';
import { resolvePublicProjectView } from '../../lib/work/publication';
import { collectRequiredShowcaseAssets } from '../../lib/work/publication';
import { resolveVoraPage } from '../../lib/work/projects/vora';
import { projectMetadata } from '../../lib/work/public-content';
const views = projectRecords.map(record => ({slug:record.slug,view:resolvePublicProjectView(record),metadata:record.slug==='vora'?resolveVoraPage(record).metadata:projectMetadata(record)}));
writeFileSync(process.argv[2],JSON.stringify({views,catalog:['all','products','developer-tools'].map(c=>getCatalog(c)),home:getHomeProjects(),method:getMethodProjects(),related:projectRecords.map(r=>({slug:r.slug,links:getRelatedProjects(r.slug)})),paths:getPublishedCaseStudyPaths(),assets:collectRequiredShowcaseAssets(projectRecords,evidenceManifest)},null,2));

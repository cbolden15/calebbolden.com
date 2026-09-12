/** Fixed local navigation/framework/static traffic only; this is a test policy, not an app override. */
const local = 'http://localhost:3100';
const routes = new Set(['/', '/work', '/how-i-build', '/sitemap.xml', '/contact','/blog','/results','/resources','/method','/operators','/owners','/partners','/privacy','/terms','/services/marketing','/services/seo','/services/web-development','/tools/ai-readiness', ...['vora','prism','agent-team','agent-config','control-center','chapterhq','site-assistant','open-source'].map(s=>'/work/'+s)]);
/** @param {import('@playwright/test').Request} request */
export function allowedRequest(request) {
  const url = new URL(request.url());
  if (url.origin !== local || !['GET','HEAD'].includes(request.method()) || request.resourceType()==='eventsource') return false;
  const type=request.resourceType();
  if (request.isNavigationRequest()) return routes.has(url.pathname);
  if (['fetch','xhr'].includes(type)) return request.headers().rsc==='1' && url.searchParams.has('_rsc') && routes.has(url.pathname);
  return ['script','stylesheet','image','font','media'].includes(type) && !url.pathname.startsWith('/api/') && (url.pathname.startsWith('/_next/') || /\.(?:js|css|woff2?|ttf|ico|svg|png|jpe?g|webp|avif|mp4|webm|vtt)$/.test(url.pathname));
}
/** @param {import('@playwright/test').BrowserContext} context */
export async function installLocalGuard(context, development=false) {
  const unexpected=[]; const requests=[];
  await context.route('**/*',route=>{
    const request=route.request(); const allowed=allowedRequest(request);
    const record={method:request.method(),url:request.url(),type:request.resourceType(),navigation:request.isNavigationRequest(),rsc:request.headers().rsc??null,allowed};
    requests.push(record);
    if(!allowed){unexpected.push(record);return route.abort('blockedbyclient');}
    return route.continue();
  });
  await context.routeWebSocket(/.*/,socket=>{
    const url=new URL(socket.url());
    if(development && url.hostname==='localhost' && url.port==='3100' && url.pathname==='/_next/webpack-hmr') socket.connectToServer();
    else {unexpected.push({method:'WebSocket',url:socket.url(),type:'websocket',navigation:false,rsc:null,allowed:false});socket.close();}
  });
  return {unexpected,requests};
}
/** Actual browser requests, deliberately rejected before reaching the local server. @param {import('@playwright/test').Page} page */
export async function rejectionProbe(page) {
  await page.evaluate(async()=>{
    await fetch('/work?guard-probe=get').catch(()=>null);
    await fetch('/work?guard-probe=post',{method:'POST',body:'synthetic guard probe'}).catch(()=>null);
    await new Promise(resolve=>{const events=new EventSource('/work?guard-probe=events');events.onerror=()=>{events.close();resolve(null);};});
  });
}

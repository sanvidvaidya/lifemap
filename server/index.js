/**
 * Cloudflare Worker entry point used by OpenAI Sites.
 * The SPA itself is still entirely static and local-first; this adapter only
 * asks the platform's static-asset binding to serve the generated files.
 */
const worker = {
  async fetch(request, env) {
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404 || request.method !== 'GET') {
      return assetResponse;
    }

    const url = new URL(request.url);
    const finalSegment = url.pathname.split('/').pop() ?? '';

    if (finalSegment.includes('.')) {
      return assetResponse;
    }

    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
  },
};

export default worker;

const SKILL = 'https://raw.githubusercontent.com/shrey258/email-tracker/main/SKILL.md';

async function skill() {
  const upstream = await fetch(SKILL, { cf: { cacheTtl: 300 } });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': 'text/markdown; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
}

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname.toLowerCase() === '/skill.md') return skill();
    return env.ASSETS.fetch(request);
  },
};

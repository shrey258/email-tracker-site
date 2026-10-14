const SKILL = 'https://raw.githubusercontent.com/shrey258/email-tracker/main/SKILL.md';

async function skill() {
  const upstream = await fetch(SKILL, { cf: { cacheTtl: 300 } });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': 'text/markdown; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
}

const MIXPANEL_TOKEN = '897023a51e4df408ac52daada0fb4cb6';

function trackSkillFetch(request) {
  const data = JSON.stringify([{ event: 'skill_fetched', properties: {
    token: MIXPANEL_TOKEN,
    distinct_id: crypto.randomUUID(),
    $insert_id: crypto.randomUUID(),
    time: Date.now(),
    env: 'production',
    user_agent: request.headers.get('user-agent') ?? '',
    country: request.cf?.country ?? '',
  } }]);
  return fetch('https://api.mixpanel.com/track', { method: 'POST', body: new URLSearchParams({ data }) });
}

export default {
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname.toLowerCase() === '/skill.md') {
      ctx.waitUntil(trackSkillFetch(request));
      return skill();
    }
    return env.ASSETS.fetch(request);
  },
};

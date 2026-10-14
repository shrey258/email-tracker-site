const MIXPANEL_TOKEN = '897023a51e4df408ac52daada0fb4cb6';
const visitor = localStorage.visitor ??= crypto.randomUUID();
const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([key]) => key.startsWith('utm_')));

function track(event, props = {}) {
  const data = JSON.stringify([{ event, properties: {
    token: MIXPANEL_TOKEN,
    distinct_id: visitor,
    $insert_id: crypto.randomUUID(),
    time: Date.now(),
    env: location.hostname === 'emailtracker.shrey258.com' ? 'production' : 'dev',
    $current_url: location.href,
    $referrer: document.referrer,
    $screen_width: screen.width,
    ...utm,
    ...props,
  } }]);
  navigator.sendBeacon('https://api.mixpanel.com/track?ip=1', new URLSearchParams({ data }));
}

track('page_viewed');

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (link) track('link_clicked', { href: link.href, place: link.closest('footer') ? 'footer' : 'caption' });
});

const PROMPT = 'Set up this email tracker: https://emailtracker.shrey258.com/skill.md';
const AUTO_REVEAL_MS = 2500;

function reveal() {
  document.body.classList.add('lit');
}

const blank = document.querySelector('.blank');
const light = document.querySelector('.light');

const beamX = (v) => 0.6525 - 0.294 * v;

function aimLight() {
  const word = blank.getBoundingClientRect();
  const x = word.left + word.width / 2;
  const y = word.top + word.height / 2;
  let size = Math.max(innerWidth * 1.1, innerHeight * 1.6, y / 0.225);
  for (let i = 0; i < 3; i++) {
    const u = beamX(y / (0.75 * size));
    size = Math.max(size, x / u, (innerWidth - x) / (1 - u));
  }
  const left = x - beamX(y / (0.75 * size)) * size;
  light.style.setProperty('--light-size', `${size}px auto`);
  light.style.setProperty('--light-x', `${left}px`);
  light.style.setProperty('--source-x', `${left + 0.6525 * size}px`);
}

aimLight();
addEventListener('resize', aimLight);
blank.addEventListener('pointerenter', reveal);
blank.addEventListener('click', reveal);
blank.addEventListener('focus', reveal);
window.addEventListener('scroll', reveal, { once: true });
setTimeout(reveal, AUTO_REVEAL_MS);

const copy = document.querySelector('.copy');
const status = document.querySelector('[role=status]');
const sub = document.querySelector('.sub');
const subText = sub.textContent;

function announce(message) {
  status.textContent = message;
  setTimeout(() => { status.textContent = ''; }, 1600);
}

const REPO = 'https://github.com/shrey258/email-tracker';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const OUT = { duration: 140, easing: 'cubic-bezier(0.4, 0, 1, 1)' };
const IN = { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
const shown = { opacity: 1, transform: 'none', filter: 'blur(0)' };

async function swapSub(...content) {
  if (reducedMotion.matches) return sub.replaceChildren(...content);
  await sub.animate([shown, { opacity: 0, transform: 'translateY(-6px)', filter: 'blur(2px)' }], OUT).finished;
  sub.replaceChildren(...content);
  sub.animate([{ opacity: 0, transform: 'translateY(6px)', filter: 'blur(2px)' }, shown], IN);
}

function askForStar() {
  const link = document.createElement('a');
  link.href = REPO;
  link.textContent = 'star it on GitHub';
  if (sub.querySelector('a')) return;
  swapSub('Copied. While your agent sets it up, ', link, ' ★');
}

function showCopied() {
  copy.classList.add('done');
  announce('Copied');
  askForStar();
  setTimeout(() => copy.classList.remove('done'), 1600);
}

function selectPrompt() {
  const range = document.createRange();
  range.selectNodeContents(document.querySelector('.pill code'));
  getSelection().removeAllRanges();
  getSelection().addRange(range);
  const keys = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘C' : 'Ctrl+C';
  const message = `Selected. Press ${keys} to copy.`;
  swapSub(message);
  announce(message);
  setTimeout(() => swapSub(subText), 4000);
}

copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(PROMPT);
    showCopied();
  } catch {
    selectPrompt();
  }
});

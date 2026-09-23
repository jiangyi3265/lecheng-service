import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('static/icons', { recursive: true });
// Code-drawn icons in the same local PNG pipeline as scripts/icons.mjs.
const icons = {
  support: ['#faf2ff', '#aa9df8', '#7463e8', '<path d="M31 54v-8a19 19 0 0 1 38 0v8" fill="none" stroke="url(#g)" stroke-width="8"/><rect x="25" y="46" width="13" height="23" rx="6"/><rect x="62" y="46" width="13" height="23" rx="6"/><path d="M69 66q0 11-17 11" fill="none" stroke="url(#g)" stroke-width="5"/><rect x="44" y="72" width="13" height="8" rx="4"/>'],
  collection: ['#edf2ff', '#a69dfb', '#7161e7', '<path d="m50 22 9 18 20 3-14 15 3 20-18-10-18 10 3-20-14-15 20-3Z"/><path d="m43 40 4 8 8 2" fill="none" stroke="#e8e4ff" stroke-width="5" stroke-linecap="round"/>'],
  benefits: ['#fff0f3', '#ff829b', '#ef4c71', '<path d="M30 26h40v52l-5-4-5 4-5-4-5 4-5-4-5 4-5-4-5 4Z"/><rect x="39" y="21" width="22" height="9" rx="4" fill="#d83e63"/><path d="m41 37 9 12 9-12M40 49h20M40 57h20M50 48v17" fill="none" stroke="#fff7fa" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'],
  guide: ['#e8f5ff', '#70c7f6', '#4d94ee', '<path d="m24 31 17-6 18 7 17-7v44l-17 7-18-7-17 6Z"/><path d="M41 28v40m18-33v38" stroke="#d8f2ff" stroke-width="3"/><path d="M63 27a10 10 0 0 1 10 10c0 8-10 17-10 17S53 45 53 37a10 10 0 0 1 10-10Z" fill="#fafcff"/><circle cx="63" cy="37" r="4" fill="#659ced"/>'],
  process: ['#e7f3ff', '#71bcf9', '#438ce4', '<path d="M25 72V47a24 24 0 0 1 48 0v25Z"/><g fill="none" stroke="#f5fbff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="48" cy="39" r="7"/><path d="M34 65v-6a14 14 0 0 1 28 0v6M40 65v-8m16 8v-8M43 49l5 8 5-8M39 51v8a4 4 0 0 0 8 0v-5"/></g><circle cx="69" cy="67" r="13" fill="#9bdbf8"/><path d="M62 59v6a5 5 0 0 0 10 0v-6M67 70v3a5 5 0 0 0 10 0v-4" fill="none" stroke="#f6fcff" stroke-width="2.6" stroke-linecap="round"/><circle cx="77" cy="66" r="3" fill="#f6fcff"/>'],
  settings: ['#f1efff', '#aca7f6', '#7c76df', '<path d="m70 57 9 5v11l-9 5-9-5V62Z" fill="#847de3"/><path d="m48 22 22 13v27L48 75 26 62V35Z"/><path d="m48 36 10 6v13l-10 6-10-6V42Z" fill="none" stroke="#f5f2ff" stroke-width="5" stroke-linejoin="round"/>'],
};
for (const [name, [bg, light, dark, shape]] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><linearGradient id="g" x2=".8" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="${bg}"/><ellipse cx="51" cy="80" rx="23" ry="4" fill="${dark}" opacity=".1"/><g fill="url(#g)">${shape}</g></svg>`;
  await sharp(Buffer.from(svg), { density: 216 }).png().toFile(`static/icons/mine-${name}.png`);
}
const phone = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"><path fill="#0db66b" d="M6.5 2.5c-.7-.7-1.8-.7-2.5 0L2.6 3.9C.3 6.2 3 12.9 7.5 17.4S18.7 24.6 21 22.3l1.4-1.4c.7-.7.7-1.8 0-2.5l-3.3-3.3c-.7-.7-1.7-.7-2.4-.1l-2 1.7c-2.7-1.4-5.1-3.8-6.5-6.5l1.7-2c.6-.7.6-1.7-.1-2.4Z"/></svg>';
await sharp(Buffer.from(phone)).png().toFile('static/icons/mine-phone.png');
console.log('Generated 7 personal page icons.');

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
const dir = path.resolve("static/icons");
mkdirSync(dir, { recursive: true });
const shapes = {
	home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
	"home-fill":
		'<path fill="currentColor" stroke="currentColor" d="m2.5 10 9.5-8 9.5 8-1.5 1.5-1-1V21h-5v-7h-5v7H5V10.5l-1 1z"/>',
	search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
	message:
		'<path d="M21 11.5a9 9 0 0 1-9 9c-1.5 0-3-.4-4.3-1L3 21l1.4-4.6A9 9 0 1 1 21 11.5Z"/><path d="m8 11 3 3 5-5"/>',
	"message-fill":
		'<path fill="currentColor" d="M21 11.5a9 9 0 0 1-9 9c-1.5 0-3-.4-4.3-1L3 21l1.4-4.6A9 9 0 1 1 21 11.5Z"/><path stroke="white" d="m8 11 3 3 5-5"/>',
	user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/>',
	"user-fill":
		'<circle cx="12" cy="6" r="4" fill="currentColor"/><path d="M4 22v-3a8 8 0 0 1 16 0v3Z" fill="currentColor"/>',
	pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
	bell: '<path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10M10 21h4"/>',
	chevron: '<path d="m9 5 7 7-7 7"/>',
	back: '<path d="m15 4-8 8 8 8"/>',
	down: '<path d="m6 9 6 6 6-6"/>',
	capsule:
		'<path d="m8 4-5 5a6 6 0 0 0 9 9l5-5a6 6 0 0 0-9-9Z" transform="translate(2 1)"/><path d="m7 8 9 9"/>',
	equipment:
		'<rect x="3" y="3" width="18" height="18" rx="5"/><rect x="7" y="5" width="10" height="14" rx="4"/><path d="M12 7v10m-3-7h6m-6 4h6"/>',
	filter: '<path d="M3 6h7m4 0h7M3 12h13m4 0h1M3 18h3m4 0h11"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
	chat: '<path d="M21 10v5a4 4 0 0 1-4 4H9l-5 3v-4a4 4 0 0 1-2-3V7a4 4 0 0 1 4-4h10a5 5 0 0 1 5 7Z"/><path d="M7 9h10M7 13h7"/>',
	bookmark: '<path d="M5 3h14v19l-7-5-7 5Z"/>',
	"bookmark-fill": '<path d="M5 3h14v19l-7-5-7 5Z" fill="currentColor"/>',
	stethoscope:
		'<path d="M5 3v7a5 5 0 0 0 10 0V3M3 3h4m6 0h4M10 15v2a5 5 0 0 0 10 0v-4"/><circle cx="20" cy="10" r="3"/>',
	eye: '<path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
	bone: '<path d="M16 3a3 3 0 0 0-2 4l-7 7a3 3 0 1 0-4 4 3 3 0 1 0 4 3l7-7a3 3 0 1 0 4-4 3 3 0 0 0-2-7Z"/>',
	"heart-pulse":
		'<path d="M20 4a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 1 11 8 17 7-6 13-12 8-17Z"/><path d="M3 12h4l2-4 4 8 2-4h6"/>',
	heart: '<path d="M20 4a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 1 11 8 17 7-6 13-12 8-17Z"/>',
	calendar:
		'<rect x="3" y="5" width="18" height="17" rx="3"/><path d="M7 2v6M17 2v6M3 11h18m-14 4h3m4 0h3m-10 4h3"/>',
	phone: '<path d="m7 3 3 5-3 3a13 13 0 0 0 6 6l3-3 5 3-1 4C10 24 0 14 3 4Z"/>',
	building:
		'<path d="M3 22V8h9v14M12 22V2h9v20M1 22h22M6 11h3m-3 4h3m-3 4h3m6-12h3m-3 4h3m-3 4h3m-3 4h3"/>',
	leaf: '<path d="M21 3C5 1-2 11 5 18c7 6 16-1 16-15Z"/><path d="M4 22 17 9"/>',
	arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
	notice: '<path d="M3 9v6h5l11 5V4L8 9ZM8 15l2 7h4l-3-6M22 8v8"/>',
	star: '<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z"/>',
	document:
		'<path d="M15 3H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14V7ZM15 3v5h6M7 12h9m-9 4h6"/>',
	headset:
		'<path d="M3 12V10a9 9 0 0 1 18 0v8a4 4 0 0 1-4 4h-3"/><rect x="2" y="10" width="4" height="8" rx="2"/><rect x="18" y="10" width="4" height="8" rx="2"/><path d="M11 22h4"/>',
	settings:
		'<path d="m10 2-1 3-3-1-2 3 2 2-1 3-3 1 1 4 3 0 2 2 0 3 4 1 1-3 3-1 2 2 3-3-2-2 0-3 3-1-1-4-3 0-2-2 0-3Z" transform="translate(1 0) scale(.92)"/><circle cx="12" cy="12" r="3.5"/>',
	wifi: '<path d="M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0"/><circle cx="12" cy="20" r=".8" fill="currentColor"/>',
	close: '<path d="m6 6 12 12M6 18 18 6"/>',
	check: '<path d="m4 12 5 5L20 6"/>',
	clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v7l4 2"/>',
	send: '<path d="m22 2-7 20-4-9-9-4ZM11 13 22 2"/>',
	robot: '<rect x="3" y="7" width="18" height="14" rx="6"/><path d="M12 7V3M1 12v5m22-5v5m-14 0h6"/><circle cx="8" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="2" r="1"/>',
};
for (const [name, shape] of Object.entries(shapes))
	for (const [color, hex] of Object.entries({
		ink: "#183451",
		blue: "#0785FF",
		muted: "#8292A8",
		white: "#FFFFFF",
		teal: "#0CB6C4",
	})) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${hex}" color="${hex}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${shape}</svg>`;
		await sharp(Buffer.from(svg), { density: 288 })
			.png()
			.toFile(path.join(dir, `${name}-${color}.png`));
	}
const avatar =
	'<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="#d9f0ff"/><stop offset="1" stop-color="#82c1fa"/></linearGradient></defs><circle cx="80" cy="80" r="80" fill="url(#b)"/><path d="M25 160v-23q5-23 35-31h40q30 8 35 31v23" fill="#3878d2"/><path d="m61 105 19 22 20-22-6-10H67" fill="#f2bd9f"/><path d="m60 106 20 21-13 13-14-27m47-7-20 21 13 13 14-27" fill="#edf7ff"/><ellipse cx="80" cy="70" rx="29" ry="36" fill="#ffd5b8"/><path d="M51 73q-12-40 15-48 5-18 30-9 27 8 18 43l-7 18-3-34q-17 8-38-2-13 11-10 32" fill="#233d5c"/><path d="M53 66q-11-5-7 9 2 8 10 7m51-16q10-4 6 10-2 7-9 7" fill="#ffd5b8"/><path d="M67 68v5m25-5v5" stroke="#3b455a" stroke-width="3" stroke-linecap="round"/><path d="m79 72-3 11h6" stroke="#db9b7e" fill="none" stroke-width="2"/><path d="M73 91q8 5 15-1" stroke="#ba776b" fill="none" stroke-width="2" stroke-linecap="round"/></svg>';
mkdirSync(path.resolve("static/images"), { recursive: true });
writeFileSync(path.resolve("static/images/avatar.svg"), avatar);
await sharp(Buffer.from(avatar), { density: 144 })
	.png()
	.toFile(path.resolve("static/images/avatar.png"));
console.log(
	`Generated ${Object.keys(shapes).length * 5} local icons and avatar`,
);

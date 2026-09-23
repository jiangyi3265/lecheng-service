import fs from "node:fs/promises";
import sharp from "sharp";

// Small local illustrations for the directory banner, rendered to PNG for Weixin.
for (const [name, accent] of [["general", "#f27579"], ["specialist", "#42b9a7"]]) {
	const windows = [34, 49, 64].map(x => [57, 78].map(y => `<path d="M${x} ${y}l9 3v13l-9-3Z" fill="#548cd8"/>`).join("")).join("");
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 128 128">
	<defs><linearGradient id="front" x2="1" y2="1"><stop stop-color="#fbfdff"/><stop offset="1" stop-color="#cae0ff"/></linearGradient><linearGradient id="side" x2="1" y2="1"><stop stop-color="#b9d6ff"/><stop offset="1" stop-color="#76a9e7"/></linearGradient></defs>
	<ellipse cx="65" cy="114" rx="49" ry="9" fill="#2564b4" opacity=".17"/>
	<path d="M21 41 65 22 110 40 78 57Z" fill="#f0f7ff"/>
	<path d="M21 41 78 57v59l-57-20Z" fill="url(#front)"/>
	<path d="M78 57 110 40v58l-32 18Z" fill="url(#side)"/>
	${windows}<path d="M88 66l12-6v13l-12 6Zm0 22 12-6v13l-12 6Z" fill="#3772ba"/>
	<path d="M43 108V88l14 5v20" fill="#3d77c7"/>
	<path d="M36 17 58 8l22 9-21 10Z" fill="#b4d5ff"/><path d="M36 17 59 27v23L36 40Z" fill="#77aaf1"/><path d="M59 27 80 17v23L59 50Z" fill="#468ade"/>
	<path d="M91 34v7l-6 3v7l6-3v8l6-3v-8l6-3v-7l-6 3v-7Z" fill="${accent}"/>
	</svg>`;
	await fs.mkdir("static/images", { recursive: true });
	await sharp(Buffer.from(svg)).png().toFile(`static/images/hospital-${name}.png`);
}

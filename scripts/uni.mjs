import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const platform = process.argv[2] || "h5";
const build = process.argv[3] === "build";
const cli = path.join(
	path.dirname(require.resolve("@dcloudio/vite-plugin-uni/package.json")),
	"bin/uni.js",
);
const child = spawn(
	process.execPath,
	[cli, ...(build ? ["build"] : []), "-p", platform],
	{
		cwd: process.cwd(),
		stdio: "inherit",
		env: {
			...process.env,
			UNI_INPUT_DIR: process.cwd(),
			UNI_OUTPUT_DIR: path.resolve(
				"unpackage",
				"dist",
				build ? "build" : "dev",
				platform,
			),
		},
	},
);
child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", (error) => {
	console.error(error);
	process.exit(1);
});

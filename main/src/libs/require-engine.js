import {zeroFS, zeroPage} from "../zero";
import crypto from "crypto";
import {Buffer} from "buffer";
import RequireContext from "./require-context";
import Store from "./store";


export class FileNotFoundError extends Error {
};


export async function getManifest(prefix, fileName) {
	return JSON.parse(await zeroFS.readFile(`${prefix}__build/${fileName}`));
}

export async function rebuild(prefix, manifestName, rebuildFile, buildFunction) {
	if(!(await zeroPage.getSiteInfo()).settings.own) {
		return;
	}


	console.log("Checking for file changes");

	let manifest;
	try {
		manifest = await getManifest(prefix, manifestName);
	} catch(e) {
		if(buildFunction) {
			// Malformed manifest, let's try to rebuild completely
			console.warn("Malformed manifest, build");

			await Store.mount();
			await buildFunction();
			return await rebuild(prefix, manifestName, rebuildFile, null);
		} else {
			throw new FileNotFoundError(manifestName);
		}
	}

	const hashes = manifest._hashes;
	let newHashes = {};
	let changes = [];

	for(const fileName of Object.keys(hashes)) {
		let content;
		try {
			content = await zeroFS.readFile(`${prefix}${fileName}`, "arraybuffer");
		} catch(e) {
			console.log(fileName, "deleted");
			changes.push([
				fileName,
				"deleted"
			]);
			continue;
		}

		const newHash = crypto.createHash("md5").update(Buffer.from(content)).digest("hex");
		const oldHash = hashes[fileName];

		if(newHash != oldHash) {
			console.log(fileName, "changed");
			changes.push([
				fileName,
				"changed"
			]);
			newHashes[fileName] = newHash;
		} else {
			newHashes[fileName] = newHash;
		}
	}

	for(const fileName of await zeroFS.readDirectory(prefix.replace(/\/$/, ""), true)) {
		if(fileName.startsWith("__build/")) {
			continue;
		}

		if(!hashes[fileName]) {
			console.log(fileName, "added");
			changes.push([
				fileName,
				"added"
			]);

			const content = await zeroFS.readFile(`${prefix}${fileName}`, "arraybuffer");
			const newHash = crypto.createHash("md5").update(Buffer.from(content)).digest("hex");
			newHashes[fileName] = newHash;
		}
	}

	if(changes.length) {
		for(let i = 0; i < changes.length; i++) { // Don't optimize!
			const [fileName, action] = changes[i];
			if(manifest._dependents[fileName]) {
				changes = changes.concat(manifest._dependents[fileName].map(dependency => {
					return [dependency, "dependency"];
				}));
			}
		}

		console.log("Rebuilding", changes);

		let newDependents = {};
		for(const [fileName, action] of changes) {
			if(action === "deleted") {
				try {
					await zeroFS.deleteFile(`${prefix}__build/${fileName}`);
				} catch(e) {
					console.warn("[rebuild error]", "Could not delete file", fileName);
				}
			} else {
				await Store.mount();
				const {result: compiled, dependents} = await rebuildFile(fileName);
				await zeroFS.writeFile(`${prefix}__build/${fileName}`, compiled);

				for(const dependentName of Object.keys(dependents)) {
					if(!newDependents[dependentName]) {
						newDependents[dependentName] = [];
					}
					newDependents[dependentName] = newDependents[dependentName].concat(dependents[dependentName]);
				}
			}
		}

		const newManifest = Object.assign({}, JSON.parse(await zeroFS.readFile(`${prefix}${manifestName}`)), {
			_hashes: newHashes,
			_dependents: Object.assign({}, manifest._dependents, newDependents)
		});
		await zeroFS.writeFile(`${prefix}__build/${manifestName}`, JSON.stringify(newManifest, null, "\t"));
	}
}
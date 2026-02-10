import sharp from 'sharp';
import { readdir, writeFile, access, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const STATIC_DIR = 'static';
const OUTPUT_MAP = 'src/lib/generated/image-map.json';
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	const files = await readdir(STATIC_DIR);
	const images = files.filter((f) => IMAGE_EXTENSIONS.includes(parse(f).ext.toLowerCase()));

	if (images.length === 0) {
		console.log('No images found in static/');
		return;
	}

	const map: Record<string, { webp: string; placeholder: string }> = {};

	for (const file of images) {
		const { name } = parse(file);
		const srcPath = join(STATIC_DIR, file);
		const webpPath = join(STATIC_DIR, `${name}.webp`);

		// Convert to WebP if not already exists
		if (!(await fileExists(webpPath))) {
			await sharp(srcPath).webp({ quality: 80 }).toFile(webpPath);
			console.log(`Created ${webpPath}`);
		} else {
			console.log(`Skipped ${webpPath} (already exists)`);
		}

		// Generate base64 placeholder
		const placeholderBuffer = await sharp(srcPath)
			.resize(64, 64, { fit: 'cover' })
			.webp({ quality: 20 })
			.toBuffer();
		const placeholder = `data:image/webp;base64,${placeholderBuffer.toString('base64')}`;

		map[`/${file}`] = {
			webp: `/${name}.webp`,
			placeholder
		};
	}

	// Ensure output directory exists
	await mkdir('src/lib/generated', { recursive: true });
	await writeFile(OUTPUT_MAP, JSON.stringify(map, null, '\t') + '\n');
	console.log(`Wrote ${OUTPUT_MAP} with ${Object.keys(map).length} entries`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

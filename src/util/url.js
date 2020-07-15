export function getRelativeURL(url, base) {
	const urlObj = new URL(url, base);

	return urlObj.href.replace(urlObj.origin, '');
}

export function getFullURL(url, fallback) {
	let urlObj;

	try {
		urlObj = new URL(url);
	} catch (error) {
		urlObj = new URL(url, fallback);
	}

	return urlObj.href;
}

export function getRelativeURL(url, base) {
	const urlObj = new URL(url, base);

	return urlObj.href.replace(urlObj.origin, '');
}

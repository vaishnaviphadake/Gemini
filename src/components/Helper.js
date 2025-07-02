export function checkHeading(str) {
	return /^\*{2}.*\*$/.test(str);
}

export function replaceHeading(str) {
	return str
		.replace(/^\*{2}/, "")
		.replace(/\*$/, "")
		.trim();
}

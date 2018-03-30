export function stringify(token: any): string
{
	if (typeof token === 'string') {
		return token;
	}

	if (token == null) {
		return '' + token;
	}

	if (token.name) {
		return `${token.name}`;
	}

	let s = token.toString();
	let newLinePos = s.indexOf('\n');

	return newLinePos === -1 ? s : s.substring(0, newLinePos);
}

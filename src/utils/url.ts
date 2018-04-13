export function createUrl(url: string, parameters: {[name: string]: string} = {}): string
{
	let params: Array<string> = [];

	for (let name in parameters) {
		if (parameters.hasOwnProperty(name)) {
			params.push(`${name}=${parameters[name]}`);
		}
	}

	if (params.length) {
		const join = url.indexOf('?') >= 0 ? '&' : '?';
		url += `${join}${params.join('&')}`;
	}

	return url;
}

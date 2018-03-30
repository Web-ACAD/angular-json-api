// from typescript
export function extend(child: any, parent: any): any
{
	let extendStatics =
		(<any>Object).setPrototypeOf ||
		({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
		function (d, b) { for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

	extendStatics(child, parent);
	function __() { this.constructor = child; }
	child.prototype = parent === null ? Object.create(parent) : (__.prototype = parent.prototype, new __());
}

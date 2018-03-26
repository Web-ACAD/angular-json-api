export declare interface JsonApiRelationship
{
	data?: null|JsonApiResourceIdentifier|Array<JsonApiResourceIdentifier>,
}


export declare interface JsonApiResourceIdentifier
{
	type: string,
	id: number|string,
}


export declare interface JsonApiResource extends JsonApiResourceIdentifier
{
	attributes: {[name: string]: any},
	relationships: {[name: string]: JsonApiRelationship},
}


export declare interface JsonApiData
{
	data?: null|JsonApiResourceIdentifier|JsonApiResource|Array<JsonApiResourceIdentifier>|Array<JsonApiResource>,
	included?: Array<JsonApiResource>,
}

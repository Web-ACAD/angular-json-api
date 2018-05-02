import {EntityMetadata, EntityType, JsonApiEntityMetadataLoader} from '../entity/index';


export declare interface ColumnTypesList
{
	[name: string]: (data: any) => any,
}


export class JsonApiConfiguration
{


	private mappings: {[type: string]: EntityMetadata<any>} = {};


	constructor(
		private $metadataLoader: JsonApiEntityMetadataLoader,
		private url: string,
		private columnTypes: ColumnTypesList,
		entityTypes: Array<EntityType<any>>,
	) {
		for (let entityType of entityTypes) {
			this.registerEntity(entityType);
		}
	}


	public getUrl(): string
	{
		return this.url;
	}


	public getMapping(type: string): EntityMetadata<any>
	{
		if (typeof this.mappings[type] === 'undefined') {
			throw new Error(`ApiConfiguration: mapping ${type} does not exists.`);
		}

		return this.mappings[type];
	}


	public getColumnType(type: string): (data: any) => any
	{
		if (typeof this.columnTypes[type] === 'undefined') {
			throw new Error(`ApiConfiguration: column type ${type} does not exists.`);
		}

		return this.columnTypes[type];
	}


	private registerEntity(entityType: EntityType<any>): void
	{
		const metadata = this.$metadataLoader.getMetadata(entityType);
		this.mappings[metadata.type] = metadata;
	}

}

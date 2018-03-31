import {JsonApiConfiguration, JsonApiEntityMetadataLoader, EntityType} from '../../src';


export class MockJsonApiConfiguration extends JsonApiConfiguration
{


	constructor(
		metadataLoader: JsonApiEntityMetadataLoader,
		private entityTypes: Array<EntityType<any>> = [],
	) {
		super(metadataLoader);
	}


	protected configure(): void
	{
		this.setUrl('localhost');

		for (let entityType of this.entityTypes) {
			this.registerEntity(entityType);
		}
	}

}

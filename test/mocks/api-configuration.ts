import {ApiConfigurator, ApiEntityMetadataLoader, EntityType} from '../../src';


export class MockApiConfiguration extends ApiConfigurator
{


	constructor(
		metadataLoader: ApiEntityMetadataLoader,
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

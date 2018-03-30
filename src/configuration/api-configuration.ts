import {ApiEntityMetadata, EntityType, ApiEntityMetadataLoader} from '../entity';


export abstract class ApiConfigurator
{


	private initialized: boolean = false;

	private url: string;

	private mappings: {[type: string]: ApiEntityMetadata<any>} = {};


	constructor(
		private $metadataLoader: ApiEntityMetadataLoader,
	) {}


	public initialize(): void
	{
		if (this.initialized) {
			return;
		}

		this.configure();

		if (!this.url) {
			throw new Error(`ApiConfiguration: please, set url.`);
		}

		this.initialized = true;
	}


	public getUrl(): string
	{
		return this.url;
	}


	public setUrl(url: string): void
	{
		this.check();
		this.url = url;
	}


	public registerEntity(entityType: EntityType<any>): void
	{
		this.check();
		const metadata = this.$metadataLoader.getMetadata(entityType);
		this.mappings[metadata.type] = metadata;
	}


	public getMapping(type: string): ApiEntityMetadata<any>
	{
		if (typeof this.mappings[type] === 'undefined') {
			throw new Error(`ApiConfiguration: mapping ${type} does not exists.`);
		}

		return this.mappings[type];
	}


	protected abstract configure(): void;


	private check(): void
	{
		if (this.initialized) {
			throw new Error('ApiConfiguration: can not change configuration after it was initialized.');
		}
	}

}

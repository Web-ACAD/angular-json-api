import {NgModule, ModuleWithProviders, InjectionToken} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {JsonApiNormalizer} from './normalizer/index';
import {JsonApiClient} from './client/index';
import {JsonApiConfiguration} from './configuration/index';
import {JsonApiEntityMetadataLoader, EntityType} from './entity/index';
import {JsonApiMapper} from './mapping/index';


export declare interface JsonApiModuleConfiguration
{
	url: string|(() => string),
	entities: Array<EntityType<any>>,
}


export const JSON_API_MODULE_CONFIGURATION = new InjectionToken<JsonApiModuleConfiguration>('JSON_API_MODULE_CONFIGURATION');


export function provideJsonApiConfiguration(
	$metadataLoader: JsonApiEntityMetadataLoader,
	$config: JsonApiModuleConfiguration,
): JsonApiConfiguration {
	const url: string = typeof $config.url === 'string' ? $config.url : $config.url();
	return new JsonApiConfiguration($metadataLoader, url, $config.entities);
}


@NgModule({
	imports: [
		HttpClientModule,
	],
})
export class JsonApiModule
{


	public static forRoot(config: JsonApiModuleConfiguration): ModuleWithProviders
	{
		return {
			ngModule: JsonApiModule,
			providers: [
				JsonApiNormalizer,
				JsonApiClient,
				JsonApiEntityMetadataLoader,
				JsonApiMapper,
				{
					provide: JSON_API_MODULE_CONFIGURATION,
					useValue: config,
				},
				{
					provide: JsonApiConfiguration,
					useFactory: provideJsonApiConfiguration,
					deps: [
						JsonApiEntityMetadataLoader,
						JSON_API_MODULE_CONFIGURATION,
					],
				},
			],
		};
	}

}

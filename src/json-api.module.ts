import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {JsonApiNormalizer} from './normalizer/index';
import {JsonApiClient} from './client/index';
import {JsonApiEntityMetadataLoader} from './entity/index';
import {
	JsonApiConfiguration, JsonApiRootModuleConfiguration, JSON_API_ROOT_MODULE_CONFIGURATION,
	provideJsonApiRootConfiguration, JsonApiChildModuleConfiguration, JSON_API_CHILD_MODULE_CONFIGURATION,
} from './configuration/index';


@NgModule({
	imports: [
		HttpClientModule,
	],
})
export class JsonApiModule
{


	public static forRoot(config: JsonApiRootModuleConfiguration): ModuleWithProviders
	{
		return {
			ngModule: JsonApiModule,
			providers: [
				JsonApiNormalizer,
				JsonApiClient,
				JsonApiEntityMetadataLoader,
				{
					provide: JSON_API_ROOT_MODULE_CONFIGURATION,
					useValue: config,
				},
				{
					provide: JSON_API_CHILD_MODULE_CONFIGURATION,
					useValue: {},
					multi: true,
				},
				{
					provide: JsonApiConfiguration,
					useFactory: provideJsonApiRootConfiguration,
					deps: [
						JsonApiEntityMetadataLoader,
						JSON_API_ROOT_MODULE_CONFIGURATION,
						JSON_API_CHILD_MODULE_CONFIGURATION,
					],
				},
			],
		};
	}


	public static forChild(config: JsonApiChildModuleConfiguration): ModuleWithProviders
	{
		return {
			ngModule: JsonApiModule,
			providers: [
				{
					provide: JSON_API_CHILD_MODULE_CONFIGURATION,
					useValue: config,
					multi: true,
				},
			],
		};
	}

}

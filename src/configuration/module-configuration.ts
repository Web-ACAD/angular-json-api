import {InjectionToken} from '@angular/core';

import {JsonApiConfiguration, ColumnTypesList} from './configuration.service';
import {JsonApiEntityMetadataLoader, EntityType} from '../entity/index';


export declare interface JsonApiRootModuleConfiguration
{
	url: string|(() => string),
	entities?: Array<EntityType<any>>,
	types?: ColumnTypesList,
}


export declare interface JsonApiChildModuleConfiguration
{
	entities?: Array<EntityType<any>>,
}


export const JSON_API_ROOT_MODULE_CONFIGURATION = new InjectionToken<JsonApiRootModuleConfiguration>('JSON_API_ROOT_MODULE_CONFIGURATION');
export const JSON_API_CHILD_MODULE_CONFIGURATION = new InjectionToken<JsonApiChildModuleConfiguration>('JSON_API_CHILD_MODULE_CONFIGURATION');


export function provideJsonApiRootConfiguration(
	$metadataLoader: JsonApiEntityMetadataLoader,
	$config: JsonApiRootModuleConfiguration,
	$childConfigurations: Array<JsonApiChildModuleConfiguration>,
): JsonApiConfiguration {
	const url: string = typeof $config.url === 'string' ? $config.url : $config.url();
	let entityTypes: Array<EntityType<any>> = $config.entities || [];

	for (let childConfiguration of $childConfigurations) {
		entityTypes = entityTypes.concat(childConfiguration.entities || []);
	}

	return new JsonApiConfiguration($metadataLoader, url, $config.types, entityTypes);
}

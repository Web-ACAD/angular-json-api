import {Injectable} from '@angular/core';

import {stringify} from '../utils/index';


export const EntityType = Function;


export interface EntityType<T> extends Function
{


	new (...args: Array<any>): T;

}


export const JSON_API_ENTITY_METADATA = '__wa_json_api_entity_metadata__';


export declare interface JsonApiEntityMetadata<T>
{
	entityType: EntityType<T>,
	type: string,
	id: string,
	columns: {[name: string]: string},
	relationships: {[name: string]: string},
}


@Injectable()
export class JsonApiEntityMetadataLoader
{


	public getMetadata<T>(entityType: EntityType<T>): JsonApiEntityMetadata<T>
	{
		if (!entityType[JSON_API_ENTITY_METADATA]) {
			throw new Error(`JsonApi: missing @Entity() decorator on ${stringify(entityType)} class.`);
		}

		const metadata: JsonApiEntityMetadata<T> = entityType[JSON_API_ENTITY_METADATA];

		if (!metadata.id) {
			throw new Error(`JsonApi: missing @Id() decorator on ${stringify(entityType)} class.`);
		}

		return metadata;
	}

}

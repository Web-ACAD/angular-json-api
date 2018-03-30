import {Injectable} from '@angular/core';

import {stringify} from '../utils/index';


export const EntityType = Function;


export interface EntityType<T> extends Function
{


	new (...args: Array<any>): T;

}


export const API_ENTITY_METADATA = '__wa_entity_metadata__';


export declare interface ApiEntityMetadata<T>
{
	entityType: EntityType<T>,
	type: string,
	id: string,
	columns: {[name: string]: string},
	relationships: {[name: string]: string},
}


@Injectable()
export class ApiEntityMetadataLoader
{


	public getMetadata<T>(entityType: EntityType<T>): ApiEntityMetadata<T>
	{
		if (!entityType[API_ENTITY_METADATA]) {
			throw new Error(`Api: missing @Entity() decorator on ${stringify(entityType)} class.`);
		}

		const metadata: ApiEntityMetadata<T> = entityType[API_ENTITY_METADATA];

		if (!metadata.id) {
			throw new Error(`Api: missing @Id() decorator on ${stringify(entityType)} class.`);
		}

		return metadata;
	}

}

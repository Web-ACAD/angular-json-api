import {Injectable} from '@angular/core';

import {stringify} from '../utils/index';


export const EntityType = Function;


export interface EntityType<T> extends Function
{


	new (...args: Array<any>): T;

}


export const JSON_API_ENTITY_METADATA = '__wa_json_api_entity_metadata__';


export declare type ColumnTransformer = (data: any) => any;


export declare interface ColumnMetadata
{
	name: string,
	property: string,
	type: string|null,
	transformers: Array<ColumnTransformer>,
}


export declare interface RelationshipMetadata
{
	name: string,
	property: string,
}


export declare interface EntityMetadata<T>
{
	entityType: EntityType<T>,
	type: string,
	id: string,
	columns: {[name: string]: ColumnMetadata},
	relationships: {[name: string]: RelationshipMetadata},
	optional: Array<string>,
}


@Injectable()
export class JsonApiEntityMetadataLoader
{


	public getMetadata<T>(entityType: EntityType<T>): EntityMetadata<T>
	{
		if (!entityType[JSON_API_ENTITY_METADATA]) {
			throw new Error(`JsonApi: missing @Entity() decorator on ${stringify(entityType)} class.`);
		}

		const metadata: EntityMetadata<T> = entityType[JSON_API_ENTITY_METADATA];

		if (!metadata.id) {
			throw new Error(`JsonApi: missing @Id() decorator on ${stringify(entityType)} class.`);
		}

		return metadata;
	}

}

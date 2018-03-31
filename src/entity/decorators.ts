import {EntityType, JSON_API_ENTITY_METADATA} from './entity-metadata-loader.service';


export declare interface EntityOptions
{
	type: string,
}


export function Entity(options: EntityOptions): any
{
	return function(target: EntityType<any>): void
	{
		initEntityMetadata(target);
		target[JSON_API_ENTITY_METADATA].type = options.type;
	};
}


export function Id(): any
{
	return function(target: any, prop: string): void
	{
		initEntityMetadata(target.constructor);
		target.constructor[JSON_API_ENTITY_METADATA].id = prop;
	};
}


export function Column(columnName?: string): any
{
	return function(target: any, prop: string): void
	{
		initEntityMetadata(target.constructor);
		target.constructor[JSON_API_ENTITY_METADATA].columns[columnName || prop] = prop;
	};
}


export function Relationship(include?: string): any
{
	return function(target: any, prop: string): void
	{
		initEntityMetadata(target.constructor);
		target.constructor[JSON_API_ENTITY_METADATA].relationships[include || prop] = prop;
	};
}


function initEntityMetadata(entityType: EntityType<any>): void
{
	if (typeof entityType[JSON_API_ENTITY_METADATA] === 'undefined') {
		entityType[JSON_API_ENTITY_METADATA] = {
			entityType: entityType,
			type: undefined,
			id: undefined,
			columns: {},
			relationships: {},
		};
	}
}

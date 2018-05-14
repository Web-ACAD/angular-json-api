import {
	EntityType, JSON_API_ENTITY_METADATA, ColumnMetadata, RelationshipMetadata, ColumnTransformer,
} from './entity-metadata-loader.service';


export declare interface EntityOptions
{
	type: string,
}


export declare interface ColumnOptions
{
	name?: string,
	type?: string,
	transformers?: Array<ColumnTransformer>,
}


export declare interface RelationshipOptions
{
	name?: string,
}


export function Entity(options: EntityOptions): any
{
	return function(target: EntityType<any>): void
	{
		setEntityType(target, options.type);
	};
}


export function Id(): any
{
	return function(target: any, prop: string): void
	{
		setIdProperty(target, prop);
	};
}


export function Optional(): any
{
	return function(target: any, prop: string): void
	{
		addOptional(target, prop);
	};
}


export function Column(options: ColumnOptions = {}): any
{
	return function(target: any, prop: string): void
	{
		addColumn(target, {
			name: options.name || prop,
			property: prop,
			type: options.type || null,
			transformers: options.transformers || [],
		});
	};
}


export function Relationship(options: RelationshipOptions = {}): any
{
	return function(target: any, prop: string): void
	{
		addRelationship(target, {
			name: options.name || prop,
			property: prop,
		});
	};
}


function setEntityType(target: EntityType<any>, type: string): void
{
	initEntityMetadata(target);
	target[JSON_API_ENTITY_METADATA].type = type;
}


function setIdProperty(target: any, property: string): void
{
	initEntityMetadata(target.constructor);
	target.constructor[JSON_API_ENTITY_METADATA].id = property;
}


function addOptional(target: any, property: string): void
{
	initEntityMetadata(target.constructor);
	target.constructor[JSON_API_ENTITY_METADATA].optional.push(property);
}


function addColumn(target: any, metadata: ColumnMetadata): void
{
	initEntityMetadata(target.constructor);
	target.constructor[JSON_API_ENTITY_METADATA].columns[metadata.name] = metadata;
}


function addRelationship(target: any, metadata: RelationshipMetadata): void
{
	initEntityMetadata(target.constructor);
	target.constructor[JSON_API_ENTITY_METADATA].relationships[metadata.name] = metadata;
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
			optional: [],
		};
	}
}

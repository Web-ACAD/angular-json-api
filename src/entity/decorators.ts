import {
	EntityType, EntityMetadata, ColumnMetadata, RelationshipMetadata, ColumnTransformer, JSON_API_ENTITY_METADATA as _EM,
} from './entity-metadata-loader.service';
import {Mapper} from '../mapping/index';


export declare interface EntityOptions
{
	type: string,
	mapper?: Mapper,
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
		const metadata = getEntityMetadata(target);

		metadata.type = options.type;

		if (typeof options.mapper !== 'undefined') {
			metadata.mapper = options.mapper;
		}
	};
}


export function Id(): any
{
	return function(target: any, prop: string): void
	{
		const metadata = getEntityMetadata(target.constructor);
		metadata.id = prop;
	};
}


export function Optional(): any
{
	return function(target: any, prop: string): void
	{
		const metadata = getEntityMetadata(target.constructor);
		metadata.optional.push(prop);
	};
}


export function Column(options: ColumnOptions = {}): any
{
	return function(target: any, prop: string): void
	{
		const metadata = getEntityMetadata(target.constructor);
		const column: ColumnMetadata = {
			name: options.name || prop,
			property: prop,
			type: options.type || null,
			transformers: options.transformers || [],
		};

		metadata.columns[column.name] = column;
	};
}


export function Relationship(options: RelationshipOptions = {}): any
{
	return function(target: any, prop: string): void
	{
		const metadata = getEntityMetadata(target.constructor);
		const relationship: RelationshipMetadata = {
			name: options.name || prop,
			property: prop,
		};

		metadata.relationships[relationship.name] = relationship;
	};
}


function getEntityMetadata<T>(entityType: EntityType<T>): EntityMetadata<T>
{
	const previousExist = typeof entityType[_EM] !== 'undefined';

	if (!previousExist) {
		entityType[_EM] = {
			entityType: entityType,
			type: undefined,
			id: undefined,
			columns: {},
			relationships: {},
			optional: [],
		};

	} else if (previousExist && entityType[_EM].entityType !== entityType) {
		entityType[_EM] = {
			entityType: entityType,
			type: entityType[_EM].type,
			id: entityType[_EM].id,
			columns: {...entityType[_EM].columns},
			relationships: {...entityType[_EM].relationships},
			optional: [...entityType[_EM].optional],
		};
	}

	return entityType[_EM];
}

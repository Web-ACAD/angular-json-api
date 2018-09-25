import {stringify} from '../utils/index';
import {JsonApiNormalizedResource} from '../normalizer/index';
import {JsonApiConfiguration} from '../configuration/index';
import {EntityMetadata, ColumnMetadata} from '../entity/index';
import {createProxy} from './proxy-factory';


export declare type Mapper = <T>(metadata: EntityMetadata<T>, data: JsonApiNormalizedResource, config: JsonApiConfiguration) => T|any;


export function mapItem<T>(config: JsonApiConfiguration, data: JsonApiNormalizedResource): T
{
	const mapping = config.getMapping(data.type);
	const mapper = mapping.mapper || defaultMapper;

	return mapper(mapping, data, config);
}


export function mapCollection<T>(config: JsonApiConfiguration, data: Array<JsonApiNormalizedResource>): Array<T>
{
	const result: Array<T> = [];

	for (let item of data) {
		result.push(mapItem(config, item));
	}

	return result;
}


export function mapData<T>(config: JsonApiConfiguration, data: JsonApiNormalizedResource|Array<JsonApiNormalizedResource>): T|Array<T>
{
	if (Array.isArray(data)) {
		return mapCollection(config, data);
	}

	return mapItem(config, data);
}


export function defaultMapper<T>(mapping: EntityMetadata<T>, data: JsonApiNormalizedResource, config: JsonApiConfiguration): T
{
	const entity = createProxy<T>(mapping.entityType);

	entity[mapping.id] = data.id;

	for (let key in mapping.columns) {
		if (mapping.columns.hasOwnProperty(key)) {
			const column: ColumnMetadata = mapping.columns[key];

			if (typeof data.data[column.name] === 'undefined') {
				if (mapping.optional.indexOf(column.property) >= 0) {
					continue;
				}

				throw new Error(`Api: missing ${column.name} in loaded data for ${stringify(mapping.entityType)} entity.`);
			}

			let columnValue = data.data[column.name];

			if (column.type !== null) {
				columnValue = config.getColumnType(column.type)(columnValue);
			}

			for (let transformer of column.transformers) {
				columnValue = transformer(columnValue);
			}

			entity[column.property] = columnValue;
		}
	}

	for (let key in mapping.relationships) {
		if (mapping.relationships.hasOwnProperty(key)) {
			entity[mapping.relationships[key].property] = typeof data.relationships[key] === 'undefined' || data.relationships[key] === null ?
				undefined :
				mapData(config, data.relationships[key])
			;
		}
	}

	return entity;
}

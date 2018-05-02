import {Injectable} from '@angular/core';

import {stringify, extend} from '../utils/index';
import {JsonApiNormalizedResource} from '../normalizer/index';
import {JsonApiConfiguration} from '../configuration/index';
import {EntityType} from '../entity/index';


@Injectable()
export class JsonApiMapper
{


	constructor(
		private $config: JsonApiConfiguration,
	) {}


	public map<T>(data: JsonApiNormalizedResource|Array<JsonApiNormalizedResource>): T|Array<T>
	{
		if (Array.isArray(data)) {
			return this.mapCollection(data);
		} else {
			return this.mapItem(data);
		}
	}


	public mapItem<T>(data: JsonApiNormalizedResource): T
	{
		const mapping = this.$config.getMapping(data.type);
		const entity = this.createProxy<T>(mapping.entityType);

		entity[mapping.id] = data.id;

		for (let key in mapping.columns) {
			if (mapping.columns.hasOwnProperty(key)) {
				if (typeof data.data[key] === 'undefined') {
					throw new Error(`Api: missing ${key} in loaded data for ${stringify(mapping.entityType)} entity.`);
				}

				entity[mapping.columns[key].property] = data.data[key];
			}
		}

		for (let key in mapping.relationships) {
			if (mapping.relationships.hasOwnProperty(key)) {
				entity[mapping.relationships[key].property] = typeof data.relationships[key] === 'undefined' ?
					undefined :
					this.map(data.relationships[key])
				;
			}
		}

		return entity;
	}


	public mapCollection<T>(data: Array<JsonApiNormalizedResource>): Array<T>
	{
		const result: Array<T> = [];

		for (let item of data) {
			result.push(this.mapItem(item));
		}

		return result;
	}


	private createProxy<T>(entityType: EntityType<T>): T
	{
		class ProxyEntity
		{

			constructor() {}

		}

		extend(ProxyEntity, entityType);

		return <T>(new ProxyEntity);
	}

}

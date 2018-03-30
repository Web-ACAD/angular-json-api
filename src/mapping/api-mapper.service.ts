import {Injectable} from '@angular/core';

import {stringify, extend} from '../utils/index';
import {TransformedResource} from '../normalizer/index';
import {ApiConfigurator} from '../configuration/index';
import {EntityType} from '../entity/index';


@Injectable()
export class ApiMapper
{


	constructor(
		private $config: ApiConfigurator,
	) {
		this.$config.initialize();
	}


	public map<T>(data: TransformedResource|Array<TransformedResource>): T|Array<T>
	{
		if (Array.isArray(data)) {
			return this.mapCollection(data);
		} else {
			return this.mapItem(data);
		}
	}


	public mapItem<T>(data: TransformedResource): T
	{
		const mapping = this.$config.getMapping(data.type);
		const entity = this.createProxy(mapping.entityType);

		entity[mapping.id] = data.id;

		for (let key in mapping.columns) {
			if (mapping.columns.hasOwnProperty(key)) {
				if (typeof data.data[key] === 'undefined') {
					throw new Error(`Api: missing ${key} in loaded data for ${stringify(mapping.entityType)} entity.`);
				}

				entity[mapping.columns[key]] = data.data[key];
			}
		}

		for (let key in mapping.relationships) {
			if (mapping.relationships.hasOwnProperty(key)) {
				entity[mapping.relationships[key]] = typeof data.relationships[key] === 'undefined' ?
					undefined :
					this.map(data.relationships[key])
				;
			}
		}

		return entity;
	}


	public mapCollection<T>(data: Array<TransformedResource>): Array<T>
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

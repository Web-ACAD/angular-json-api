import {Injectable} from '@angular/core';
import {JsonApiData, JsonApiResource, JsonApiResourceIdentifier} from '../json-api-schema';


export declare interface TransformedResource
{
	type: string,
	id: number|string,
	data: {[name: string]: any},
	relationships: {[name: string]: null|TransformedResource|Array<TransformedResource>},
}


@Injectable()
export class WaJsonApiNormalizer
{


	public normalize(data: JsonApiData): TransformedResource|Array<TransformedResource>
	{
		if (Array.isArray(data.data)) {
			return this.normalizeCollection(data);
		} else {
			return this.normalizeItem(data);
		}
	}


	public normalizeItem(data: JsonApiData): TransformedResource
	{
		const resourceData = <JsonApiResource>data.data;
		const resource = this.normalizeResource(resourceData, data.included || []);

		return resource;
	}


	public normalizeCollection(data: JsonApiData): Array<TransformedResource>
	{
		const list = <Array<JsonApiResource>>data.data;
		const resources: Array<TransformedResource> = [];

		for (let i = 0; i < list.length; i++) {
			resources.push(this.normalizeResource(list[i], data.included || []));
		}

		return resources;
	}


	private normalizeResource(data: JsonApiResource, included: Array<JsonApiResource>): TransformedResource
	{
		const resource: TransformedResource = {
			type: data.type,
			id: data.id,
			data: {},
			relationships: {},
		};

		for (let attrName in data.attributes) {
			if (data.attributes.hasOwnProperty(attrName)) {
				resource.data[attrName] = data.attributes[attrName];
			}
		}

		for (let relationName in data.relationships) {
			if (data.relationships.hasOwnProperty(relationName)) {
				let relation = data.relationships[relationName];

				if (!relation.data) {
					resource.relationships[relationName] = null;

				} else if (Array.isArray(relation.data)) {
					resource.relationships[relationName] = relation.data.map((singleRelation) => {
						return this.findRelationship(singleRelation, included);
					});

				} else {
					resource.relationships[relationName] = this.findRelationship(relation.data, included);
				}
			}
		}

		return resource;
	}


	private findRelationship(relationship: JsonApiResourceIdentifier, included: Array<JsonApiResource>): TransformedResource
	{
		for (let i = 0; i < included.length; i++) {
			if (included[i].type === relationship.type && included[i].id === relationship.id) {
				return this.normalizeResource(included[i], included);
			}
		}

		throw new Error(`Missing relationship ${relationship.type}:${relationship.id}`);
	}

}

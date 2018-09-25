import {EntityType} from '../entity/index';
import {extend} from '../utils';


export function createProxy<T>(entityType: EntityType<T>): T
{
	class ProxyEntity
	{

		constructor() {}

	}

	extend(ProxyEntity, entityType);

	return <T>(new ProxyEntity);
}

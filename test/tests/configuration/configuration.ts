import '../../bootstrap';

import {JsonApiConfiguration, JsonApiEntityMetadataLoader, EntityType, Entity, Id} from '../../../src';
import {expect} from 'chai';


function createConfig(url: string = 'localhost', entityTypes: Array<EntityType<any>> = []): JsonApiConfiguration
{
	const loader = new JsonApiEntityMetadataLoader;
	return new JsonApiConfiguration(loader, url, entityTypes);
}


describe('#Configuration/JsonApiConfiguration', () => {

	describe('getUrl()', () => {

		it('should return configured url', () => {
			expect(createConfig('localhost').getUrl()).to.be.equal('localhost');
		});

	});

	describe('registerEntity()', () => {

		it('should register and load metadata of a new entity', () => {
			@Entity({
				type: 'user',
			})
			class User
			{

				@Id()
				public id: number;

			}

			const config = createConfig(undefined, [
				User,
			]);

			expect(config.getMapping('user')).to.be.eql({
				entityType: User,
				type: 'user',
				id: 'id',
				columns: {},
				relationships: {},
			});
		});

	});

});

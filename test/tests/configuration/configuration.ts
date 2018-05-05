import '../../bootstrap';

import {JsonApiConfiguration, JsonApiEntityMetadataLoader, EntityType, Entity, Id} from '../../../src';
import {expect} from 'chai';


function createConfig(url: string = 'localhost', columnTypes: any = {}, entityTypes: Array<EntityType<any>> = []): JsonApiConfiguration
{
	const loader = new JsonApiEntityMetadataLoader;
	return new JsonApiConfiguration(loader, url, columnTypes, entityTypes);
}


describe('#Configuration/JsonApiConfiguration', () => {

	describe('getUrl()', () => {

		it('should return configured url', () => {
			expect(createConfig('localhost').getUrl()).to.be.equal('localhost');
		});

	});

	describe('getColumnType()', () => {

		it('should throw an error if type is not defined', () => {
			expect(() => {
				createConfig().getColumnType('date');
			}).to.throw(Error, 'ApiConfiguration: column type date does not exists.');
		});

		it('should return registered type', () => {
			function testType(data: any): any
			{
				return data;
			}

			const config = createConfig(undefined, {
				test: testType,
			});

			expect(config.getColumnType('test')).to.be.equal(testType);
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

			const config = createConfig(undefined, {}, [
				User,
			]);

			expect(config.getMapping('user')).to.be.eql({
				entityType: User,
				type: 'user',
				id: 'id',
				columns: {},
				relationships: {},
				optional: [],
			});
		});

	});

});

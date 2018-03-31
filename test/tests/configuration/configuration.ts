import '../../bootstrap';

import {JsonApiConfiguration, JsonApiEntityMetadataLoader, Entity, Id} from '../../../src';
import {MockJsonApiConfiguration} from '../../mocks';
import {expect} from 'chai';


let loader: JsonApiEntityMetadataLoader;
let config: MockJsonApiConfiguration;


describe('#Configuration/JsonApiConfiguration', () => {

	beforeEach(() => {
		loader = new JsonApiEntityMetadataLoader;
		config = new MockJsonApiConfiguration(loader);
	});

	describe('initialize()', () => {

		it('should throw an error if url is not configured', () => {
			class Config extends JsonApiConfiguration
			{

				protected configure(): void {}

			}

			const conf = new Config(loader);

			expect(() => {
				conf.initialize();
			}).to.throw(Error, 'ApiConfiguration: please, set url.');
		});

		it('should throw an error if configuration is modified after initialization', () => {
			config.initialize();

			expect(() => {
				config.setUrl('localhost');
			}).to.throw(Error, 'ApiConfiguration: can not change configuration after it was initialized.');
		});

	});

	describe('getUrl()', () => {

		it('should return configured url', () => {
			expect(config.getUrl()).to.be.equal(undefined);
			config.setUrl('localhost');
			expect(config.getUrl()).to.be.equal('localhost');
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

			config.registerEntity(User);

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

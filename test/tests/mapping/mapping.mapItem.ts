import '../../bootstrap';

import {Entity, Id, Column, JsonApiConfiguration, JsonApiEntityMetadataLoader, EntityType, mapItem} from '../../../src';
import {expect} from 'chai';


function createConfig(entityTypes: Array<EntityType<any>> = [], columnTypes: any = {}): JsonApiConfiguration
{
	const loader = new JsonApiEntityMetadataLoader;
	return new JsonApiConfiguration(loader, 'localhost', columnTypes, entityTypes);
}


describe('#Mapping/mapping.mapItem', () => {

	it('should use default mapper', () => {
		@Entity({
			type: 'user',
		})
		class User
		{

			@Id()
			public id: number;

			@Column()
			public name: string;

		}

		const user = mapItem<User>(createConfig([
			User,
		]), {
			type: 'user',
			id: 5,
			data: {
				name: 'John Doe',
			},
			relationships: {},
		});

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.name).to.be.equal('John Doe');
	});

	it('should use custom mapper', () => {
		const data = {
			type: 'user',
			id: 5,
			data: {
				name: 'John Doe',
			},
			relationships: {},
		};

		@Entity({
			type: 'user',
			mapper: (metadata, mapData, config) => {
				expect(mapData).to.be.equal(data);
				expect(config).to.be.an.instanceOf(JsonApiConfiguration);

				return new User(10, 'Claire');
			},
		})
		class User
		{

			@Id()
			public id: number;

			@Column()
			public name: string;

			constructor(id: number, name: string)
			{
				this.id = id;
				this.name = name;
			}

		}

		const user = mapItem<User>(createConfig([
			User,
		]), data);

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(10);
		expect(user.name).to.be.equal('Claire');
	});

});

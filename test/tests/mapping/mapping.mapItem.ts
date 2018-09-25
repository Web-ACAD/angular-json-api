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

});

import '../../bootstrap';

import {Entity, Id, Column, Relationship, JsonApiConfiguration, JsonApiEntityMetadataLoader, JsonApiMapper, EntityType} from '../../../src';
import {expect} from 'chai';


function createMapper(entityTypes: Array<EntityType<any>> = []): JsonApiMapper
{
	const loader = new JsonApiEntityMetadataLoader;
	const config = new JsonApiConfiguration(loader, 'localhost', entityTypes);

	return new JsonApiMapper(config);
}


describe('#Mapping/JsonApiMapper', () => {

	describe('mapItem<User>()', () => {

		it('should throw an error if base data is missing', () => {
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

			const mapper = createMapper([
				User,
			]);

			expect(() => {
				mapper.mapItem<User>({
					type: 'user',
					id: 5,
					data: {},
					relationships: {},
				});
			}).to.throw(Error, 'Api: missing name in loaded data for User entity.');
		});

		it('should not call the entity\'s constructor', () => {
			let called: boolean = false;

			@Entity({
				type: 'user',
			})
			class User
			{

				@Id()
				public id: number;

				constructor()
				{
					called = true;
				}

			}

			const mapper = createMapper([
				User,
			]);

			const user = mapper.mapItem<User>({
				type: 'user',
				id: 5,
				data: {},
				relationships: {},
			});

			expect(called).to.be.equal(false);
			expect(user).to.be.an.instanceOf(User);
		});

		it('should create different proxy classes for each instance', () => {
			@Entity({
				type: 'user',
			})
			class User
			{

				@Id()
				public id: number;

			}

			const mapper = createMapper([
				User,
			]);

			const user1 = mapper.mapItem<User>({
				type: 'user',
				id: 1,
				data: {},
				relationships: {},
			});

			const user2 = mapper.mapItem<User>({
				type: 'user',
				id: 2,
				data: {},
				relationships: {},
			});

			expect(user1).to.be.an.instanceOf(User);
			expect(user2).to.be.an.instanceOf(User);
			expect(user1['__proto__']).to.not.be.equal(user2['__proto__']);
		});

		it('should map simple data to entity', () => {
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

			const mapper = createMapper([
				User,
			]);

			const user = mapper.mapItem<User>({
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

		it('should map simple data to entity through setter', () => {
			@Entity({
				type: 'user',
			})
			class User
			{

				@Id()
				public id: number;

				private _name: string;

				@Column()
				get name(): string
				{
					return this._name;
				}

				set name(name: string)
				{
					this._name = name.split('').reverse().join('');
				}

			}

			const mapper = createMapper([
				User,
			]);

			const user = mapper.mapItem<User>({
				type: 'user',
				id: 5,
				data: {
					name: 'John Doe',
				},
				relationships: {},
			});

			expect(user).to.be.an.instanceOf(User);
			expect(user.id).to.be.equal(5);
			expect(user.name).to.be.equal('eoD nhoJ');
		});

		it('should map item to entity', () => {
			@Entity({
				type: 'role',
			})
			class Role
			{

				@Id()
				public id: number;

			}

			@Entity({type: 'user'})
			class User
			{

				@Id()
				public id: number;

				@Relationship({
					name: 'role',
				})
				public role: Role;

			}

			const mapper = createMapper([
				Role,
				User,
			]);

			const user = mapper.mapItem<User>({
				type: 'user',
				id: 5,
				data: {},
				relationships: {
					role: {
						type: 'role',
						id: 10,
						data: {},
						relationships: {},
					},
				},
			});

			expect(user).to.be.an.instanceOf(User);
			expect(user.id).to.be.equal(5);
			expect(user.role).to.be.an.instanceOf(Role);
			expect(user.role.id).to.be.equal(10);
		});

		it('should map collection to entity', () => {
			@Entity({
				type: 'role',
			})
			class Role
			{

				@Id()
				public id: number;

			}

			@Entity({type: 'user'})
			class User
			{

				@Id()
				public id: number;

				@Relationship({
					name: 'roles',
				})
				public roles: Array<Role>;

			}

			const mapper = createMapper([
				Role,
				User,
			]);

			const user = mapper.mapItem<User>({
				type: 'user',
				id: 5,
				data: {},
				relationships: {
					roles: [
						{
							type: 'role',
							id: 10,
							data: {},
							relationships: {},
						},
						{
							type: 'role',
							id: 20,
							data: {},
							relationships: {},
						},
					],
				},
			});

			expect(user).to.be.an.instanceOf(User);
			expect(user.id).to.be.equal(5);
			expect(user.roles).to.have.length(2);
			expect(user.roles[0]).to.be.an.instanceOf(Role);
			expect(user.roles[0].id).to.be.equal(10);
			expect(user.roles[1]).to.be.an.instanceOf(Role);
			expect(user.roles[1].id).to.be.equal(20);
		});

	});

	describe('mapCollection()', () => {

		it('should map a collection', () => {
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

			const mapper = createMapper([
				User,
			]);

			const users = mapper.mapCollection<User>([
				{
					type: 'user',
					id: 5,
					data: {
						name: 'John Doe',
					},
					relationships: {},
				},
				{
					type: 'user',
					id: 10,
					data: {
						name: 'Doe John',
					},
					relationships: {},
				},
			]);

			expect(users).to.have.length(2);
			expect(users[0]).to.be.an.instanceOf(User);
			expect(users[0].id).to.be.equal(5);
			expect(users[0].name).to.be.equal('John Doe');
			expect(users[1]).to.be.an.instanceOf(User);
			expect(users[1].id).to.be.equal(10);
			expect(users[1].name).to.be.equal('Doe John');
		});

	});

});

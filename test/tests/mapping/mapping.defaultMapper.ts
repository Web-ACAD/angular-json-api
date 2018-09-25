import '../../bootstrap';

import {
	Entity, Id, Optional, Column, Relationship, JsonApiConfiguration, JsonApiEntityMetadataLoader, EntityType,
	JsonApiNormalizedResource, defaultMapper,
} from '../../../src';
import {expect} from 'chai';


function mapData<T>(data: JsonApiNormalizedResource, entityTypes: Array<EntityType<any>> = [], columnTypes: any = {}): T
{
	const loader = new JsonApiEntityMetadataLoader;
	const config = new JsonApiConfiguration(loader, 'localhost', columnTypes, entityTypes);
	const mapping = config.getMapping(data.type);

	return defaultMapper(mapping, data, config);
}


describe('#Mapping/mapping.defaultMapper', () => {

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

		expect(() => {
			mapData<User>({
				type: 'user',
				id: 5,
				data: {},
				relationships: {},
			}, [
				User,
			]);
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

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {},
			relationships: {},
		}, [
			User,
		]);

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

		const user1 = mapData<User>({
			type: 'user',
			id: 1,
			data: {},
			relationships: {},
		}, [
			User,
		]);

		const user2 = mapData<User>({
			type: 'user',
			id: 2,
			data: {},
			relationships: {},
		}, [
			User,
		]);

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

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {
				name: 'John Doe',
			},
			relationships: {},
		}, [
			User,
		]);

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.name).to.be.equal('John Doe');
	});

	it('should map custom column name', () => {
		@Entity({
			type: 'user',
		})
		class User
		{

			@Id()
			public id: number;

			@Column({
				name: '_name',
			})
			public name: string;

		}

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {
				_name: 'John Doe',
			},
			relationships: {},
		}, [
			User,
		]);

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

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {
				name: 'John Doe',
			},
			relationships: {},
		}, [
			User,
		]);

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

		const user = mapData<User>({
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
		}, [
			Role,
			User,
		]);

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

		const user = mapData<User>({
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
		}, [
			Role,
			User,
		]);

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.roles).to.have.length(2);
		expect(user.roles[0]).to.be.an.instanceOf(Role);
		expect(user.roles[0].id).to.be.equal(10);
		expect(user.roles[1]).to.be.an.instanceOf(Role);
		expect(user.roles[1].id).to.be.equal(20);
	});

	it('should not map nullable collection', () => {
		@Entity({
			type: 'role',
		})
		class Role
		{

			@Id()
			public id: number;

		}

		@Entity({
			type: 'user',
		})
		class User
		{

			@Id()
			public id: number;

			@Relationship()
			public role: Role|undefined;

		}

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {},
			relationships: {
				role: null,
			},
		}, [
			Role,
			User,
		]);

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.role).to.be.equal(undefined);
	});

	it('should map custom column type', () => {
		@Entity({
			type: 'user',
		})
		class User
		{

			@Id()
			public id: number;

			@Column({
				type: 'userName',
			})
			public name: string;

		}

		function userNameType(name: string): string
		{
			return name.split('').reverse().join('');
		}

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {
				name: 'John Doe',
			},
			relationships: {},
		}, [
			User,
		], {
			userName: userNameType,
		});

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.name).to.be.equal('eoD nhoJ');
	});

	it('should not map optional column', () => {
		@Entity({
			type: 'user',
		})
		class User
		{

			@Id()
			public id: number;

			@Column()
			@Optional()
			public name: string;

		}

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {},
			relationships: {},
		}, [
			User,
		]);

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.name).to.be.equal(undefined);
	});

	it('should map column transformers', () => {
		function add(num: number): number
		{
			return num + 1;
		}

		function multiply(num: number): number
		{
			return num * 10;
		}

		@Entity({
			type: 'user',
		})
		class User
		{

			@Id()
			public id: number;

			@Column({
				transformers: [
					add,
					add,
					add,
					multiply,
				],
			})
			public counter: number;

		}

		const user = mapData<User>({
			type: 'user',
			id: 5,
			data: {
				counter: 0,
			},
			relationships: {},
		}, [
			User,
		]);

		expect(user).to.be.an.instanceOf(User);
		expect(user.id).to.be.equal(5);
		expect(user.counter).to.be.equal(30);
	});

});

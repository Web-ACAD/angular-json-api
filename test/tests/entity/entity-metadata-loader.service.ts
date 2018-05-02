import '../../bootstrap';

import {JsonApiEntityMetadataLoader, Entity, Id, Column, Relationship} from '../../../src';
import {expect} from 'chai';


let loader: JsonApiEntityMetadataLoader;


describe('#Entity/JsonApiEntityMetadataLoader', () => {

	beforeEach(() => {
		loader = new JsonApiEntityMetadataLoader;
	});

	describe('getMetadata()', () => {

		it('should throw an error when class object is used', () => {
			class Chapter {}

			expect(() => {
				loader.getMetadata(Chapter);
			}).to.throw(Error, 'Api: missing @Entity() decorator on Chapter class.');
		});

		it('should throw an error when @Id decorator is missing', () => {
			@Entity({
				type: 'chapter',
			})
			class Chapter {}

			expect(() => {
				loader.getMetadata(Chapter);
			}).to.throw(Error, 'Api: missing @Id() decorator on Chapter class.');
		});

		it('should add all entity decorators to class', () => {
			@Entity({
				type: 'chapter',
			})
			class Chapter
			{

				@Id()
				public id: number;

				@Relationship()
				public book: any;

				@Relationship()
				public comments: Array<any>;

				@Column()
				public title: string;

			}

			expect(loader.getMetadata(Chapter)).to.be.eql({
				entityType: Chapter,
				type: 'chapter',
				id: 'id',
				columns: {
					title: {
						name: 'title',
						property: 'title',
						type: null,
					},
				},
				relationships: {
					book: {
						name: 'book',
						property: 'book',
					},
					comments: {
						name: 'comments',
						property: 'comments',
					},
				},
			});
		});

		it('should add all entity decorators with aliases to class', () => {
			@Entity({
				type: 'chapter',
			})
			class Chapter
			{

				@Id()
				public id: number;

				@Relationship({
					name: '_book',
				})
				public book: any;

				@Relationship({
					name: '_comments',
				})
				public comments: Array<any>;

				@Column({
					name: '_title',
					type: 'custom',
				})
				public title: string;

			}

			expect(loader.getMetadata(Chapter)).to.be.eql({
				entityType: Chapter,
				type: 'chapter',
				id: 'id',
				columns: {
					_title: {
						name: '_title',
						property: 'title',
						type: 'custom',
					},
				},
				relationships: {
					_book: {
						name: '_book',
						property: 'book',
					},
					_comments: {
						name: '_comments',
						property: 'comments',
					},
				},
			});
		});

	});

});

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
					title: 'title',
				},
				relationships: {
					book: 'book',
					comments: 'comments',
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

				@Relationship('_book')
				public book: any;

				@Relationship('_comments')
				public comments: Array<any>;

				@Column('_title')
				public title: string;

			}

			expect(loader.getMetadata(Chapter)).to.be.eql({
				entityType: Chapter,
				type: 'chapter',
				id: 'id',
				columns: {
					_title: 'title',
				},
				relationships: {
					_book: 'book',
					_comments: 'comments',
				},
			});
		});

	});

});

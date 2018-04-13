import '../../bootstrap';

import {createUrl} from '../../../src/utils';
import {expect} from 'chai';


describe('#Utils/Url', () => {

	describe('createUrl()', () => {

		it('should create url without any parameters', () => {
			expect(createUrl('api')).to.be.equal('api');
		});

		it('should create url with parameters', () => {
			expect(createUrl('api', {
				a: 'A',
				b: 'B',
				c: 'C',
			})).to.be.equal('api?a=A&b=B&c=C');
		});

		it('should create url with parameters from url and additional parameters', () => {
			expect(createUrl('api?a=A', {
				b: 'B',
				c: 'C',
			})).to.be.equal('api?a=A&b=B&c=C');
		});

	});

});

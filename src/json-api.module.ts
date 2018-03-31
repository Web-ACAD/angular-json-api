import {NgModule} from '@angular/core';

import {JsonApiNormalizer} from './normalizer/index';
import {JsonApiClient} from './client/index';
import {JsonApiEntityMetadataLoader} from './entity/index';
import {JsonApiMapper} from './mapping/index';


@NgModule({
	providers: [
		JsonApiNormalizer,
		JsonApiClient,
		JsonApiEntityMetadataLoader,
		JsonApiMapper,
	],
})
export class JsonApiModule {}

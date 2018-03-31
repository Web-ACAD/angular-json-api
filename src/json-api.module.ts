import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {JsonApiNormalizer} from './normalizer/index';
import {JsonApiClient} from './client/index';
import {JsonApiEntityMetadataLoader} from './entity/index';
import {JsonApiMapper} from './mapping/index';


@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		JsonApiNormalizer,
		JsonApiClient,
		JsonApiEntityMetadataLoader,
		JsonApiMapper,
	],
})
export class JsonApiModule {}

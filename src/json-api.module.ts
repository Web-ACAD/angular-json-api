import {NgModule} from '@angular/core';

import {WaJsonApiNormalizer} from './normalizer/index';
import {ApiClient} from './client/index';
import {ApiEntityMetadataLoader} from './entity/index';
import {ApiMapper} from './mapping/index';


@NgModule({
	providers: [
		WaJsonApiNormalizer,
		ApiClient,
		ApiEntityMetadataLoader,
		ApiMapper,
	],
})
export class WaJsonApiModule {}

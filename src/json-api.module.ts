import {NgModule} from '@angular/core';

import {WaJsonApiNormalizer} from './normalizer/index';
import {ApiClient} from './client/index';


@NgModule({
	providers: [
		WaJsonApiNormalizer,
		ApiClient,
	],
})
export class WaJsonApiModule {}

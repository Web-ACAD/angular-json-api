import {NgModule} from '@angular/core';

import {WaJsonApiNormalizer} from './normalizer/index';


@NgModule({
	providers: [
		WaJsonApiNormalizer,
	],
})
export class WaJsonApiModule {}

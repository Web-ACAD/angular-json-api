import {NgModule} from '@angular/core';

import {WaJsonApiNormalizer} from './normalizer';


@NgModule({
	providers: [
		WaJsonApiNormalizer,
	],
})
export class WaJsonApiModule {}

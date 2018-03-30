import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

import {ApiConfigurator} from '../configuration/index';
import {WaJsonApiNormalizer} from '../normalizer/index';
import {ApiMapper} from '../mapping/index';


@Injectable()
export class ApiClient
{


	constructor(
		private $http: HttpClient,
		private $config: ApiConfigurator,
		private $normalizer: WaJsonApiNormalizer,
		private $mapper: ApiMapper,
	) {
		this.$config.initialize();
	}


	public get<T = any>(url: string, includes: Array<string> = []): Observable<T>
	{
		return this.$http.get<T>(this.url(url, includes)).pipe(
			map((data) => this.$normalizer.normalize(data)),
			map((data) => this.$mapper.map<any>(data)),
		);
	}


	public put(url: string, body: any): Observable<undefined>
	{
		return this.$http.put(this.url(url), body).pipe(
			map(() => undefined),
		);
	}


	public delete(url: string): Observable<undefined>
	{
		return this.$http.delete(this.url(url)).pipe(
			map(() => undefined),
		);
	}


	public post<T = any>(url: string, body: any, includes: Array<string> = []): Observable<T>
	{
		return this.$http.post<T>(this.url(url, includes), body).pipe(
			map((data) => this.$normalizer.normalize(data)),
			map((data) => this.$mapper.map<any>(data)),
		);
	}


	private url(url: string, includes: Array<string> = []): string
	{
		const include = includes.length ? `?include=${includes.join(',')}` : '';
		return `${this.$config.getUrl()}/${url}${include}`;
	}

}

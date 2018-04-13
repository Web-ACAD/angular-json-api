import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

import {JsonApiConfiguration} from '../configuration/index';
import {JsonApiNormalizer} from '../normalizer/index';
import {JsonApiMapper} from '../mapping/index';
import {createUrl} from '../utils/index';


export declare interface JsonApiRequestOptions
{
	includes?: Array<string>,
	parameters?: {[name: string]: string},
}


@Injectable()
export class JsonApiClient
{


	constructor(
		private $http: HttpClient,
		private $config: JsonApiConfiguration,
		private $normalizer: JsonApiNormalizer,
		private $mapper: JsonApiMapper,
	) {}


	public get<T = any>(url: string, options: JsonApiRequestOptions = {}): Observable<T>
	{
		return this.$http.get<T>(this.url(url, options)).pipe(
			map((data) => this.$normalizer.normalize(data)),
			map((data) => this.$mapper.map<any>(data)),
		);
	}


	public put(url: string, body: any, options: JsonApiRequestOptions = {}): Observable<undefined>
	{
		return this.$http.put(this.url(url, options), body).pipe(
			map(() => undefined),
		);
	}


	public delete(url: string, options: JsonApiRequestOptions = {}): Observable<undefined>
	{
		return this.$http.delete(this.url(url, options)).pipe(
			map(() => undefined),
		);
	}


	public post<T = any>(url: string, body: any, options: JsonApiRequestOptions = {}): Observable<T>
	{
		return this.$http.post<T>(this.url(url, options), body).pipe(
			map((data) => this.$normalizer.normalize(data)),
			map((data) => this.$mapper.map<any>(data)),
		);
	}


	private url(url: string, options: JsonApiRequestOptions): string
	{
		const parameters = typeof options.parameters === 'undefined' ? {} : {...options.parameters};

		if (typeof options.includes !== 'undefined' && options.includes.length > 0) {
			parameters['include'] = options.includes.join(',');
		}

		return createUrl(`${this.$config.getUrl()}/${url}`, parameters);
	}

}

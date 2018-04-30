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
	transform?: boolean,
}


const defaultRequestOptions: JsonApiRequestOptions = {
	transform: true,
};

const defaultDeleteRequestOptions: JsonApiRequestOptions = {
	transform: false,
};


@Injectable()
export class JsonApiClient
{


	constructor(
		private $http: HttpClient,
		private $config: JsonApiConfiguration,
		private $normalizer: JsonApiNormalizer,
		private $mapper: JsonApiMapper,
	) {}


	public get<T = any>(url: string, options: JsonApiRequestOptions = defaultRequestOptions): Observable<T>
	{
		return this.transformPipe<T>(
			this.$http.get<T>(this.url(url, options)),
			options.transform,
		);
	}


	public put<T = any>(url: string, body: any, options: JsonApiRequestOptions = defaultRequestOptions): Observable<T>
	{
		return this.transformPipe<T>(
			this.$http.put<T>(this.url(url, options), body),
			options.transform,
		);
	}


	public delete<T = any>(url: string, options: JsonApiRequestOptions = defaultDeleteRequestOptions): Observable<T>
	{
		return this.transformPipe<T>(
			this.$http.delete<T>(this.url(url, options)),
			options.transform,
		);
	}


	public post<T = any>(url: string, body: any, options: JsonApiRequestOptions = defaultRequestOptions): Observable<T>
	{
		return this.transformPipe<T>(
			this.$http.post<T>(this.url(url, options), body),
			options.transform,
		);
	}


	private transformPipe<T>(req: Observable<Object>, transform: boolean): Observable<T>
	{
		if (transform) {
			return req.pipe(
				map((data) => this.$normalizer.normalize(data)),
				map((data) => this.$mapper.map<any>(data)),
			);
		}

		return <any>req;
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

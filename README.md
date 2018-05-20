[![NPM version](https://img.shields.io/npm/v/@webacad/angular-json-api.svg?style=flat-square)](https://www.npmjs.com/package/@webacad/angular-json-api)
[![Build Status](https://img.shields.io/travis/Web-ACAD/angular-json-api.svg?style=flat-square)](https://travis-ci.org/Web-ACAD/angular-json-api)

# WebACAD/AngularJsonApi

Angular module for working with data from standardized json api

## Installation

```bash
$ npm install --save @angular/common@^5.0
$ npm install --save @angular/core@^5.0
$ npm install --save rxjs@^5.5.0
$ npm install --save @webacad/angular-json-api
```

or with yarn

```bash
$ yarn add @angular/common@^5.0
$ yarn add @angular/core@^5.0
$ yarn add rxjs@^5.5.0
$ yarn add @webacad/angular-json-api
```

## Register the module

```typescript
import {NgModule} from '@angular/core';
import {JsonApiModule, JsonApiRootModuleConfiguration} from '@webacad/angular-json-api';

const apiConfig: JsonApiRootModuleConfiguration = {
    url: 'https://example.com/api',
    entities: [],
};

@NgModule({
    imports: [
        JsonApiModule.forRoot(apiConfig),
    ],
})
export class AppModule {}
```

**You must provide the base url to your API**

## Create entities

There are several decorators which you can use to define your entity. They are later used for mapping the data from API 
to these entities.

```typescript
import {Entity, Id, Column, Relationship} from '@webacad/angular-json-api';
import {Role} from './role';

@Entity({
    type: 'user',
})
export class User
{

    @Id()
    public readonly id: string;
    
    @Column({
        name: 'name',
    })
    public readonly name: string;
    
    @Relationship({
        name: 'roles',
    })
    public roles: Array<Role>;

}
```

**`@Column()` options:**

* `name`: name of key in json data source. Default value is the name of property.

**`@Relationship()` options:**

* `name`: name of key in json data source. Default value is the name of property.

**Register in app:**

Last thing is to update the API configuration for your app:

```typescript
import {Role} from './role';
import {User} from './user';

const apiConfig: JsonApiRootModuleConfiguration = {
    url: 'https://example.com/api',
    entities: [
        Role,
        User,
    ],
};
```

## Child modules

The `entities` array for your configuration has a potential to grow really fast. If you split your model classes into 
modules, you could register entities in their respective modules too.

```typescript
import {NgModule} from '@angular/core';
import {JsonApiModule, JsonApiChildModuleConfiguration} from '@webacad/angular-json-api';
import {Role} from './role';
import {User} from './user';

const apiConfig: JsonApiChildModuleConfiguration = {
    entities: [
        Role,
        User,
    ],
};

@NgModule({
    imports: [
        JsonApiModule.forChild(apiConfig),
    ],
})
export class UsersModule {}
```

## JsonApiClient

`JsonApiClient` service is a simple wrapper around the new `HttpClient` from angular.

It takes care of prefixing all of your urls with provided url in the app configuration and mapping the data into your 
entities.

**Methods:**

* `get<T>(url: string, options: JsonApiRequestOptions = {}): Observable<T>`
* `post<T>(url: string, body: any|Observable<any>, options: JsonApiRequestOptions = {}): Observable<T>`
* `put<T>(url: string, body: any|Observable<any>, options: JsonApiRequestOptions = {}): Observable<T>`
* `delete<T>(url: string, options: JsonApiRequestOptions = {}): Observable<T>`

**Options:**

* `includes`: list of relationships you want to include in the response from API
* `parameters`: additional URL parameters to be send
* `transform`: (default `true`, `false` for delete requests), if set too `false` you'll get the raw data from angular http client

**Example:**

```typescript
import {JsonApiClient} from '@webacad/angular-json-api';
import {Observable} from 'rxjs/Observable';
import {User} from './user';

export class UsersRepository
{
    
    constructor(
        private api: JsonApiClient,
    ) {}
    
    public getById(id: number): Observable<User>
    {
        return this.api.get<User>(`users/${id}`);
    }
    
}
```

## Custom column types

All values inserted into columns are taken from the json data without any change.

Custom column type can be used to transform the raw column value into something else. This can make things like 
transforming timestamps into `Date` objects really easy.

**1. write the transform function:**

```typescript
function timestampToDate(timestamp: number): Date
{
    return new Date(timestamp * 1000);
}
```

**2. register type into your app:**

```typescript
const apiConfig = {
    url: '',
    entities: [],
    types: {
        myCustomDate: timestampToDate,
    },
};
```

**3. use in entity:**

```typescript
@Entity({
    type: 'article',
})
class Article
{

    @Id()
    public readonly id: string;

    @Column({
        type: 'myCustomDate',
    })
    public readonly createdAt: Date;

}
```

## Column transformers

Column transformers are similar to column types described above. But where column types are global, column transformers
are local.

You may have some entity which has a unique way of handling one of it's columns. One option is to create the getter and 
setter for such column, but that just makes the code less readable. Better option is to use column transformer:

First define transformer function:

```typescript
function dateTimeFromTimestamp(timestamp: number): Date
{
    return new Date(timestamp * 1000);
}
``` 

Second used it in your entity:

```typescript
@Entity({
    type: 'article',
})
class Article
{

    @Id()
    public readonly id: string;

    @Column({
        transformers: [
            dateTimeFromTimestamp,
        ],
    })
    public readonly createdAt: Date;

}
```

As you can see, the `transformers` option accepts an array. That means that you can attach multiple transformers to one 
column. In that case the first transformer will be applied first on mapping.

If the column has `type` option too, the `transformers` option will be applied **after** type mapping.

## Optional column

If some column data is missing in the API json, this library will throw an exception. This behavior can be disabled by 
marking the column as optional. Just add the `@Optional()` decorator:

```typescript
@Entity({
    type: 'article',
})
class Article
{

    @Id()
    public readonly id: string;

    @Column()
    @Optional()
    public readonly author: any;

}
```

## Mapping to entities

If you use the methods above for accessing your API, the returned data will be automatically mapped to the correct 
entity class.

**When using auto mapping, the `constructor` is not called!**

[![NPM version](https://img.shields.io/npm/v/@webacad/angular-json-api.svg?style=flat-square)](https://www.npmjs.com/package/@webacad/angular-json-api)
[![Build Status](https://img.shields.io/travis/Web-ACAD/angular-json-api.svg?style=flat-square)](https://travis-ci.org/Web-ACAD/angular-json-api)

# WebACAD/AngularJsonApi

Angular module for working with data from standardized json api

## Installation

```bash
$ npm install --save @webacad/angular-json-api
```

or with yarn

```bash
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
    
    @Column('name')
    public readonly name: string;
    
    @Relationship('roles')
    public roles: Array<Role>;

}
```

It's not necessary to provide any arguments for `@Column()` and `@Relationship()` decorators if the argument is same as 
the property name they are attached to.

These arguments are names of data keys in the API response.

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
* `post<T>(url: string, body: any, options: JsonApiRequestOptions = {}): Observable<T>`
* `put(url: string, body: any, options: JsonApiRequestOptions = {}): Observable<undefined>`
* `delete(url: string, options: JsonApiRequestOptions = {}): Observable<undefined>`

**Only `get` and `post` methods returns any data, `put` and `delete` returns `undefined`.**

**Options:**

* `includes`: list of relationships you want to include in the response from API
* `parameters`: additional URL parameters to be send

## Mapping to entities

If you use the methods above for accessing your API, the returned data will be automatically mapped to the correct 
entity class.

**When using auto mapping, the `constructor` is not called!**

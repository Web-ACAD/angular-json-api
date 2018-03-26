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

## Register module

```typescript
import {NgModule} from '@angular/core';
import {WaJsonApiModule} from '@webacad/angular-json-api';

@NgModule({
    imports: [
        WaJsonApiModule,
    ],
})
export class AppModule {}
```

## Normalize data from API response

Working with raw data from [standardized](http://jsonapi.org/) can be a bit tedious. For that reason you can first run 
your data through the normalizer.

It will look at all the relationships and includes and connect them together for you.

The best way is to write a transformer service, which will take the raw data from http response and transform it into 
the desired entity. 

```typescript
import {Injectable} from '@angular/core';
import {WaJsonApiNormalizer, JsonApiData, TransformedResource} from '@webacad/angular-json-api';
import {User} from './user';

@Injectable()
export class UserTransformer
{
    
    constructor(
        private normalizer: WaJsonApiNormalizer,
    ) {}
    
    public transformItem(data: JsonApiData): User
    {
        const normalizedData = this.normalizer.normalizeItem(data);
        return new User(normalizedData.id);
    }
    
    public transformCollection(data: JsonApiData): Array<User>
    {
        const normalizedData = this.normalizer.normalizeCollection(data);
        return normalizedData.map((resource: TransformedResource) => {
            return new User(resource.id);
        });
    }
    
}
```

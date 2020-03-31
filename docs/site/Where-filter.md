---
title: 'Where filter'
lang: en
keywords: LoopBack 4.0, LoopBack 4, where
layout: readme
source: loopback-next
sidebar: lb4_sidebar
permalink: /doc/en/lb4/Where-filter.html
summary: A <i>where</i> filter specifies a set of logical conditions to match, similar to a WHERE clause in a SQL query.
---

## REST API

In the first form below, the condition is equivalence, that is, it tests whether _property_ equals _value_.
The second form below is for all other conditions.

```
filter[where][property]=value
```

```
filter[where][property][op]=value
```

For example, if there is a cars model with an `odo` property, the following query finds instances where the `odo` is greater than 5000:

```
/cars?filter[where][odo][gt]=5000
```

For example, here is a query to find cars with `odo` is less than 30,000:

```
/cars?filter[where][odo][lt]=30000
```

Where:

* _property_ is the name of a property (field) in the model being queried.
* _value_ is a literal value. 
* _op_ is one of the [operators](#operators) listed below.

You can also use [stringified JSON format](Querying-data.html#using-stringified-json-in-rest-queries) in a REST query.

### Filter limit

{% include important.html content="There is a limit of twenty filters (combined with AND or OR) using this format, due to the use of [qs](https://github.com/ljharb/qs#parsing-arrays).  When there are more than twenty, the filter is converted into an `Object` where it is expecting
an `Array`. See [LoopBack issue #2824](https://github.com/strongloop/loopback/issues/2824) for more details.
" %}

You can encode the large filter object as "stringified JSON":

```
http://localhost:3000/api/Books
?filter={"where":{"or":[{"id":1},{"id":2},...,{"id":20"},{"id":21}]}}
```

<!-- **Override limit in `server.js`**

```js
// In `server/server.js`, before boot is called
var loopback = require('loopback');
var boot = require('loopback-boot');
var qs = require('qs');

var app = module.exports = loopback();
app.set('query parser', function(value, option) {
  return qs.parse(value, {arrayLimit: 500});
});

app.start = function() {
  ...
``` -->

## Node API

{% include content/angular-methods-caveat.html lang=page.lang %}

### Where clause for queries

For query methods such as `find()`,` findOrCreate()`, or `findOne()`, use the first form below to test equivalence, that is, whether _property_ equals _value_.
Use the second form below for all other conditions.

```ts
{where: {property: value}} 
```

```ts
{where: {property: {op: value}}}
```

Where:

* _property_ is the name of a property (field) in the model being queried.
* _value_ is a literal value. 
* _op_ is one of the [operators](#operators) listed below.

```ts
await productRepository.find({where: {size:'large'}});
```

The equivalent REST query would be:

```
/api/products?filter[where][size]=large
```

{% include tip.html content="The above where clause syntax is for queries, and not for [`count()`](https://loopback.io/doc/en/lb4/apidocs.repository.defaultcrudrepository.count.html).
For all other methods, including `count()`, omit the `{ where : ... }` wrapper; see [Where clause for other methods](#where-clause-for-other-methods) below.
" %}

### Where clause for other methods

{% include important.html content="When you call the Node APIs _for methods other than queries_, that is for methods that update and delete
(and [`count()`](https://loopback.io/doc/en/lb4/apidocs.repository.defaultcrudrepository.count.html)), don't wrap the where clause in a `{ where : ... }` object, simply use the condition as the argument as shown below. See examples below.
" %}

In the first form below, the condition is equivalence, that is, it tests whether _property_ equals _value_. The second form is for all other conditions.

```javascript
{property: value}
```

```javascript
{property: {op: value}}
```

Where:

* _property_ is the name of a property (field) in the model being queried.
* _value_ is a literal value. 
* _op_ is one of the [operators](#operators) listed below.

For example, below shows a where clause in a call to a model's [updateAll()](https://loopback.io/doc/en/lb4/apidocs.repository.defaultcrudrepository.updateall.html) method.
Note the lack of `{ where : ... }` in the argument.

```ts
await orderRepository.updateAll( {id: 123}, {customerId: null});
```

More examples, this time in a call to [deleteAll()](https://loopback.io/doc/en/lb4/apidocs.repository.defaultcrudrepository.deleteall.html):

```ts
await orderRepository.deleteAll( { customerId: 99 });
```

To delete all records where the cost property is greater than 100:

```ts
await productRepositor.deleteAll({cost: {gt: 100}});
```

### Default scope with where filters

Adding a `scope` to a [model definition](Model.md#scope))
automatically adds a method to model. LoopBack will apply the filter whenever a model is created, updated, or queried.

{% include tip.html content="scope with a `where` filter may not work as you expect!
" %}

## Operators

This table describes the operators available in "where" filters. See [Examples](#examples) below.

| Operator  | Description|
| ------------- | ------------- |
| = | Equivalence. See [examples](#equivalence) below.|
| and | Logical AND operator. See [AND and OR operators](#and-and-or-operators) and [examples](#and--or) below.|
| or | Logical OR operator. See [AND and OR operators](#and-and-or-operators) and [examples](#and--or) below.|
| gt, gte | Numerical greater than (&gt;); greater than or equal (&gt;=). Valid only for numerical and date values. See [examples](#gt-and-lt) below. <br/><br/>  For Geopoint values, the units are in miles by default. See [Geopoint](http://apidocs.loopback.io/loopback-datasource-juggler/#geopoint) for more information.|
| lt, lte | Numerical less than (&lt;); less than or equal (&lt;=). Valid only for numerical and date values. <br/><br/>For geolocation values, the units are in miles by default. See [Geopoint](http://apidocs.loopback.io/loopback-datasource-juggler/#geopoint) for more information. |
| between | True if the value is between the two specified values: greater than or equal to first value and less than or equal to second value. See [examples](#gt-and-lt) below. <br/><br/> For geolocation values, the units are in miles by default. See [Geopoint](http://apidocs.loopback.io/loopback-datasource-juggler/#geopoint) for more information.|
| inq, nin | In / not in an array of values. See [examples](#inq) below.|
| near | For geolocations, return the closest points, sorted in order of distance. Use with `limit` to return the _n_ closest points. See [examples](#near) below.|
| neq | Not equal (!=) |
| like, nlike | LIKE / NOT LIKE operators for use with regular expressions. The regular expression format depends on the backend data source.  See [examples](#like-and-nlike) below. |
| like, nlike, options: i| LIKE / NOT LIKE operators for use with regular expressions with the case insensitive flag. It is supported by the memory and MongoDB connectors. The options property set to 'i' tells LoopBack that it should do case-insensitive matching on the required property.  See [examples](#like-and-nlike-insensitive) below. |
| ilike, nilike | ILIKE / NOT ILIKE operators for use with regular expressions. The operator is supported only by the memory and Postgresql connectors. See [examples](#ilike-and-nilike) below. |
| regexp | Regular expression. See [examples](#regular-expressions) below. |

### AND and OR operators

Use the AND and OR operators to create compound logical filters based on simple where filter conditions, using the following syntax.

{% include code-caption.html content="Node API" %}
```javascript
{where: {<and|or>: [condition1, condition2, ...]}}
```

**REST**

```
[where][<and|or>][0]condition1&[where][<and|or>]condition2...
```

Where _condition1_ and _condition2_ are a filter conditions.

See [examples](#examples) below.

### Regular expressions

You can use regular expressions in a where filter, with the following syntax. You can use a regular expression in a where clause for updates and deletes, as well as queries.

Essentially, `regexp` is just like an operator in which you provide a regular expression value as the comparison value.

{% include tip.html content="A regular expression value can also include one or more [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags).  For example, append `/i` to the regular expression to perform a case-insensitive match.
" %}

{% include code-caption.html content="Node API" %}

```javascript
{where: {property: {regexp: <expression>}}}
```

Where `<expression>` can be a:

* String defining a regular expression (for example, `'^foo'` ).
* Regular expression literal (for example, `/^foo/` ).
* Regular expression object (for example, `new RegExp(/John/)`).

Or, in a simpler format:

```javascript
{where: {property: <expression>}}}
```

Where `<expression>` can be a:

* Regular expression literal (for example, `/^foo/` ).
* Regular expression object (for example, `new RegExp(/John/)`).

For more information on JavaScript regular expressions,
see [Regular Expressions (Mozilla Developer Network)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

{% include tip.html content="The above where clause syntax is for queries.
For updates and deletes, omit the `{ where : ... }` wrapper.
See [Where clause for other methods](#where-clause-for-other-methods) below.
" %}

For example, this query returns all products for which the category starts with a capital "T":

```ts
await productRepository.find({where: {category: {regexp: "^T"}}});
```

Or, using the simplified form:

```ts
await productRepository.find({where: {category: /^T/}});
```

**REST**

```
filter[where][property][regexp]=expression
```

Where:

* _property_ is the name of a property (field) in the model being queried.
* _expression_ is the JavaScript regular expression string.
See [Regular Expressions (Mozilla Developer Network)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

A regular expression value can also include one or more [flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags).
For example, append `/i` to the regular expression to perform a case-insensitive match.

{% include important.html content="When using a regular expression flag with the REST API,
you _must_ precede the regular expression with a slash character (`/`).
" %}

The following REST query returns all products for which the category starts with a capital "T"::

```
/api/products?filter[where][category][regexp]=^T
```


The following REST query returns products that start with either an uppercase "T" or lowercase "t":

```
/api/products?filter[where][category][regexp]=/^t/i
```

Note that since the regular expression includes a flag, it is preceded by a slash (`/`).

## Examples

### Equivalence

Weapons with name M1911:

**REST**

```
/weapons?filter[where][name]=M1911
```

Products where size is "large":

**REST**

```
/api/products?filter[where][size]=large
```

Equivalently, in Node:

```javascript
await productRepository.find({ where: {size:'large'} });
```

### gt and lt

```ts
ONE_MONTH = 30 * 24 * 60 * 60 * 1000;  // Month in milliseconds
await transactionRepository.find({
      where: {
        userId: user.id,
        time: {gt: Date.now() - ONE_MONTH}
      }
    });
```

For example, the following query returns all instances of the order using a _where_ filter that specifies a date property after (greater than) the specified date: 

```
/orders?filter[where][date][gt]=2014-04-01T18:30:00.000Z
```

The same query using the Node API:

```javascript
orderRepository.find({
  where: { 
    date: {gt: new Date('2014-04-01T18:30:00.000Z')}
  }
});
```

The top three weapons with a range over 900 meters:

```
/weapons?filter[where][effectiveRange][gt]=900&filter[limit]=3
```

Weapons with audibleRange less than 10:

```
/weapons?filter[where][audibleRange][lt]=10
```

### and / or

The following code is an example of using the **"and"** operator to find reviews where the title is "My Post" and content is "Hello".

```ts
await reviewRepository.find({where: {and: [{title: 'My Post'}, {content: 'Hello'}]}});
```

Equivalent in REST:

```
?filter[where][and][0][title]=My%20Post&filter[where][and][1][content]=Hello
```

Example using the **"or"** operator to finds reviews that either have title of "My Review" or content of "Hello".

```ts
await reviewRepository.find({where: {or: [{title: 'My Review'}, {content: 'Hello'}]}});
```

More complex example. The following expresses `(field1= foo and field2=bar) OR field1=morefoo`:

```javascript
{
   or: [
     { and: [{ field1: 'foo' }, { field2: 'bar' }] },
     { field1: 'morefoo' }
   ]
 }
```

### between

Example of between operator:

```
filter[where][price][between][0]=0&filter[where][price][between][1]=7
```

In Node API:

```javascript
await shirtsRepository.find({where: {size: {between: [0,7]}}});
```

### near

The `where.<field>.near` filter is different from other where filters: most where filters **limit**the number of records returned,
whereas `near` **orders** them, making it more like a SQL `order by` clause.
By combining it with [`limit`](Limit-filter.html), you can create a query to get, for example, the **three records nearest to a given location**.

For example:

```
/hotels?filter[where][geo][near]=153.536,-28.1&filter[limit]=3
```

GeoPoints can be expressed in any of the following ways:

```javascript
location = new GeoPoint({lat: 42.266271, lng: -72.6700016}); // GeoPoint
location = '42.266271,-72.6700016';                          // String
location = [42.266271, -72.6700016];                         // Array
location = {lat: 42.266271, lng: -72.6700016};               // Object Literal

await hotelRepository.find({where: {geo: {near: location }}});
```

### near (ordering _and limiting by distance_)

The near filter can take two additional properties:

*   `maxDistance`
*   `unit`

When `maxDistance` is included in the filter, near behaves more like a typical where filter, limiting results to those within a given distance to a location.
By default, `maxDistance` measures distance in **miles**.

Example of finding the all hotels within two miles of a given GeoPoint:

```ts
const userLocation = new GeoPoint({
  lat: 42.266271,
  lng: -72.6700016
});
const results = await hotelRepository.find({
  where: {
    location: {
      near: userLocation,
      maxDistance: 2
    }
  }
});
```

To change the units of measurement, specify `unit` property to one of the following:

* `kilometers`
* `meters`
* `miles`
* `feet`
* `radians`
* `degrees`

For example, to change the query above to use kilometers instead of miles:

```ts
await hotelRepository.find({
  where: {
    location: {
      near: userLocation,
      maxDistance: 2,
      unit: 'kilometers'
    }
  }
});
```

{% include warning.html content="Spell Carefully!

If `unit` value is mistyped, for example `'mile'` instead of `'miles'`, LoopBack will silently ignore the filter!
" %}

### like and nlike

The like and nlike (not like) operators enable you to match SQL regular expressions. The regular expression format depends on the backend data source.

Example of like operator:

```ts
await postRepository.find({where: {title: {like: 'M.-st'}}};
```

Example of nlike operator:

```ts
await postRepository.find({where: {title: {nlike: 'M.-XY'}}});
```

When using the memory connector:

```ts
await userRepository.find({where: {name: {like: '%St%'}}});
await userRepository.find({where: {name: {nlike: 'M%XY'}}});
```

### like and nlike insensitive
```ts
const pattern = new RegExp('.*'+query+'.*', "i"); /* case-insensitive RegExp search */
await postRepository.find({ where: {title: { like: pattern}}});
```
Via the REST API:
```
?filter={"where":{"title":{"like":"someth.*","options":"i"}}}
```

### ilike and nilike

The ilike and nilike (not ilike) operators enable you to match case insensitive regular expressions. It is supported by the memory connector and Postgresql connectors.

Example of ilike operator:

```ts
await postRepository.find({where: {title: {ilike: 'm.-st'}}});
```

Example of nilike operator:

```ts
await postRepository.find({where: {title: {nilike: 'm.-xy'}}});
```

When using the memory connector:

```ts
await userRepository.find({where: {name: {ilike: '%st%'}}});
await userRepository.find({where: {name: {nilike: 's%xy'}}});
```

When using the Postgresql connector:

```ts
await userRepository.find({where: {name: {ilike: 'john%'}}});
```

### inq

The inq operator checks whether the value of the specified property matches any of the values provided in an array. The general syntax is:

```javascript
{where: { property: { inq: [val1, val2, ...]}}}
```

Where:

* _property_ is the name of a property (field) in the model being queried.
* _val1, val2_, and so on, are literal values in an array.

Example of inq operator:

```ts
await postRepository.find({where: {id: {inq: [123, 234]}}});
```  

REST:

```
/medias?filter[where][keywords][inq]=foo&filter[where][keywords][inq]=bar
```

Or 

```
?filter={"where": {"keywords": {"inq": ["foo", "bar"]}}}
```

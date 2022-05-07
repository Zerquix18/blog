---
title: A Simple TypeScript Class to query information from DynamoDB
description: Simplifying how query DynamoDB
date: "2022-05-07T00:00:00.000Z"
tags: aws, dynamodb, nodejs, docclient
---

I wrote a wrapper for DocClient which I think some people might find useful. The main purpose is to simplify retreiving and inserting data, especially for Lambda functions that call DynamoDB. You can see the code [here](https://gist.github.com/Zerquix18/482261fb0250aa13c79e139b962585e0).

It requires the aws-sdk, lodash and uuid, which you can download with:

```
npm install aws-sdk lodash uuid
```

It also assumes that you use `id` as your main key, which is most likely the case.

Let's see how it works, maybe you find it interesting!

## Constructor

You need to start a new instance of the class with the name of the table:

```js
const posts = new DynamoTable('posts', 'us-east-1'); // the region is optional
```

One of the advantages of storing the name in the class is that you can use the same variable for both production and development.

```js
const posts = new DynamoTable(isProd ? 'posts' : 'dev_posts', 'us-east-1'); 
```

## Methods

This instance now contains the following methods:

* `addItem(item)`
* `updateItem(item)`
* `deleteItem(id)`
* `getItem(id)`
* `batchGetItem(ids)`
* `batchWriteItem(ids)`
* `scan({ nextToken, limit, filter })`
* `simpleScan(filter)`
* `scanAll(filter)`
* `query(index, queryExpression, nextToken, limit, filter)`
* `simpleQuery(index, queryExpression, filter)`
* `queryAll(index, queryExpression, filter)`

Let's see how to use them!

## Inserting

You can add single items with `addItem`. It will automatically generate an ID if you pass one.

```js
import DynamoTable from './DynamoTable';

const posts = new DynamoTable('posts', 'us-east-1'); // the region is optional

async function main() {
  const post = {
    title: 'New post',
    content: 'I am the body!'
  };

  const newPost = await posts.addItem(post);
  console.log(newPost);
  /*
    {
      id: '7da9576c-a97c-47fc-a884-fbc7fda3ab3a',
      title: 'New post',
      content: 'I am the body!'
    }
  */
}

main();
```

You can insert multiple items using `batchWriteItem`:

```js
import DynamoTable from './DynamoTable';

const posts = new DynamoTable('posts', 'us-east-1'); // the region is optional

async function main() {
  const post1 = {
    title: 'New post 1',
    content: 'I am the body of post 1!'
  };
  const post2 = {
    title: 'New post 2',
    content: 'I am the body of post 2!'
  };

  await posts.batchWriteItem([post1, post2]);
}

main();
```

## Updating

You can update a post using the `updateItem`, which allows you to specify the fields you want to update only. It also returns the full item so you can pass it as a response to your API.

```js
import DynamoTable from './DynamoTable';

const posts = new DynamoTable('posts', 'us-east-1'); // the region is optional

async function main() {
  const postUpdated = {
    id: '7da9576c-a97c-47fc-a884-fbc7fda3ab3a',
    title: 'New post updated',
  }

  const newPost = await posts.updateItem(postUpdated);
  console.log(newPost);
  /*
    {
      content: 'I am the body!',
      id: '7da9576c-a97c-47fc-a884-fbc7fda3ab3a',
      title: 'New post updated'
    }
  */
}

main();
```

## Retrieving

The class supports 4 ways of retreiving data: A single item, multiple items, and listing by scanning or querying.

The simplest one is getting a simple item using its ID:

```js
import DynamoTable from './DynamoTable';

const posts = new DynamoTable('posts', 'us-east-1'); // the region is optional

async function main() {
  const post = await posts.getItem('7da9576c-a97c-47fc-a884-fbc7fda3ab3a');
  console.log(post);
  /*
    {
      content: 'I am the body!',
      id: '7da9576c-a97c-47fc-a884-fbc7fda3ab3a',
      title: 'New post updated'
    }
  */
}

main();
```

But you can also get a bunch of items using their IDs:

```js
const items = await posts.batchGetItem([
  '767311af-b122-420d-9b7f-a5692dbfbd45',
  'd7fce7ab-252f-4b66-a1f8-fc940db14f5c',
]);
console.log(items);
/*
[
  {
    authorId: '1',
    content: 'Title 1',
    id: '767311af-b122-420d-9b7f-a5692dbfbd45',
    title: 'Post 1'
  },
  {
    authorId: '2',
    content: 'Title 3',
    id: 'd7fce7ab-252f-4b66-a1f8-fc940db14f5c',
    title: 'Post 3'
  }
]
*/
```

There are three methods to scan a table. A base `scan` method, which is friendly to the way you probably use scan. A `simpleScan` method which ignores pagination, and a `scanAll` method which will continue to retrieve data until there's nothing more.

The `scan` method accepts one parameter with 3 fields: `nextToken`, `limit` and `filter`.

* `nextToken` tells DynamoDB to retrieve items after this key.
* `limit` determines the maximum amount of items to retrieve.
* `filter` can either be an object like `{ key: value }` (for key = value) or `expression` and `values` (for something like `attribute_not_exists(:example)`)

The method returns `items` (an array) and `nextToken` (a string or null).

You can retrieve all items from a table like this:

```js
const postsScan = await posts.scan();
console.log(postsScan);
/*
  {
    items: [
      {
        content: 'I am the body!',
        id: '7da9576c-a97c-47fc-a884-fbc7fda3ab3a',
        title: 'New post updated'
      },
      {
        content: 'I am the body of post 1!',
        id: '7796b42d-4e20-4cc1-ab85-ca3240da5991',
        title: 'New post 1'
      },
      {
        content: 'I am the body of post 2!',
        id: 'fb4d00ab-ffd8-473d-8e5f-bb506506ab30',
        title: 'New post 2'
      }
    ],
    nextToken: null
  }
*/
```

You can do a `scanAll` to keep retrieving items until there are no more:

```js
  const postsScan = await posts.scanAll();
  console.log(postsScan);
  /*
    [
      {
        content: 'I am the body!',
        id: '7da9576c-a97c-47fc-a884-fbc7fda3ab3a',
        title: 'New post updated'
      },
      {
        content: 'I am the body of post 1!',
        id: '7796b42d-4e20-4cc1-ab85-ca3240da5991',
        title: 'New post 1'
      },
      {
        content: 'I am the body of post 2!',
        id: 'fb4d00ab-ffd8-473d-8e5f-bb506506ab30',
        title: 'New post 2'
      }
    ]
  */
```

A simple `simpleScan` will return the first batch of scan, without pagination information.

### Filtering

Before moving into queries, let's add an "authorId" key to our `posts` table so we scan and filter using it.

```js
const postsToInsert = [
  {
    authorId: '1',
    content: 'Title 1',
    title: 'Post 1',
  },
  {
    authorId: '1',
    content: 'Title 2',
    title: 'Post 2',
  },
  {
    authorId: '2',
    content: 'Title 3',
    title: 'Post 3',
  },
  {
    authorId: '4',
    content: 'Title 4',
    title: 'Post 4',
  },
];

await posts.batchWriteItem(postsToInsert);
```

We can now scan and filter for "authorId":

```js
const postsByAuthor1 = await posts.scan({ filter: { authorId: '1' } }); // expression would be authorId = 1
console.log(postsByAuthor1);
/*
{
  items: [
    {
      authorId: '1',
      content: 'Title 1',
      id: '767311af-b122-420d-9b7f-a5692dbfbd45',
      title: 'Post 1'
    },
    {
      authorId: '1',
      content: 'Title 2',
      id: 'a46ec412-1e95-4c9c-a24e-1d4d15092d3f',
      title: 'Post 2'
    }
  ],
  nextToken: null
}
*/
```

For more complex, or even custom filters, you can use an expression and values:

```js
const postsByAuthor1 = await posts.scan({
  filter: {
    expression: 'authorId = :authorId',
    values: {
      authorId: '1'
    }
  }
});
console.log(postsByAuthor1);
/*
{
  items: [
    {
      authorId: '1',
      content: 'Title 1',
      id: '767311af-b122-420d-9b7f-a5692dbfbd45',
      title: 'Post 1'
    },
    {
      authorId: '1',
      content: 'Title 2',
      id: 'a46ec412-1e95-4c9c-a24e-1d4d15092d3f',
      title: 'Post 2'
    }
  ],
  nextToken: null
}
*/
```

### Querying

Now we can create an index for our 'authorId' field, called 'authorId-index'.

```js
const postsByAuthor1 = await posts.query({
  index: 'authorId-index',
  queryExpression: { authorId: '1' }
});
console.log(postsByAuthor1);
/*
{
  items: [
    {
      content: 'Title 1',
      authorId: '1',
      id: '767311af-b122-420d-9b7f-a5692dbfbd45',
      title: 'Post 1'
    },
    {
      content: 'Title 2',
      authorId: '1',
      id: 'a46ec412-1e95-4c9c-a24e-1d4d15092d3f',
      title: 'Post 2'
    }
  ],
  nextToken: null
}
*/
```

`query` also accepts a `filter`, `nextToken` and `limit` much like a scan, for the results after the query.

You can also use `simpleQuery` like `simpleScan`:

```js
const postsByAuthor1 = await posts.simpleQuery('authorId-index', { authorId: '1' });
console.log(postsByAuthor1);
/*
[
  {
    content: 'Title 1',
    authorId: '1',
    id: '767311af-b122-420d-9b7f-a5692dbfbd45',
    title: 'Post 1'
  },
  {
    content: 'Title 2',
    authorId: '1',
    id: 'a46ec412-1e95-4c9c-a24e-1d4d15092d3f',
    title: 'Post 2'
  }
]
*/
```

`simpleQuery` doesn't deal with pagination (so there may be more items) and it accepts a filter as a third parameter.

You also have a `queryAll` method which does deal with pagination and keeps querying until all items have been retrieved.

```js
const postsByAuthor1 = await posts.queryAll('authorId-index', { authorId: '1' });
console.log(postsByAuthor1);
  /*
[
  {
    content: 'Title 1',
    authorId: '1',
    id: '767311af-b122-420d-9b7f-a5692dbfbd45',
    title: 'Post 1'
  },
  {
    content: 'Title 2',
    authorId: '1',
    id: 'a46ec412-1e95-4c9c-a24e-1d4d15092d3f',
    title: 'Post 2'
  }
]
*/
```

## Deleting

You can delete an item using the `deleteItem` method:

```js
const deletedPost = await posts.deleteItem('a46ec412-1e95-4c9c-a24e-1d4d15092d3f');
console.log(deletedPost);
/*
{
  authorId: '1',
  content: 'Title 2',
  id: 'a46ec412-1e95-4c9c-a24e-1d4d15092d3f',
  title: 'Post 2'
}
*/
```

Hope this is useful!

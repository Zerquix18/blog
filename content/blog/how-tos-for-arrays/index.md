---
title: How-To's For Pretty Much ANYTHING You Wanna Do To An Array in JavaScript
description: A compilation of examples to manipulate arrays in Javascript 
date: "2020-03-03T00:00:00.000Z"
tags: javascript
---

We all manipulate arrays, all the time. They're like a small database in your code, and you can do anything you want with it.
It's very easy to forget or not to know how to perform a particular operation. In those cases, we typically google how to do it.

So based on my experience, I thought why not compiling a list of things you usually want do to to an array?

## Adding items

#### Adding a value at the end of the array

To add a value at the end of the array, we use the `push` method.
```javascript
const animals = ["cat", "dog", "snake"];
animals.push("fly");
console.log(animals); // (4) ["cat", "dog", "snake", "fly"]
```

This method **mutates** the original array, so you DON'T have to reassign (`const variable = variable.push("something")`).

#### Adding a value at the start of the array
To add a value at the start of the array, we use the `unshift` method.
This sounds similar to the `shift` method, but that one _removes_ the first element.
```javascript
const animals = ["cat", "dog", "snake"];
animals.unshift("fly");
console.log(animals); // (4) ["fly", "cat", "dog", "snake"]
```

#### Adding a value at the nth position of the array
To add a value at the end position of the array, we use the `splice` method.
```javascript
const animals = ["cat", "dog", "snake"];
animals.splice(1, 0, "fly"); // 1 is the index, 0 is how much to delete and "fly" is how much to insert.
console.log(animals); // (4) ["cat", "fly", "dog", "snake"]
```
`splice` can be confusing as it can add, replace and delete items. It depends on the order of the arguments. You will see more examples of splice in this list.

#### Concatenating / Merging arrays

We use the method `concat` to concatenate arrays.

```javascript
const animals = ["cat", "dog", "snake"];
const moreAnimals = ["fly"];
const allAnimals = animals.concat(moreAnimals);

console.log(allAnimals); // (4) ["cat", "dog", "snake", "fly"]
```

This method **DOES NOT** mutate the array, so you have to create a new variable. This won't work:

```javascript
const animals = ["cat", "dog", "snake"];
const moreAnimals = ["fly"];
animals.concat(moreAnimals); 

console.log(animals); // // ["cat", "dog", "snake"];
```

You can also concatenate multiple arrays by passing more arguments:

```javascript
const animals = ["cat", "dog", "snake"];
const moreAnimals = ["fly"];
const evenMoreAnimals = ["donkey"];

const allAnimals = animals.concat(moreAnimals, evenMoreAnimals);
console.log(allAnimals); // (4) ["cat", "dog", "snake", "fly", "donkey"]
```

## Removing items

#### Removing the first item
We use the `unshift` method to remove the first item:

```javascript
const liquids = ["soda", "water", "apple juice"];
liquids.unshift();

console.log(liquids); // ["water", "apple juice"];
```
This function will mutate the array. So your original variable will change!

As the name suggest, this is the opposite of `shift`, which we saw above.

#### Removing the last item
We use the method `pop` to remove the last item:

```javascript
const liquids = ["soda", "water", "apple juice"];
liquids.pop();

console.log(liquids); // ["soda", "water"];
```

This function MUTATES the array. Be careful!

#### Removing the nth item

We use the `splice` function to remove an item at a particular position.
Let's try to remove the water again:

```javascript
const liquids = ["soda", "water", "apple juice"];
const index = 1; // the position of the water in the array
liquids.splice(index, 1); // the 1 means how many items to delete after this index

console.log(liquids); // ["soda", "apple juice"]
```

`splice` will also mutate the original array.

#### Removing under condition

The function `filter` can be used to remove under a certain condition. It uses a _callback_, which has to return true or false for every item to either keep it or filter it out.

This function will also create a copy of the array:

```javascript
const liquids = ["soda", "water", "apple juice"];
const withoutWater = liquids.filter(liquid => liquid !== "water");

console.log(withoutWater); // ["soda", "apple juice"]
```

#### Removing duplicates

For a flat array of numbers / strings you can just create a new set and convert back to an array:

```javascript
  const numbers = [1, 1, 2, 3, 4, 5];
  const unique = [...new Set(numbers)];

  console.log(unique); // [1, 2, 3, 4, 5]
```

## Updating items

#### Updating the nth item

To update the index at the index n:

```javascript
const liquids = ["soda", "water", "apple juice"];
const index = 0;
liquids[index] = "wine";

console.log(liquids); // ["wine", "water", "apple juice"];
```

#### Updating all items

To update all items we use the `map` method, which returns the updated item:

```javascript
const liquids = ["soda", "water", "apple juice"];
const allWine = liquids.map(liquid => "wine");

console.log(allWine);
```

## Retrieving items

#### Finding an item

We use `indexOf` the index in a flat list of strings or numbers:

```javascript
const liquids = ["soda", "water", "apple juice"];
const index = liquids.indexOf("soda");

console.log(index); // 0
```

In a more complex array, we use `findIndex`:

```javascript
const people = [
  { id: 1, name: "Kate" },
  { id: 2, name: "John" },
  { id: 3, name: "Alex" },
];

const katesIndex = people.findIndex(person => person.name === "Kate");
const kate = people[katesIndex];

console.log(katesIndex, kate); // 0 { id: 1, name: "Kate" }
```

To find the actual object only, without the index, we use `find`: 

```javascript
const people = [
  { id: 1, name: "Kate" },
  { id: 2, name: "John" },
  { id: 3, name: "Alex" },
];

const kate = people.find(person => person.name === "Kate");

console.log(kate); // { id: 1, name: "Kate" }
```

## Checks

#### A particular item exists

We use `includes` to determine if an item exists. This is similar to `indexOf`, but it will give us a boolean instead of the index.

```javascript
const students = ["Kate", "John", "Alex"];
const isAlexHere = students.includes("Alex");

console.log(isAlexHere); // true
```

**Pro-Tip:** You can also use this to reduce conditions like this:

```javascript
  const userInput = "Alex"; // let's pretend
  if (userInput === "Alex" || userInput === "John") {
    console.log('it is alex or john');
  }
```

... to this:

```javascript
  const userInput = "Alex"; // let's pretend
  if (["Alex", "John"].includes(userInput)) {
    console.log('it is alex or john');
  }
```

... especially when there are more people to check.

#### All items pass a condition

We use `every` to determine if all items pass a condition. It receives a callback, which will take every item and you have to return true or false based on the condition.

```javascript
const people = [
  { id: 1, name: "Kate", age: 23 },
  { id: 2, name: "John", age: 25 },
  { id: 3, name: "Alex", age: 27 },
];

const isEveryoneAbove20 = people.every(person => person.age > 20);

console.log(isEveryoneAbove20); // true
```

#### Some items pass a condition

We use `some` to determine if at least 1 item passes a condition. It receives a callback, which will take every item and you have to return true or false based on the condition.

```javascript
const people = [
  { id: 1, name: "Kate", age: 23 },
  { id: 2, name: "John", age: 25 },
  { id: 3, name: "Alex", age: 27 },
];

const isSomeoneAtLeast30 = people.some(person => person.age > 30);

console.log(isSomeoneAtLeast30); // false
```

## Misc

#### Reverse

We use `reverse` to revert the order of an array:

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 9];
numbers.reverse();

console.log(numbers); // [9, 7, 6, 5, 4, 3, 2, 1]
```

#### Sorting an array of numbers

We use the `sort` method to sort things. In a list of numbers, no arguments are required.

```javascript
  const numbers = [3, 4, 7, 1, 2, 9, 5, 6];
  numbers.sort(); // [1, 2, 3, 4, 5, 6, 7, 9];
```

If you need to sort descending, you can just reverse the array:

```javascript
  const numbers = [3, 4, 7, 1, 2, 9, 5, 6];
  numbers.sort();
  numbers.reverse(); // [9, 7, 6, 5, 4, 3, 2, 1]
```

#### Sorting an array of strings

To sort an array of people, we use `sort` with a callback function to compare two items.

My _personal_ favorite is to use `localeCompare`.

```javascript
  const names = ["Luis", "Peter", "Miguel", "Jaime"];
  names.sort((a, b) => a.localeCompare(b));

  console.log(names); // ["Jaime", "Luis", "Miguel", "Peter"]
```

#### Sorting numbers in an array of objects

We will again use `sort` but substract the numbers within our callback function:

```javascript
  const people = [
    { name: "John", age: 20 },
    { name: "Luis", age: 15 },
    { name: "Kate", age: 30 },
    { name: "Johanna", age: 26 },
    { name: "Alex", age: 27 },
  ];

  people.sort((a, b) => a.age - b.age);
  /*
    0: {name: "Luis", age: 15}
    1: {name: "John", age: 20}
    2: {name: "Johanna", age: 26}
    3: {name: "Alex", age: 27}
    4: {name: "Kate", age: 30}
  */
```

#### Sorting an array of strings

To sort an array of strings, we go back to `localeCompare`, but for each item pair in our callback function:

```javascript
  const people = [
    { name: "John", age: 20 },
    { name: "Luis", age: 15 },
    { name: "Kate", age: 30 },
    { name: "Johanna", age: 26 },
    { name: "Alex", age: 27 },
  ];

  people.sort((a, b) => a.name.localeCompare(b.name));
  /*
    0: {name: "Alex", age: 27}
    1: {name: "Johanna", age: 26}
    2: {name: "John", age: 20}
    3: {name: "Kate", age: 30}
    4: {name: "Luis", age: 15}
  */
```

#### Creating a copy

You can copy an array using the `slice` method:

```javascript
  const people = [
    { name: "John", age: 20 },
    { name: "Luis", age: 15 },
    { name: "Kate", age: 30 },
    { name: "Johanna", age: 26 },
    { name: "Alex", age: 27 },
  ];

  const peopleCopy = people.slice();
```

... or the spread operator:

```javascript
  const people = [
    { name: "John", age: 20 },
    { name: "Luis", age: 15 },
    { name: "Kate", age: 30 },
    { name: "Johanna", age: 26 },
    { name: "Alex", age: 27 },
  ];

  const peopleCopy = [...people];
```

Copying is going to be important if you want to perform operations that will mutate the array:

```javascript
  const originalPeople = [
    { name: "Luis", age: 21 },
    { name: "Vicky", age: 20 },
  ];

  const people = [...originalPeople];
  people.push({ name: "Luz", age: 35 });

  console.log(originalPeople, people);

  /**
    0: {name: "Luis", age: 21}
    1: {name: "Vicky", age: 20}
  **/

  /**
    0: {name: "Luis", age: 21}
    1: {name: "Vicky", age: 20}
    2: {name: "Luz", age: 35}
  **/

```


#### Accumulating values

We use `reduce` to loop an array while keeping track of a particular value.
It accepts a callback with two arguments: An accumulator, and the current value:

The `accumulator` will be the value we carry on throughout the process.
The `current` value is the present item beeing looped.
The return value is going to be the new `accumulator` value.

For instance, if you want to sum all the numbers of an array: 

```javascript
  const numbers = [1, 2, 3, 4, 5];
  const sum = numbers.reduce((total, current) => total + current);

  console.log(sum); // 15
```

This is how the average of a list is usually calculated:

```javascript
  const numbers = [2, 3, 2, 3, 2];
  const sum = numbers.reduce((total, current) => total + current);
  const average = sum / numbers.length;

  console.log(average); // 2.4
```

#### Looping

Regular loops can be done with `forEach`:

```javascript
  const couple = [
    { name: "Luis", age: 21 },
    { name: "Vicky", age: 20 },
  ];
  

  couple.forEach((person, index) => {
    console.log(person, index);
  });

  /**
    {name: "Luis", age: 21} 0
    {name: "Vicky", age: 20} 1
  **/

```

Hope that was helpful!
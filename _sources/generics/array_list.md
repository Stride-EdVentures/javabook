# ArrayList

The class `ArrayList` is a special type of class called a `Generic`. In this lesson, we won't go into the details of how generics work. Instead, we will focus on why and how to use the class `ArrayList`.  

## Overview

The `ArrayList` class provides _array like_ behavior with some added benefits. It also introduces a new syntax that involves **&lt;angle brackets&gt;**. The easiest way to figure this stuff out is by example.  
```java
// We create a new ArrayList capable of holding Strings.
// We must have `<String>` added to the class name.
// The constructor must have <>. 
// As all constructors must have, the constructor also has ().
ArrayList<String> list = new ArrayList<>()|
list.add("At index 0");
list.add("At index 1");

// arrays use `.length`. ArrayList uses `.size()`
System.out.printf("The size of our list is %d\n", list.size());
System.out.printf("The first item in our list is %s\n", list.get(0));
```

A few things to note:  
* The declaration requires that we provide the type of object in the ArrayList  
* An `ArrayList` can hold any type of object we want, but it **must** be an `Object`.  
* We don't provide the size of the array in the constructor. Instead, the size of the list will grow & shrink automatically.  
* We don't index into the list as we do in an array. We do **not** use `[]`. Instead, we use API such as `add` and `get`.  

## More API
There are many cool things about an `ArrayList`:  
1. It holds any `Object` type
2. It grows and shrinks automatically for us  
3. It has utility API that provide many useful behaviors  

Here are some popular API:  
|API|Description|
|---|-----------|
|arr.add(object)|	// adds an object at the end|
|arr.get(index)|			// gets the object at index|
|arr.set(index, object)|	// sets the value at index|
|arr.add(index, object)|	// insert an object at index|
|arr.remove(index)|			// removes the object at index|
|arr.remove(object)|		// removes the object from arr|
|arr.size()|				// gets the size of the array|
|arr.clear()|				// removes ALL elements from the array|
|arr.contains(object)|		// asks if an object is in array using .equals()|
|arr.indexOf(object)|		// finds index of the object|
|arr.isEmpty()|				// asks if the array is empty|

## Practical Exploration
Here are just a few ways create an `ArrayList`.  
```java
// repeat the object type in the constructor
ArrayList<Integer> list = new ArrayList<Integer>();

// allow the compiler to infer the object type at the constructor
ArrayList<Integer> list = new ArrayList<>();

// assign the ArrayList to the List interface
List<Integer> list = new ArrayList<>();

// Use the Arrays helper to create a FIXED sized List
// This is technically not an ArrayList
List<String> list = Arrays.asList("Hello", "World!");
```


## What's so Important? ![Billy](../_static/whats_so_important.png)
Things to remember:  
* one  
* two  
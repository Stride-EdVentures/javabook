# Maps

## Introduction
A `Map` is an `interface` that offers a data structure that acts a lot like an array except that the indices do not have to be integers. 

Let's say that you want to the ability to look up the age of individuals using their unique name. One way to solve this with arrays is to have two parallel arrays as follows: 

```java
int[] ages = { 15, 18, 3, 4 };
String[] names = { "Rishitha", "Zainab", "Prithu", "George" };

// look up the age of `name`
for (int i = 0; i < names.length; i++) {
    if (names[i].equals(name)) {
        System.out.printf("Age is %d\n", ages[i]);
    }
}
```
The above code take O(n) time to sequentially search the array. It is slow and long.

Wouldn't it be great if we could have a fast and "special" array where the *index* was the name? Then, to look up the age we'd greatly simply the code to be:
```java
// Code to create special "array" is not shown
SpecialArray[] special = ... ;

// Look up the age of `name`
System.out.printf("Age is %d\n", special[name]);
```
The above code takes O(1) and has no loops! **Maps** allow us to accomplish the same thing, but we need to use generics syntax and use APIs for indexing. Furthermore, just like with `ArrayList`, we are restricted to `Object` types. Here is how the `Map` code would look:
```java
// Create a map where the Index (or Key) is a String
// and the Value is an Integer.
Map<String, Integer> map = new HashMap<>();
map.put("Rishitha", 15);   // special["Rishitha"] = 15
map.put("Zainab", 18);     // special["Zainab"] = 18
map.put("Prithu", 3);      // special["Prithu"] = 3
map.put("George", 4);      // special["George"] = 4

// Look up the age of `name`
System.out.printf("Age is %d\n", map.get(name));
```

## Working with Maps

## Concrete Maps

Here we will look at the two most popular implementations for a Map. In this example, we will have the following Key/Values.  
![Key Values](../_static/key_values_in_map.png)  

### HashMap
The Keys and Values are stored in a node in a Hash Table. It is beyond the scope of this lesson to discuss [Hashing](https://cse163.github.io/book/module-9-miscellaneous-topics/lesson-26-reading-hashing/index.html). 
![HashMap](../_static/hashtable.png)  
What we hope to illustrate here is that because a `HashMap` uses a hash table to store its nodes, we get the following characteristics:  
* Getting, Adding and Removing a key/value is O(1)  
* There is no predictable enumeration order to the keys in a `HashMap`.  


### TreeMap
The Keys and Values are stored in a node in a Binary Search Tree. (Balanced using Red-Black Tree algorithms) 
![TreeMap](../_static/bst_map.png)  
Because the nodes are stored in a Binary Search Tree, we get the following characteristics:  
* Getting, Adding and Removing a key/value is **O(ln N)**  
* The keys can be enumerated in a predictable, sorted order.  

### LinkedHashMap
In this...
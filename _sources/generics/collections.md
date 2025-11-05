# Collections

In this lesson we will learn about the `Java Collection Framework`. There are many `abstract` classes, concrete classes, and interfaces that make up the framework.

We will look at a class hierarchy showing `interfaces`, `abstract` classes, and concrete classes. The point is to see how code is shared by using the abstract classes, and behaviors are provided by classes not necessarily in the same path.  

We also want to review the most fundamental data structures.  

## Lists, Sets and Maps
The most popular Collection classes are Lists, Sets and Maps.

As we've seen, a `List` behaves like a dynamically sized array. One can index into it using integer values (e.g. `list.get(3)`). The list has order as the items are stored at indices 0 to n.
|Index|Element|
|-----|-------|
|0|Item0|
|1|Item1|
|2|Item2|
|3|Item3|

A `Set` is a very simple collection of object. It is very much like a set in mathematics. There is **no order** to the items. The main thing you do with a set is to `add` and `remove` items. You can also `clear` it, get its `size`, and see if the set `contains` an item already.  
|This is a Set|
|-------------|
|{ Item2, Item1, Item0, Item3 }|  

A `Map` behaves like an array where the index must be an `Object` instead of an `int`. [See Maps](maps)  
![Friendly Map](../_static/map_illustration.png)

## Quick Summary
There are many Collection classes. Here are the top three types.  

|Collection<br>interface|Description|Example Concrete Class|
|-----------------------|-----------|----------------------|
|List|Like an array, but it grows and shrinks, and has helper methods.<br>Indexed with integer values.|ArrayList&lt;String&gt;<br>LinkedLIst&lt;String&gt;|
|Set|Like a List, but no duplicates are allowed.<br>There is no predictable order in a HashSet<br>One will add to it and check if the set contains something.|HashSet&lt;String&gt;|
|Map|Like a List, but the index can be any Object<br>Key order depends on the concrete class|HashMap&lt;String&gt;<br>TreeMap&lt;String&gt;|



## Fundamental Structures
We will use conceptual names that map to `interfaces`. And we will show the most popular types of classes used to implement that behavior.  
|Type|Class|Notes|
|----|-----|-----|
|List|ArrayList| |
|    |LinkedList|  |
|Queue|LinkedList| |
|     |ArrayDeque| |
|Stack|Stack|`Stack` is a concrete class. Slow.| 
|     |LinkedList|Acts as both a Stack and a Queue via interface `Deque`|
|     |ArrayDeque|Acts as both a Stack and a Queue via interface `Deque`| 
|Set|HashSet| |
|   |TreeSet| |
|Map|HashMap| |
|   |TreeMap| |  

Here we see the class hierarchy of many classes in the Java Collections Framework.
![Collection Classes](../_static/collections.png)  


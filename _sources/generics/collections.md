# Collections

In this lesson we will learn about the `Java Collection Framework`. There are many `abstract` classes, concrete classes, and interfaces that make up the framework.

We will look at a class hierarchy showing `interfaces`, `abstract` classes, and concrete classes. The point is to see how code is shared by using the abstract classes, and behaviors are provided by classes not necessarily in the same path.  

We also want to review the most fundamental data structures.  

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
![Collection Classes](../_static/collections.png)  

## Maps 
TODO: Have a Map page that discusses how they work. Put some of this information there.   

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
# Lesson G1: ArrayList

The class `ArrayList` is a special type of class called a `Generic`. In this lesson, we won't go into the details of how generics work. Instead, we will focus on why and how to use the class `ArrayList`.  

## Overview

The `ArrayList` class provides _array like_ behavior with some added benefits. Its constructor introduces a new syntax that involves **&lt;angle brackets&gt;**. The easiest way to figure this stuff out is by example.  
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
* We don't provide the size of the array in the constructor.<a href="#footnotes"><sup>[1]</sup></a> Instead, the size of the list will grow & shrink automatically.  
* We don't index into the list as we do in an array. We do **not** use `[]`. Instead, we use API such as `add` and `get`.  

## More API
There are many cool things about an `ArrayList`:  
1. It holds any `Object` type
2. It grows and shrinks automatically for us  
3. It has utility API that provide many useful behaviors  

Here are some popular API:  
|API|Description|
|---|-----------|
|arr.add(object)|	adds an object at the end|
|arr.get(index)|			gets the object at index|
|arr.set(index, object)|	sets the value at index|
|arr.add(index, object)|	insert an object at index|
|arr.remove(index)|			removes the object at index|
|arr.remove(object)|		removes the object from arr|
|arr.size()|				gets the count of elements in arr|
|arr.clear()|				removes ALL elements from the array|
|arr.contains(object)|		asks if an object is in array using .equals()|
|arr.indexOf(object)|		finds index of the object|
|arr.isEmpty()|				asks if the array is empty|

## Practical Exploration
Here are just a few ways create an `ArrayList`.  
```java
// repeat the object type in the constructor's <angle brackets>
ArrayList<Integer> list = new ArrayList<Integer>();

// allow the compiler to infer the object type
ArrayList<Integer> list = new ArrayList<>();

// Assign the ArrayList to the List interface.
// Set ArrayList's initial capacity to 100.
List<Integer> list = new ArrayList<>(100);

// Pass in a fixed-size list into the ArrayList constructor
List<String> list = new ArrayList<>(Arrays.asList("Hello", "World!"));
```

## Wrapper Types
Generics do **not** work with primitive types; they must work with `Object` types. Java has come to our rescue and made it easy for us to contain primitive types by offering Wrapper Classes for each. Here are the most common: `Integer`, `Double`, `Boolean` and `Character`. These classes offer lots of helpful methods.  

**Key points about these wrapper classes:**
* All wrapper classes are *immutable* - their values cannot be changed after creation  
* All extend `Object`, so they can be used in generic collections  
* They provide useful static methods (like `Integer.parseInt()`, `Double.valueOf()`)  
* Autoboxing automatically converts primitives to wrappers: `Integer i = 5;`  
* Auto-unboxing automatically converts wrappers to primitives: `int x = Integer.valueOf(5);`  
* All wrapper classes (except `Character`) can be constructed from `String` representations  
* They all override `equals()` and `toString()` methods appropriately  

### Construction of Wrapper Classes
The Wrapper classes are generally instantiated implicitly through automatic Boxing (shown below). At times it can can be helpful to one's understanding to explicitly instantiate a wrapper class. There are several ways to explicitly convert from the primitive type to the wrapper class. Most approaches have the same result meaning that developers can choose their favorite. However, for performance reasons, it is not good to call `new Integer(value)`. This is because `new` will be slow as it goes through the entire process of allocating memory for a newly created object. Using `valueOf` makes use of the *Factory Pattern* to provide an object from a set of pre-cached values.  
```java
   // BAD: Slow and deprecated, but allowed. Do NOT use.
   Integer n1 = new Integer(7);

   // Explicitly invoke valueOf
   Integer n3 = Integer.valueOf(3);

   // Casting will also invoke valueOf
   Integer n2 = (Integer) 4;

   // Automatic Boxing (also invokes valueOf)
   Integer n4 = 8;

   // Explicitly invoke intValue
   int x1 = n1.intValue();

   // Casting will invoke intValue
   int x2 = (int) n1;

   // Automatic Unboxing (also invokes intValue)
   int x3 = n1;
```

### Integer from String
The Wrapper Classes offer construction from a `String`: 
* **valueOf**: `Integer i1 = Integer.valueOf("123");`  
    * Each wrapper class has a `valueOf` method.  
* **parsing**: `Integer i2 = Integer.parseInt("123");`  
    * Other wrapper classes have similar, but not identical method names. e.g. `Double.parseDouble`  
* **Boxing**: `Integer i3 = 4;`  

A Wrapper class is a class that has very little functionality. Think of it as a gift box that holds the actual item. In this image, we see a wrapper class that holds the primitive `int`. To get the primitive value into the wrapper class we have to *Box* it. To extract the primitive value from the wrapper class we *Unbox* it.  
![Integer Wrapper](../_static/int_wrapper_box.png)  

### Boxing & Unboxing
Boxing and unboxing are Java's automatic conversion mechanisms between primitive types and their corresponding wrapper classes. Boxing occurs when Java automatically converts a primitive value (like `int`, `double`, or `boolean`) into its wrapper object (like `Integer`, `Double`, or `Boolean`), while unboxing is the reverse process where wrapper objects are automatically converted back to their primitive equivalents.  

Understanding boxing and unboxing is crucial because while it makes code more convenient to write, it can impact performance in certain scenarios since object creation and method calls have more overhead than primitive operations.
```java
// This work due to autoboxing/unboxing:
ArrayList<Integer> numbers = new ArrayList<>();
numbers.add(42);             // autoboxing: int → Integer

// We can also auto-unbox
int value = numbers.get(0);  // auto-unboxing: Integer → int

// Explicit Boxing
Integer num = Integer.valueOf(100);
Character ch = Character.valueOf('A');
Double d = (Double) 3.141;

// Explicit Unboxing
int n = num.intValue();

// NOT Boxing. Uses cached Boolean object
Boolean flag = Boolean.TRUE;

// Autoboxing, but NOT unboxing.
// The primitive 4 is boxed.
// The result is the primitive boolean
boolean present = list.contains(4);

// Boolean.TRUE is a cached Boolean object.
// There is no boxing or unboxing going on here.
Boolean flag = Boolean.TRUE;
```

Oracle's official documentation, and some technical resources, often reserve **Boxing** specifically for the *automatic* (or *implicit*) conversion done by the compiler. Oracle will not consider "Explicit Boxing" as boxing at all. However, there is no consensus on this terminology.  

This site has chosen to declare that there are two ways to **Box** or **Unbox**:  
* **Implicit** or **Automatic**: The compiler does it automatically for the developer.  
* **Explicit** or **Manual**: The developer explicitly puts the primitive into the Wrapper Class.  

## What's so Important? ![Billy](../_static/whats_so_important.png)
Things to remember:  
* Creating an `ArrayList` uses &lt;angle brackets&gt; and parentheses. It a bit wonky.  
    * Example: `ArrayList<Double> list = new ArrayList<>();`
* You cannot use `[]` (brackets) on the `ArrayList`. It is not an actual array.
    * Instead, use the API `add`, `get` and `set`.    
    * Example: `list2.set(2, list1.get(2));`
* Only `Object` types can be contained inside the `ArrayList`  
    * If you want to store `int` values, use the wrapper class `Integer`  
    * Java will automatically **Box** and **Unbox** primitives for you   
* Use `size()` to see how many elements are in the `ArrayList`  
* The ArrayList will automatically grow and shrink.  
    * `list.remove(1);` // removes the element at index 1 and the other elements at index 2+ will slide into place.  


## Footnotes
[1] The constructor for `ArrayList` can take an integer argument. Most students think that this is the size of the array, and to some degree they're right! It is the *initial* size of the underlying `array`, but it is not the count of elements currently in the `ArrayList` (the value returned by the method `size()`). It gets a bit complicated.  

```java
    // create a list that can hold 101 dalmatians
    ArrayList<Dog> dalmatians = new ArrayList<>(101);

    // size() == 0.  The capacity of the list starts out as 101.
    // This prints: Count of dogs in the list is: 0
    System.out.printf("Count of dogs in the list is: %d\n", dalmatians.size()); 
```

The `ArrayList` is implemented with an underlying `array` and the size of the underlying array is **not** the same as the `size()` of the ArrayList. The `size()` of an ArrayList is the count of elements that have been added to the array that can be safely indexed. When the user adds enough elements to exceed the size of the underlying array, a new array needs to be constructed, and all the elements in the array need to be copied over. This process is expensive and work is done to minimize the occurrence.  

The `ArrayList` will start off with a default capacity of 10. When the 11th element is added, the ArrayList will double its size to 20. When the 21st element is added, it is doubled again to 40. So on and so forth until the size growth is beyond memory limits.  

[2] `Arrays.asList` is a convenient way to create a `List`. 
```java
// Use the Arrays helper to create a list tht has a FIXED-SIZED.
// In this List, elements cannot be added or removed.
// This is not an ArrayList. It is a limited List.
List<String> list = Arrays.asList("Hello", "World!");
list.add("Illegal"); // ❌ throws UnsupportedOperationException
```
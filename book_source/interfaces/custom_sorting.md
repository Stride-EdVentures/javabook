# Custom Sorting

Recall:  
🔹 A method can be passed in as an argument.  
🔹 When an argument is a method, its *Type* is an `interface`.    
🔹 `Comparable` is an `interface` that allows an object to set its own sort order.  

Arguments to a method can be:
* A primitive type (e.g. `int`, `double`)  
* A `class` (e.g. `String`)  
* An `interface` 

When an argument is a `class`, we can call methods on that class.  
When an argument is an `interface`, we do the same thing!

In this lesson you'll see how using an `interface` affords us power and flexibility.

## Overview

The goals of this lesson are to:  
🔹 Learn how to _tersely_ pass a function (a *behavior*) to another method.  
🔹 Learn how to create an interface using a `Method Pointer`.  
🔹 Sort a List in multiple, custom ways.   

## Function&lt;R, T&gt;
Let's look at an the generic interface, `Function <R, T>`. This interface has one `abstract` method named `apply`. Because it has exactly one abstract method, we call it a `Functional Interface`. There are many interfaces that are Functional Interfaces. 

```java
/**
 * The function TAKES something of type T
 * The function RETURNS something of type R
 */
public interface Function<T, R> {

    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument. The function TAKES something of type T
     * @return the function result. The function RETURNS something of type R
     */
    R apply(T t);

    // Other stuff not shown as it is beyond the scope of this lesson
}
```
### Implementing Function&lt;R, T&gt;

The code below shows two classes.  

The `Example` class calls a method that takes a single argument named `behavior` that has the *Type* `Function<Integer, String>`. The *type* is a *generic* interface that is defined above. 

The `TempClass` implements the interface. 

Several things to note:  
* The method `userProvidedBehavior` treats the argument `behavior` exactly as it would a class. It simply dereferences the object and calls the method `apply`.  
* `main` invokes `userProvidedBehavior` and passes in an instance of `TempClass`. Because `TempClass` **IS-A** `Function<Integer, String>` there is no need to explicitly cast the instance when calling `userProvidedBehavior`.   
* For all intents and purposes, we could accomplished the same thing without interfaces at all. We could have simply implemented `useProvidedBehavior(TempClass behavior)`.   

```java
public class Example {
  public static void main(String[] args) {
     useProvidedBehavior(new TempClass());
  }

  public static void useProvidedBehavior(Function<Integer, String> behavior) {
     System.out.println(behavior.apply(5));
  }
}

public class TempClass implements Function<Integer, String> {
  public String apply(Integer n) {
     return "n = " + n;
  }
}
```

The code above is relatively straight forward. It doesn't do anything fancy. We are simply invoking a method on an interface that is implemented by `TempClass`. 

**So, why use interfaces at all?**  

To answer this question, we must first learn about **method references**, something that partners very well with interfaces and makes a world of difference.  

## Method Reference
Java provides a shorthand way to refer to methods of functional interfaces. Method references allow the developer to tersely implement an interface by simply referencing an existing method with the correct signature.  

```{admonition} Static Method Reference
:class: note
**Syntax:** `ClassName::staticMethodName`
```

Let's rewrite the code found above using a `method reference`. The code behaves exactly the same as above, only now we don't have to create a whole new class that implements the desired interface. 
```{code-block} java
:linenos: 
:emphasize-lines: 3, 7, 10
public class Example {
  public static void main(String[] args) {
     useProvidedBehavior(Example::getStringFromInt);
  }

  public static void useProvidedBehavior(Function<Integer, String> behavior) {
     System.out.println(behavior.apply(5));
  }

  public static String getStringFromInt(Integer n) {
     return "n = " + n;
  }
}
```
A few things to note:  
* Using Method References allows for the code to be cleaner and more concise.  
* On line 3: We created a reference to a static method using the `ClassName::methodName` syntax.  
* On line 7: The method `getStringFromInt` has the same signature as the `apply` method in `Function<Integer, String>`. It takes a single `Integer` and returns a `String`.  
* On line 7: The `apply` method is called normally. There are no changes to the way we invoke a method in an interface, even if it is fulfilled by a method reference. The identifier `behavior` is an `interface` and we invoke its methods the same way we would invoke a method belonging to a class.  
* On line 7: When the `apply` method is called, the method named `getStringFromInt` is invoked! Clearly it has a different name and `apply`!  

The fact that `getStringFromInt` is invoked when we call `behavior.apply` can be mind blowing. Let's dig a little deeper into that.  

### Conceptual Code
In the above example, the compiler **conceptually** creates a class for you. The class implements the desired interface by calling the static method as follows:    
```java
public class HasNoNameClass implements Function<Integer, String> {
  public String apply(Integer n) {
    return Example.intToString(n);
  }
}
```
In _reality_, this is not what happens. The Java compiler takes some short cuts and calls the method directly without the need to create any class. However, the above does explain how it is that `apply` is called, but `intToString` is invoked.  

### Remember: Interfaces are _Types_
We use an `interface` to represent the _TYPE_ of a function. 
The supplied function must match the arguments and return types as defined in the interface.

```java
// TYPE is an interface
public void myMethod(TYPE interfase) {
  // method is in the interface. Invoke it this way.
  interfase.method();
}
```

## Using the Comparator
It is common to sort objects. The interface `Comparator` helps us to customize the order of the sort.  

```{admonition} Comparator
A comparator is an `interface` implemented by an _outsider_ that knows how to compare two objects.
![Comparator](../_static/comparator.jpg)  
_"Yes, children. I am comparing you to one another. That's why they call me 'The Comparator!'"_  
```java
public interface Comparator<T> {
   /**
    * Compares its two arguments to establish order.  
    * Returns a negative integer when the first argument is less than the second.
    * Returns zero when the arguments are equal.
    * Returns a positive integer when the first argument is greater than the second.
    *
    * @param o1 the first object to be compared.
    * @param o2 the second object to be compared.
    * @return an integer whose sign indicates the comparison result
    */
   int compare(T o1, T o2);
```
Let's discuss how this works using the most simple example possible. Let's implement a `Comparator<Integer>`.

```java
public class SimpleExample implements Comparator<Integer> {
  public int compare(Integer i1, Integer i2) {
    if (i1 < i2) {
      return -1;  // any negative number will work
    }
    if (i1 > i2) {
      return 1;   // any positive number will work
    }
    return 0;     // the Integers are equal
  }
}
```
While the above code works, we can implement it more concisely using an convenient property of arithmetic.  
```java
public class SimpleExample implements Comparator<Integer> {
  // This method does the same job as the code above!
  public int compare(Integer i1, Integer i2) {
    // if i1 < i2, this results in a negative value
    // if i1 > i2, this results in a positive value
    return i1 - i2;
  }

  public void sortList(List<Integer> list) {
    // Use the Comparator implemented in the class SimpleExample
    // to sort the List of Integers.
    list.sort(this::compare);
  }
} 
```
The implementation of `compare` is very concise! The implementation is the same as the `Natural Order` of Integers. In other words, we know that `1 < 2`, and comparing 1 to 2 should result in a negative value. Allowing Integers to order themselves will result in a list going from smallest to largest as we would expect. 

```{admonition} Natural Order
:class: Note
The **Natural Order** of an object is, by definition, the ordering we would get by allowing the objects to order themselves. Objects can determine the order by implementing the `Comparable<T>` interface shown below. The `Integer` class implements this interface; the _Natural Order_ of Integers is implemented as shown below.  

```java
public interface Comparable<T> {
  int compareTo(T other);
}

public class Integer implements Comparable<Integer> {
  public int compareTo(Integer other) {
    return this - other;
  }
}
```

### Reverse Comparator
Let's illustrate how we can quickly sort a list of Integers in reverse order using a `method reference` that provides the `Comparator`. Note that all of the methods below are instance methods.   
```java
  public void sortListInReverse(List<Integer> list) {
    // Provide the Comparator via a method reference
    // These two lines effectively do the same thing
    list.sort(this::inReverseOrder);
    list.sort(this::oppositeNatural);
  }

  public int inReverseOrder(Integer i1, Integer i2) {
    // Note that the natural order would be i1 - i2
    return i2 - i1;
  }

  public int oppositeNatural(Integer i1, Integer i2) {
    // Reverse the natural order by puting `i2` first.
    // This method has the same results as the method `inReverseOrder`
    return i2.compareTo(i1);
  }
```

### Comparing Kids
In the prior lesson, we used classes to sort `Kid` objects. Now let's use interfaces to sort kids. In the example code below, we will have kids provide their own order by implementing `Comparable`, and we'll sort them in multiple ways using multiple `Comparator`s fulfilled in various ways.  

```java
public class Person {
  public int height; // in inches
  public int age;    // in years
}

public class Kid extends Person implements Comparable<Kid> {
  public int cuteness;
  public double gpa;
  public boolean whinesTooMuch() { ... }
  public void beLazy() { ... }
  public void pretendToStudy() { ... }

  // Comparable: The Natural Order. Kids will order by age. 
  public int compareTo(Kid other) {
    return this.age - other.age;
  }
}

public class Dad implements Comparator<Kid> {
  // Let's implement the sorting method directly to see how it works internally.
  public void sortKids(List<Kid> kids, Comparator<Kid> comparator) {
    for (int index = 1; index < kids.size(); index++) {
      // slide the nth kid into the correct place
      for (int n = index; n > 0 && kidLessThan(kids.get(n), kids.get(n-1), comparator); n--) {
        // swap kid n with (n - 1)
        Kid temp = kids.get(n);
        kids.set(n, kids.get(n - 1));
        kids.set(n - 1, temp);
      }
    }
  }  

  // returns true if k1 < k2. Use natural order if comparator is null.
  private boolean kidLessThan(Kid k1, Kid k2, Comparator<Kid> comparator) {
    if (comparator == null) {
      // Ask the first Kid to provide the order by calling Comparable.compareTo
      return k1.compareTo(k2) < 0;
    } else {
      return comparator.compare(k1, k2) < 0;
    }
  }

  // The class Dad implements Comparator<Kid>. Sort by cuteness.
  public int compare(Kid k1, Kid k2) {
    return k1.cuteness - k2.cuteness;
  }

  // sort the list of kids in 4 different ways
  public void sortList(List<Kid> list) {
    // Sort as Dad wants to, by cuteness.
    // "this" IS-A comparator<Kid>. i.e. Dad implements Comparator<Kid>.
    // By passing in "this", we are passing in the Comparator implemented by "this".
    sortKids(list, this);

    // Passing in null signals that we want to sort in the Kid's natural order (by age).
    sortKids(list, null);

    // Sort by height. Using an instance method reference.
    sortKids(list, this::useHeight);

    // Sort by whiney then by cuteness. Using a static method reference.
    sortKids(list, Dad::useWhineyThenCuteness);
  }

  public int useHeight(Kid k1, Kid k2) {
    return k1.height - k2.height;
  }

  public static int useWhineyThenCuteness(Kid k1, Kid k2) {
    // Primarily, have the whiney Kid be "less than"
    if (k1.whinesTooMuch() == k2.whinesTooMuch()) {
      // They both whine or both don't whine.
      // cannot determine by whineyness. Use Cuteness.
      return k1.cuteness - k2.cuteness;
    } else if (k1.whinesTooMuch()) {
      // k1 is whiney and therefore "less than" k2.
      return -1;
    } else {
      return 1;
    }
  }
}
```

### Sorting Strings Strangely
TODO: Write up code that shows how to sort a set of strings in weird ways.  

## Methods that use Comparator

| Method or Field | Description |
|-----------------|-------------|
| Arrays.binarySearch(array, value, comparator) | Returns the index of the given value, assuming the elements are sorted in the ordering of the comparator. |
| Arrays.sort(array, comparator)|Sorts the array in the ordering of the comparator.|
|Collections.binarySearch(list, value, comparator)| Returns the index of the given value, assuming the elements are sorted in the ordering of the comparator.|
| Collections.sort(list, comparator) | Sorts the specified list according to the comparator. |
| List.sort(comparator) | Sorts the list in-place using the provided comparator. |
| Stream.sorted(comparator) | Returns a stream with elements sorted according to the comparator. |
| Collections.reverseOrder() | Returns a Comparator that will sort items in reverse relativel to their natural ordering. |
| Collections.reverseOrder(comparator) | Returns a Comparator that compares objects in the opposite order relative to the given comparator. |
| String.CASE_INSENSITIVE_ORDER | A static field that provides a Comparator that is case-insensitive when comparing Strings. |
| Collections.max(collection, comparator) | Returns the maximum element of the collection according to the comparator. |
| Comparator.thenComparing(Comparator) | Returns a Comparator that first uses the current comparator, then uses the specified one if values are equal. |

## Types of Method References
While there are four ways to reference a method, here we look at only the two most common.   

1. **Static Method Reference**  

**Syntax:** `ClassName::staticMethodName`  

This syntax is used to refer to a static method of a class.
```java
public class Example {
  public static void main(String[] args) {
    callIt(Integer::parseInt);
  }

  public static callIt(Function<String, Integer> fn) {
    // This will output the integer value: 125
    System.out.println(fn.apply("123") + 2);
  }
}
```

2. **Instance Method Reference** (of a particular object)  

**Syntax:** `instance::instanceMethodName`  

This syntax is used to refer to an instance method of a specific object. Note that `this` can be the specific object! The example code below shows three object instances.   
* An instance of `Example` class. The instance is the identfier `ex`.  
* An instance of `this`, an instance of `Example`.  
* An instance of a `PrintStream` on the `System` class. Note that `System.out` is a static field of `PrintStream`.    
   
```java
public class Example {
  private int n;

  // Constructor setting the instance field
  public Example(int n) {
    this.n = n;
  }

  // Note that `example` is an instance method. "this" exists.
  public int example() {
    this.n = 1;
    Example ex = new Example(5);    // create another instance of Example

    // reference "this" instance and the instance `ex`.
    callIt(this::convert);          // prints "Sum is 21"
    callIt(ex::convert);            // prints "Sum is 25"

    // `out` is a static field of PrintStream on the System class.
    // Therefore, System.out::println references an instance method.
    consumeIt(System.out::println);
  }

  public static consumeIt(Consumer<String> fn) {
    fn.accept("In our example, this will be printed");
  }

  public static callIt(Function<Integer, String> fn) {
    System.out.println(fn.apply(20));
  }

  private String convert(Integer x) {
    // add the argument to "this" instance's n-value
    return "Sum is " + (x + this.n);
  }
}
```


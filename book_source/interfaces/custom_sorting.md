# Custom Sorting

Recall:  
🔹 A method can be passed in as an argument.  
🔹 An interface is the *Type* of the argument that is a method.  
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
🔹 Learn how to tersely pass a function (a *behavior*) to another method.  
🔹 Learn how to create an interface using a `Method Pointer`.  
🔹 Sort a List in multiple, custom ways.   

## Function&lt;R, T&gt;
Let's look at an the generic `Function <R, T>` interface. This interface has one `abstract` method named `apply`. Because it has exactly one abstract method, we call it a `Functional Interface`. There are many interfaces that are Functional Interface. 

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

So, why use interfaces at all?  


# Custom Sorting

A method can be passed in as an argument.
An interface is the *Type* of the argument that is a method.
`Comparator` is an `interface` that allows one to customize sorting.

## Overview

The goal of this lesson is to pass a function (a *behavior*) to the `sort` method as an argument so that we can fully customize the sorting behavior. Furthermore, passing in the `Comparator` into the `sort` method allows us to sort objects that might otherwise not be *sortable*. Passing in the Comparator allows us to define how an object can be sorted.        

Arguments to a method can be:
* A Primitive type (e.g. `int`, `double`)  
* A Class (e.g. `String`)  
* An Interface  

When an argument is a `class`, we can call methods on that class.
When an argument is an `interface`, we can do the same thing!

Using an interface affords us much more flexibility.

## Function&lt;R, T&gt;
Let's look at an the `Function <R, T>` interface. 
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

```{admonition} Other methods
:class: dropdown seealso
The `Function<T,R>` interface has other methods such as `andThen` and `compose`. 
These other methods are `default` methods, meaning that the functionality is actually
provided for you. The syntax can look pretty wonky!!  

We will revisit this code before the end of this chapter, and, hopefully, by then
you'll be able to read and fully understand the code.
```java
    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
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

The code above is relatively straight forward. It doesn't do anything fancy. We are simply invoking a method on an interface that is implemented by a class. 

So, why use interfaces at all?  


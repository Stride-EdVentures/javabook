# Custom Sorting

A method can be passed in as an argument.
An interface is the *Type* of the argument that is a method.
`Comparator` is an `interface` that allows one to customize sorting.

## Overview

The goals of this lesson are to:  
🔹 Learn how an `interface` can be beneficial.  
🔹 Learn how to pass a function (a *behavior*) to another method.  
🔹 Learn how to create an interface with a `Method Pointer`.  
🔹 Sort a List in multiple, custom ways.   

## Sorting Kids
Let's start off by sorting my kids. Let's say that we have the following code:  
```java
public class Person {
  public int height; // in inches
  public int age;    // in years
}

public class Kid extends Person {
  public int cuteness;
  public double gpa;
  public boolean whinesTooMuch() { ... }
  public void beLazy() { ... }
  public void pretendToStudy() { ... }
}

public class Dad extends Person {
  private List<Kid> kids = new ArrayList<>();

  /*
   * returns true if kid at index i1 is less than kid at index i2
   */ 
  private boolean kidLessThan(int i1, int i2) {
    /* implementation not shown */
  }

  // Sort using the insertion sort algorithm
  public void sortKids() {
     for (int index = 1; index < kids.size(); index++) {
        // slide the nth kid into the correct place
        for (int n = index; n > 0 && kidLessThan(n, n-1); n--) {
           // swap kid n with (n - 1)
           Kid temp = kids.get(n);
           kids.set(n, kids.get(n - 1));
           kids.set(n - 1, temp);
        }
     }
  }
}
```
This code is pretty good in that it allows Dad to sort the kids according to the comparison code found in `kidLessThan`. Here are three different implementations:  
```java
private boolean kidLessThan(int i1, int i2) {
  // compare by height
  return kids.get(i1).height < kids.get(i2).height;
}

private boolean kidLessThan(int i1, int i2) {
  // compare by age
  return kids.get(i1).age < kids.get(i2).age;
}

private boolean kidLessThan(int i1, int i2) {
  // compare by first by whining, secondarily by cuteness
  if (kids.get(i1).whinesTooMuch() == kids.get(i2).whinesTooMuch()) {
    // if they whine the same amount, use the cuteness
    return kids.get(i1).cuteness < kids.get(i2).cuteness;
  }
  // With different whining, the lesser kid whines too much.
  return kids.get(i1).whinesTooMuch();
}
```
We can choose to sort our kids in any way, **BUT** in only **one** way. We can't
have three simultaneous implementations of `kidLessThan`. How can we get around this
implementation?  

### Class Implements Comparator
We can pass in an object that implements the method `kidLessThan`. Let's look at what that code.  

```java
public abstract class CompareKids {
  public boolean kidLessThan(Kid k1, Kid k2);
}

public class CompareByHeight {
  public boolean kidLessThan(Kid k1, Kid k2) {
    // compare by height
    return k1.height < k2.height;
  }
}

public class CompareByAge {
  public boolean kidLessThan(Kid k1, Kid k2) {
    // compare by age
    return k1.age < k2.age;
  }
}

public class Dad {
  public void sortKids(CompareKids comparator) {
     for (int index = 1; index < kids.size(); index++) {
        // slide the nth kid into the correct place
        for (int n = index; n > 0 && comparator.kidLessThan(kids.get(n), kids.get(n-1)); n--) {
           // swap kid n with (n - 1)
           Kid temp = kids.get(n);
           kids.set(n, kids.get(n - 1));
           kids.set(n - 1, temp);
        }
     }
  }  

  public void exampleSortCall() {
    sortKids(new CompareByAge());
  }
}
```
In the above implementation we can see how we changed the `sortKids` method. It now takes an `abstract class CompareKids` as an argument. That class must implement the method `kidLessThan` that is called to determine the sort order. Furthermore, since these classes are external to `Dad`, we need to pass in the `Kid` and not just the index to the Kid. We can have lots of classes that derive from `CompareKids` and sort our kids in many different ways without having to recompile.   

While the current implementation works, it can't be generalized to work with non-Kids. It can only sort Kids. 

### Generalized Sorting with Classes
To generalize the above code, we can use `Generics` in the following way. 
```java
  public abstract class CompareThem<T> {
    public boolean lessThan(T item1, T item2);
  }

  public class CompareTheirAge extends CompareThem<Kid> {
    public boolean lessThan(Kid k1, Kid k2) {
      // compare by age
      return k1.age < k2.age;
    }
  }

  public static<T> void sortList(CompareThem<T> comparator, List<T> list) {
     for (int index = 1; index < list.size(); index++) {
        // slide the nth element into the correct place
        for (int n = index; n > 0 && comparator.lessThan(list.get(n), list.get(n-1)); n--) {
           // swap element at n with (n - 1)
           T temp = list.get(n);
           list.set(n, list.get(n - 1));
           list.set(n - 1, temp);
        }
     }
  }

  public void exampleSort() {
    sortList(new CompareTheirAge(), kids);
  }
```
With the above implementation, we can sort any list using any comparator method. And we did it without using interfaces!! 

What do interfaces offer us?  
1. Interfaces allow the programmer to write shorter code, which we will illustrate further down.  
2. Interfaces allow us to write sorting code where the items sort themselves.  

### Kids Sorting Themselves
Let's rewrite the sorting algorithm so that the kids can sort themselves. In other words, let's have the `lessThan` method belong to the Kids class and see how that works out.

TODO:...

**BUT**, 
1. The Kids can't sort themselves.  
2. The sort code can't work with

## Review this stuff
the `sort` method as an argument so that we can fully customize the sorting behavior. Furthermore, passing in the `Comparator` into the `sort` method allows us to sort objects that might otherwise not be *sortable*. Passing in the Comparator allows us to define how an object can be sorted.        

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


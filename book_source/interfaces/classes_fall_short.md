# Lesson I2: Classes Fall Short

This lesson is dedicated to showing that classes are pretty good at allowing us to customize the sort order of a list. However, classes are not good enough. Interfaces are needed to sort a generic list of objects that define their own sort order.  

We will demonstrate this by sorting lists in various ways using classes exclusively. We will continually increase the demand of our code until we discover what classes cannot do, but interfaces can.   

## Overview

The goals of this lesson is to demonstrate that classes are unable to generically sort a list where the objects define their own sort order.  

As we accomplish this goal, we will also:  
🔹 Learn how to pass a function (a *behavior*) to another method.  
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
This code allows Dad to sort the kids according to the comparison code found in `kidLessThan`. Here are three different implementations of `kidLessThan`:  
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
We can pass in an object that implements the method `kidLessThan`. Let's look at that code.  

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

  public static <T> void sortList(CompareThem<T> comparator, List<T> list) {
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

### Kids Sorting Themselves
Let's rewrite the sorting algorithm so that the kids can sort themselves. In other words, let's have the `lessThan` method belong to the Kid class. This is what we call `Natural Sort Order`.

It's not too hard to add the method to the Kid class. In the code below, we will also take the opportunity to introduce a more standard way of doing comparisons. Take note on the comparison method, `compareTo`. 
```java
public class Kid extends Person {
  public int cuteness;
  public double gpa;
  public boolean whinesTooMuch() { ... }

  /*
   * return any negative value if this kid is less than the other kid.
   * return 0 if this kid == other kid.
   * return any positive value if this kid is greather than the other kid.
   */
  public int compareTo(Kid other) {
    // compare by age
    return this.age - other.age;
  }
}

public class Dad {
  public void sortKids() {
     for (int index = 1; index < kids.size(); index++) {
        // slide the nth kid into the correct place
        // if compareTo is < 0, then kid(n) is less than kid(n-1)
        for (int n = index; n > 0 && kids.get(n).compareTo(kids.get(n-1)) < 0; n--) {
           // swap kid n with (n - 1)
           Kid temp = kids.get(n);
           kids.set(n, kids.get(n - 1));
           kids.set(n - 1, temp);
        }
     }
  }  
}
```
Let's examine this solution. Most apparent is that is solves the problem we set out to solve. **What is less than ideal?**   

**The solution is not generic**. The sorting method requires that we sort `Kid` objects. In our attempt to make the sort method `generic` we will quickly run into trouble because not all classes have the method compareTo. The code won't compile!  

```java
  public static <T> void sortList(List<T> list) {
     for (int index = 1; index < list.size(); index++) {
        // slide the nth element into the correct place
        // THIS WON'T COMPILE because not all classes have the method compareTo
        for (int n = index; n > 0 && list.get(n).compareTo(list.get(n-1)) < 0; n--) {
           // swap element at n with (n - 1)
           T temp = list.get(n);
           list.set(n, list.get(n - 1));
           list.set(n - 1, temp);
        }
     }
  } 
```
We could attempt to get around this problem by casting the object to a `Kid` class. But that eliminates the generic nature of the method: casting to `Kid` would mean we could only sort lists of `Kid` objects.  

We could require that objects inherit from a base class that implements the method. Let's see what that looks like.
```java
  // Note: we are creating this **class** to illustrate a point.
  // There is an interface named Comparable<T> that we will get to later.
  public abstract class Comparable<T> {
    public abstract int compareTo(T other);
  }

  public class Kid extends Person, Comparable<Kid> {
    public int compareTo(Kid other) {
      // compare by age
      return this.age - other.age;
    }
    /* Other code not shown */
  }

  // This fancy generic declaration means that the List can be of any type
  // so long as it extends Comparable<MyClassName>. This allows us to
  // have access to the compareTo method.
  public static <T extends Comparable<T>> void sortList(List<T> list) {
     for (int index = 1; index < list.size(); index++) {
        // slide the nth element into the correct place
        // All classes that extend Comparable<T> have the method compareTo. Whew!
        for (int n = index; n > 0 && list.get(n).compareTo(list.get(n-1)) < 0; n--) {
           // swap element at n with (n - 1)
           T temp = list.get(n);
           list.set(n, list.get(n - 1));
           list.set(n - 1, temp);
        }
     }
  } 
```
Does the above code work? _**NO!!**_ Why not? Because it is important for the `Kid` class to extend `Person`. And classes have the limitation that we can extend only one class. It is impossible to have `Kid` extend `Person` **AND** `Comparable<T>`. We were so close to providing a generic sorting method that can sort Kids that sort themselves. But it just won't work!  

What is the solution? **Interfaces!!** (Yes, that was obvious.)  

By using interfaces, the code works just fine.  
```java
  // This is a standard interface provided in Java. No need to re-declare it!
  public interface Comparable<T> {
    int compareTo(T other);
  }

  public class Kid extends Person implements Comparable<Kid> {
    public int compareTo(Kid other) {
      // compare by age
      return this.age - other.age;
    }
    /* Other code not shown */
  }

  /* Sort method remains unchanged */
```

## What's so important? ![Billy](../_static/whats_so_important.png)
We showed we could do the following when using only classes:    
🔹 Customize the sort order by passing in a class that implements a comparison method   
🔹 Sort a generic list of objects while also customizing the sort order   
🔹 Sort a list of Kids where the kids sort themselves  

We showed that classes are **UNABLE** to sort a generic list of objects that sort themselves because classes can extend only one other class. But, by using interfaces, we can successfully sort a generic list of objects that sort themselves.  

The code in this lesson showed:  
* By passing in a class/interface, a function is effectively passed in as an argument. The function was _"wrapped"_ inside of the class/interface.  
* The *Type* of the argument that is a function is an `interface`.  
* `Comparable` is an `interface` that allows objects to define their own sort order.

While we _can_ use classes to represent a function, we've seen how there are shortcomings to using classes. Therefore, from here on out, we will always represent a function with an `interface`.  

Future lessons will show even more benefits to using an `interface`. Classes fall even further behind!   
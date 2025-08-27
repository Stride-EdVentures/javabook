# Generics

In this lesson, students will learn how to create their own generic `static` methods and generic classes. 

Furthermore, students will learn about some of the benefits that generics offers us. We will answer the question: **Why use generics at all?**

**REVIEW THIS STUFF**
This lesson will explain some advanced features of generics and their benefits. While this lesson will do a brief introduction/review of Generics, the student should be somewhat familiar with Generics before reading this lesson. This lesson will also make use of `interfaces`, but it shouldn't be necessary to be fully versed in interfaces to understand this lesson.  

The goals of this lesson are:  
1. To understand the benefits of Generics  
2. To become comfortable with the syntax of Generics  
3. To understand the benefits of constrained typing and to become familiar with its syntax  
4. To know what Type Erasure is and how that impacts Generics  

## Overview
Let's do a quick overview of what Generics do and how the syntax works.  

Generics allows the developer to create code that is very much like a **template** where the specific **type** is represented with a placeholder. 

 Let's show a generic `static` and then a generic `class`.   
 
 First, here is a generic `static` method using the Collection class `List`:  
```java
// The `<T>` is important. It says that we are introducing a generic type `T`.
// All the occurances of `T` will **conceptually** be replaced by the actual type you want.
public static <T> void printItems(List<T> list) {
    for (T item : list) {
        System.out.println(item);
    }
}

// If we wanted to print all the strings in a List<String>,
// the above "template" is **conceptually** rewritten to be:
public static void printItem(List<String> list) {
    for (String item : list) {
        System.out.println(item);
    }
}
```

Instead of writing a `static` method that introduces a generic type `<T>`, let's write a generic `class` that has a generic type.  
```java
// The class declaration introduces the generic type `T`.
// Now we can use `T` in the class as if it were some well known type.
public class Box<T> {
    private T item;

    public Box(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }
}

public class Example {
    public static void main(String[] args) {
        Box<String> box = new Box("Hello");
        System.out.println(box.getItem());
    }
}

// Our Box<String> class is **conceptually** written as below.
// All of the `T`s are replaced with `String`
public class Box {
    private String item;

    public Box(String item) {
        this.item = item;
    }

    public String getItem() {
        return item;
    }
}
```


## Why Generics?
We have Generics to enable compile-time type checking.  This helps catch type-related errors early, reducing runtime errors and improving code reliability.  

Generics are used to do two things:  
1. Allow a data structure to contain different types  
2. Allow a method to work on a broad range of types 

### Generic Data Structures
Generic Data Structures are likely where developers mostly commonly see Generics. The `Java Collection Framework`<a href="#footnotes"><sup>[1]</sup></a> is built entirely on top of Generics. This is where we get support for code like the following:  
```java
List<Integer> list = new ArrayList<>();
Map<String, String> map = new HashMap<>();
```
The above code shows how we'd create two generic data structures holding specific types of objects. 

### Generic Methods
When we want a method to work on a broad range of types, we have several options:  
1. Overload the method to take the types we are interested in supporting.  
2. Have the method accept the class `Object` and then type cast where necessary.  
3. Use Generics.  

## Using Overloaded Methods
If we wanted to write a method to work with three different types, we could overload the method. The following code illustrates how we could write code to support three types. The body of the code is identical. All we have done is overload the method with a different argument type. It is verbose, but it works.   

```java
public static void printSelf(String s) {
    System.out.println(s);
}
public static void printSelf(Animal a) {
    System.out.println(a);
}
public static void printSelf(Double d) {
    System.out.println(d);
}
```

### Using Objects
If we simply used the class `Object` for everything, we'd be able to write an execute code to accomplish our goals. The above code would be written as:  

```java
public static <T> void printSelf(T t) {
    System.out.println(t);
}
```
However, we'd have to Type Cast over and over again. Generics eliminates this overhead.



## Footnotes
[1] The [Java Collection Framework](https://docs.oracle.com/en/java/javase/23/docs/api/java.base/java/util/doc-files/coll-overview.html) is a unified architecture for representing and manipulating collections of objects. It provides a set of interfaces and classes to implement various data structures and algorithms, making it easier to manage groups of objects.
# Basic Interfaces

```{admonition} Definition
*Interface*: A contract that promises a specific behavior.
```

## Overview
In this lesson you will...  
a. Understand the difference between an interface and inheritance.  
b. Create an interface and a class that promises to implement it via the `implements` keyword.  
c. Get access to interface methods via Casting.  
d. Ask an object if it implements an interface via the `instanceof` keyword.  
e. Understand the `IS-A` relationship  


## Implements
An `interface` is a list of methods that a class must implement.
An interface is very much like a `class`, but the methods don’t have an implementation.<a href="#footnotes"><sup>[1]</sup></a> Methods that don't have an implementation are called `abstract`. 

### Example Interface
```java
public interface Electrician {
   public abstract void installLights(int room);
   public abstract void addCircuitBreaker();
   public abstract void fixLightSwitch(int light);
   public abstract double getOverpricedServiceFee();
}
```
Note that the above definition makes use of the keywords `public` and `abstract`. In an interface, all the methods are **required** to be public and are *implicitly* declared as such.  Furthermore, all the methods in an interface are *implicitly* declared as `abstract`. We could have left out those keywords as we have done below.

```java
// We leave out the implicit keywords, public abstract.
public interface Electrician {
   void installLights(int room);
   void addCircuitBreaker();
   void fixLightSwitch(int light);
   double getOverpricedServiceFee();
}
```
With the above code in its own file, we can then create a `class` that `implements` the `interface` as follows.
```java
public class HandyGuy extends Person implements Electrician {
    // must provide code for all the methods belonging
    // to the interface Electrician
    // Code is not shown.
}
```

```{admonition} Note
`extends`: Classes can extend only one other class
`implements`: Classes can implement any number of interfaces
```

## Interface vs Classes

Q: What's the point of interfaces?  
A: Several great reasons!!  
1. They absolve us of the confining requirements of classes. For example, a class can only extend one other class.  
2. They can be implemented with `lambda` expressions or `inner anonymous classes` which give us a good amount of flexibility and power.  
3. Interfaces enable an imperative<a href="#footnotes"><sup>[2]</sup></a> language to offer some characteristics of a functional<a href="#footnotes"><sup>[3]</sup></a> language.  

### Common Uses of Interfaces
* For Abstraction & Extensibility
* Functional Programming
    * Arguments are functions.
    * Methods return functions.
* Callbacks to handle Events
    * GUI Programming is Event Driven
* Customize functionality
    * Sort a list in a specific order
* Enable iteration via for-each
* Try-with-resources : auto close
* Streams




## Footnotes
[1] In reality, interfaces actually *can*, and often *do*, have implementation. An interface can have `default` and `static` methods, both of which are implemented. Methods that have no implementation are called `abstract`. Interfaces almost always have at least one abstract method, but this is not required. In this lesson, we introduce `interfaces` by saying that they have no implementation because this is a characteristic that helps us distinguish them from `classes`. However, confusingly enough, classes can *also* have `abstract` methods. It takes a seasoned developer to know when an `abstract class` is preferrable over an `interface` or vice versa.   
[2] **Imperative** languages are ...  
[3] **Functional** languages are ...
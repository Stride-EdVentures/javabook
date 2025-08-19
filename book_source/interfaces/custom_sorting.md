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

```{admonition} Method Reference Syntax
:class: note
`ClassName::staticMethodName`
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
* The code is cleaner and more concise.  
* On line 3: We created a reference to a static method using the `ClassName::methodName` syntax.  
* On line 7: The method `getStringFromInt` has the same signature as the `apply` method in `Function<Integer, String>`. It takes a single `Integer` and returns a `String`.  
* On line 7: The `apply` method is called exactly as before. The identifier `behavior` is an `interface` and we invoke methods on it that same way we would invoke a method on a class.  
* On line 7: When the `apply` method is called, the method named `getStringFromInt` is invoked! It has a different name!  

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
A common use of interfaces is to customize sorting using the interface, `Comparator`.

```{admonition} Comparator
A comparator is `interface` implemented by an _outsider_ that knows how to compare two objects.
![Comparator](../_static/comparator.jpg)  
```java
public interface Comparator<T> {
   /**
    * Compares its two arguments for order.  
    * Returns a negative integer when the first argument is less than the second
    * Returns zero when the arguments are equal
    * Returns a positive integer when the first argument is greater than the second 
    *
    * @param o1 the first object to be compared.
    * @param o2 the second object to be compared.
    * @return an integer whose sign indicates the comparison result
    */
   int compare(T o1, T o2);
```


## Four Types of Method References
In these examples, we create an instance of an interface and then immediately invoke a method on the interface. This style of programming is contrived and is not practical. But, it does illustrate how an interface can be created with a `method reference`, which is the point!  

1. **Static Method Reference**  

Syntax: `ClassName::staticMethodName`
Used to refer to a static method of a class.
```java
public class Example {
  public static void main(String[] args) {
    Function<String, Integer> parseInt = Integer::parseInt;
    System.out.println(parseInt.apply("123")); // Output: 123
  }
}
```

2. **Instance Method Reference** (of a particular object)  

Syntax: `instance::instanceMethodName`  
Used to refer to an instance method of a specific object. Note that `this` can be the specific object! The example code below shows two object instances.   
* The first instance is `System.out`, a static instance of a `PrintStream` on the `System` class.  
* The second instance is `this`, an instance of `Example`.     
```java
public class Example {
  private int n;

  public static void main(String[] args) {
    String message = "Hello, World!";
    Consumer<String> print = System.out::println;
    print.accept(message); // Output: Hello, World!

    Example ex = new Example(5);
    ex.useSelf();
  }

  public Example(int n) {
    this.n = n;
  }

  public int useSelf() {
    Function<Integer, String> getString = this::convert;
    System.out.println(getString.apply(20)); // Output: Sum is 25
  }

  private String convert(Integer x) {
    return "Sum is " + (x + this.n);
  }
}
```

3. **Instance Method Reference** (of an arbitrary object of a class)  

Syntax: `ClassName::instanceMethodName`  
Used when the method is called on an arbitrary instance of a class.  
This will only work when the object on which the method is called is the first parameter of the functional interface.
```java
public class Example {
    public static void main(String[] args) {
      Function<String, String> toUpperCase = String::toUpperCase;
      System.out.println(toUpperCase.apply("hello")); // Output: HELLO
    }
}
```
 In the example above, the string `"hello"` is the argument passed into `apply`. When `apply` is called, Java is effectively making the following call.
 ```java
 "hello".toUpperCase();
 ```
This type of method reference works only when the first argument to the method defined in the interface matches the object type needed. In our example, `String::toUpperCase` is an instance method on the `String` class. Therefore, the signature must accept a `String` as the first argument.  

This type of method reference is useful when the one wants to define the interface "early" and define the object instance "later." If you know the object, it can be more clear to simply use the object then.  

4. Constructor Reference  

Syntax: `ClassName::new`  
Used to refer to a constructor. (This is rarely used.)   
```java
public class Example {
    public static void main(String[] args) {
        Supplier<StringBuilder> createStringBuilder = StringBuilder::new;
        StringBuilder sb = createStringBuilder.get();
        System.out.println(sb.append("Hello, Constructor Reference!")); // Output: Hello, Constructor Reference!
    }
}
```


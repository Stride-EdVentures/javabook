# Default Methods

We've been focusing on the `abstract` methods of an interface, those methods that have no implementation. It is common that an interface can add beneficial behavior simply by leveraging the other `abstract` instance methods it knows about. These _additive_ instance methods are called `default` methods.   

Furthermore, an interface can provide `static` _utility_ methods that have access to other static methods or fields, but not to any of the instance methods because a static method does not have access to `this`.   

In other words, interfaces can have implementation!

## Interfaces with Implementation
An interface can include methods with implementation. 
For example:  

```java
public interface MyInterface {
    // An instance method implied to be `abstract`
    public int countStuff(List<Integer> list);

    // An instance method with implementation
    public default void defaultMethod() {
        // an instance method that has access to `this`
        this.countStuff(null);
    }

    // A static method
    public static void utilityMethod() {
        // no access to `this` and therefore cannot call countStuff
        System.out.println("This is a static method.");
    }
}
```
Default methods will leverage and extend the interface.  

## Comparator<T>
Let's look at some of the `default` and `static` methods found in the `Comparator` interface. There are actually quite a few of these method. The reason there are so many is because there is a lot of overloading to provide better type safety and convenience. Below are just four methods in the interface.    

```java
public interface Comparator<T> {
    // The only `public abstract` method in the interface
    int compare(T o1, T o2);

    // Allows one to easily reverse the order of a sort
    default Comparator<T> reversed() {
        return Collections.reverseOrder(this);
    }

    // This allows **chaining** of methods so that Primary and Secondary
    // (then Tertiary, then Quaternary, then Quinary, etc) sort ordering can be done.
    default Comparator<T> thenComparing(Comparator<? super T> other) {
        // This is a quick way to verify that `other` is not null. 
        // If `other` is null, then this will throw an exception.
        // See Footnote #1.
        Objects.requireNonNull(other);
        return (Comparator<T> & Serializable) (c1, c2) -> {
            int res = compare(c1, c2);
            return (res != 0) ? res : other.compare(c1, c2);
        };
    }

    // This allows us to sort objects by some property on the object.
    // It makes use of a Key Extractor to identify the property to sort on.
    public static <T, U> Comparator<T> comparing(
            Function<? super T, ? extends U> keyExtractor,
            Comparator<? super U> keyComparator)
    {
        Objects.requireNonNull(keyExtractor);
        Objects.requireNonNull(keyComparator);
        return (Comparator<T> & Serializable)
            (c1, c2) -> keyComparator.compare(keyExtractor.apply(c1),
                                              keyExtractor.apply(c2));
    }
}
```
The above code can be daunting. This is largely due to all the fancy generic typing. Let's examing the code piece-by-piece.  

### reversed()
This method simply wraps up the `Collections.reverseOrder` method. It allows the developer to write shorter, more readable code. It returns another `Comparator` interface.  

In the code below, we create a Comparator in three different ways for illustration purposes only.  
1. Using a `static` method on the `Comparator` interface.  
2. Using a `lambda expression` and the `Comparable.compareTo` method.  
3. Using a `Method Reference` that is a bit more advanced. (<a href="./full_review.html#arbitrary">See last lesson</a>)  

```{code-block} java
:linenos:
public static void sortRev(List<String> list) {
    // Makes use of the static method on the Comparator interface
    Comparator<String> natural = Comparator.naturalOrder();

    // Creates a Comparator using a Lambda expression
    natural = (s1, s2) -> s1.compareTo(s2);

    // Creates a Comparator using a Method Reference where this syntax
    // is using "an arbitrary instance" to transform an instance method
    // that takes one argument, into a method that takes two arguments.
    // There is more information on this in the last lesson of this chapter. 
    natural = String::compareTo;

    // This makes use of the Comparator's default method to say that
    // we want to reverse the natural order.
    list.sort(natural.reversed());
}
```
**Details on creating the Comparator**:  
1. On **line 3** we make use of the `Comparator`'s `static` method that will generate a _Natural Order_ `Comparator`. Note that we invoke the `static` method like we would any static method on a class. The implementation of this method is effectively a complicated version of `return c1.compareTo(c2);`.  
2. On **line 6** we recreate the `Comparator` using a lambda expression that implements the only `abstract` method in `Comparator`. It makes use of the `Comparable` interface. Note that the `compareTo` method is not invoked at this time. We are creating an interface with an anonymous method that will be invoked later when the list is sorted.  
3. On **line 12** we once again recreate the `Comparator` using a `Method Reference`. This method reference appears to have erroneous syntax because it is `className::instanceMethod`, something we have not yet seen. Early we showed that when the `context::` is the class name, what follows is a `staticMethod`. To understand this new syntax <a href="./full_review.html#arbitrary">see the last lesson.</a>   

Finally, after creating the _natural order_ `Comparator`, we get to using the `default` method `reversed`. Since `reversed` is an instance method, we dereference it from the identifier `natural` and invoke it using parentheses. If you examine **line 16** above you'll see that `natural.reversed()` returns a `Comparator` that is passed into the `sort` method. The result is a sort order that is reversed from its natural order.  

### thenComparing
This `default` method has a complicated prototype because it makes use of `bounded wildcards`. Bounded wildcards make your code more flexible and reusable while maintaining type safety. `Comparator<? super T> other` means the comparator can accept any type that is a superclass of `T`. The `?` is the `wildcard` and it means _any type_ that can't be known at compile time. The syntax allows you to pass any comparator that works on a type that is broader than `T`. It makes the code more reusable. We will discuss this in more detail in the section <a href="#wildcards">Bounded Wildcards</a> below.  

The simplest way to understand these complicated prototypes is to erase the _bounds_.  We will also erase the Intersection Type<a href="#footnotes"><sup>[2]</sup></a>.  

We can simplify to get the following code. While it is not as reusable, it is effectively the same and much easier to understand.  
```java
    default Comparator<T> thenComparing(Comparator<T> other) {
        return (c1, c2) -> {
            // First, call the `compare` method on "this" 
            // to see how the two object compare.
            int res = compare(c1, c2);

            // Use a ternary statement to continue the comparison using
            // the next comparison found in `other`. Continue only if "this" 
            // comparison results in equality.
            return (res != 0) ? res : other.compare(c1, c2);
        };
    }
```

### comparing
The `comparing` method in the `Comparator` appears even more complex as it makes heavier use of `Constraint Typing` and it introduces a new generic type `U`. Let's first write the simplied version of the method and then explain it.  

```java
    public static <T, U> Comparator<T> comparing(
            Function<T, U> keyExtractor,
            Comparator<U> keyComparator) {

        return (c1, c2) -> keyComparator.compare(keyExtractor.apply(c1),
                                                 keyExtractor.apply(c2));
    }
```
Here is what we can now see a bit more clearly:  
* The method `comparing` returns a `Comparator` that compares two objects of type `T`. It doesn't excute any code; it returns a function (interface).   
* The method takes two arguments:  
    * `keyExtractor` : This is a function that will get something of type `U` from an object of type `T`. This object of type `U` is used to establish the order.    
    * `keyComparator` : This is a function that compares two objects of type `U`. It is what we actually sort by.   

Let's do an example. Let's say I want to compare my `Kid`s by their `age` in reverse order. I would need to _extract_ their `age`. I would call their age the `key`. I get their age using the `keyExtractor` function. Once I have this **key** value, I need a way to compare two keys to establish the sort order. As you can see, the method `comparing` accepts a `Comparator` that is capable of comparing objects of type `U` which is the type of `age` (Integer).   

In the example code below, we provide two sorting methods that sort by age in reverse order. The first one uses the `static` method `comparing` on the `Comparator` interface. We provide the `keyExtractor` method using a lambda expression: it returns the integer age. Then we use another lambda expression to create a `Comparator` that does the arithmetic to do a reverse ordering of integers.  

There is a 3rd sorting method below that sorts by age in natural order.  
```java
public class Person {
    public int age;
}

public class Kid extends Person { }

public class Example {
    public void sort1(List<Kid> kids) {
        kids.sort(Comparator.comparing(p -> p.age, (a1, a2) -> a2 - a1));
    }

    public void sort2(List<Kid> kids) {
        kids.sort((k1, k2) -> k2.age - k1.age);
    }

    // Sort in the natural order. Provide only the keyExtractor
    public void sort3(List<Kid> kids) {
        kids.sort(Comparator.comparing(p -> p.age));
    }
}
```
`sort3` does not accept a `keyComparator` and therefore uses the _natural order_ of integers. We can do this because the `Comparator` interface has an overloaded version of `comparing` that accepts only the `keyExtractor`. Below we show the original code and its simplified version that is easier to read.  
```java
    // original version as found in the Java Libraries.
    // Note that this has a complicated constraint that U must implement Comparable.
    public static <T, U extends Comparable<? super U>> Comparator<T> comparing(
            Function<? super T, ? extends U> keyExtractor)
    {
        Objects.requireNonNull(keyExtractor);
        return (Comparator<T> & Serializable)
            (c1, c2) -> keyExtractor.apply(c1).compareTo(keyExtractor.apply(c2));
    }

    // Simplified version. This won't compile because we removed 
    // the constraint that U must implement Comparable.
    public static <T, U> Comparator<T> comparing(Function<T, U> keyExtractor) {
        return (c1, c2) -> keyExtractor.apply(c1).compareTo(keyExtractor.apply(c2));
    }    
```


## Footnotes
[1] The code `Objects.requireNonNull` is not technically necessary. If an argument is null, the `NullPointerException` will be thrown when the dereference is attempted. However, there are benefits to this explicit code:  
* **Fail Fast Principle**  
    It throws the exception immediately when the method is called, rather than later when the object is used. This makes debugging easier because the stack trace points directly to the source of the problem.

* **Clear Intent**  
    It explicitly documents that null is not allowed for that parameter. This improves code readability and helps other developers understand the contract of the method.  

[2] **Intersection Type**: This is when we _dual cast_ something to two interfaces simultaneously. This allows you to treat an object as implementing multiple interfaces at once. This is especially useful in generic programming, where you want to enforce that a type satisfies multiple constraints. In this lesson we have: `(Comparator<T> & Serializable)`. This is a way to cast to **BOTH** interfaces. It says that the resulting "thing" **IS-A** both a `Comparator` and `Serializable`. Recall that an object can implement two interfaces. Here we are establishing that an implementation provides the behavior of both. This is done with the `&` operator between two _types_.   

**Another Example**  
Suppose you have two interfaces:

```java
interface Flyable {
    void fly();
}

interface Trackable {
    void track();
}
```

And a class that implements both:

```java
class Drone implements Flyable, Trackable {
    public void fly() {
        System.out.println("Flying...");
    }

    public void track() {
        System.out.println("Tracking...");
    }
}
```
You can use an **intersection type** like this:

```java
Flyable flyableDrone = new Drone();
Trackable trackedDrone = (Flyable & Trackable) flyableDrone;

trackedDrone.track(); // Now you can call both fly() and track()
```

**Real-World Use Case**  
In Java's functional programming (e.g., lambdas), you might want a lambda that is both a `Function<T, R>` and `Closeable`, or both a `Runnable` and `AutoCloseable`. You can use intersection types to enforce that.  


[3] The `Serializable` interface is a **marker interface**; it has **no methods or fields**.  Its purpose is to **mark** a class as being capable of serialization — converting an object into a byte stream for storage or transmission. Client code would inquire whether an object is Serializable using `instanceof`. It is it, then the client code is free to serialize the object using code like the following:  

```java
public static void demoSerialize(Object obj) {
    if (obj instanceof Serializable) {
        try (FileOutputStream fileOut = new FileOutputStream("object.ser");
                ObjectOutputStream out = new ObjectOutputStream(fileOut)) {

            out.writeObject(obj);
            System.out.println("Serialized data is saved in object.ser");
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```
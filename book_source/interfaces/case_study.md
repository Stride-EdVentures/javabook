# Lesson I9: Case Study

In this lesson, we will examine a `default` method in the `Comparator` interface. The implementation and syntax is overwhelming. We will start off by exploring how the `String` class can have a sequence of methods chained together. We'll then introduce some functional programming into the example. Lastly, we'll extend beyond the String class to the Comparator. By the end of this lesson, you should:  
1) Have the skills necessary to develop understanding of complicated code.  
2) Be able to explain the `thenComparing` method.  

```{admonition} The Goal
The goal is to understand this terse code. It might look relatively simple, but it can be hard to explain. Furthermore, the `thenComparing` implementation looks quite complex. We aim to understand all of it.  

```java
// Compose a comparator using primary, secondary and tertiary comparisons
Comparator<Integer> primary = (i1, i2) -> i1 % 2 - i2 % 2;
Comparator<Integer> comparator = primary
        .thenComparing((i1, i2) -> i1 % 10 - i2 % 10)
        .thenComparing(Integer::compare);
// now sort with our composed comparator
list.sort(comparator);
```

## Method Chaining
Consider the following code.
```java
// one line at a time
String str = "example";
str = str.substring(0, 4);
str = str.toUpperCase();

// chained together
String str = "example".substring(0, 4).toUpperCase();
```
Because `substring` returns a string, we can dereference it directly on the same line.  

The purpose of the above code is to illustrate that many of the String methods return a String object which can be directly referenced on the same line of code. This shortens the code and can often make things more readable.   

### Adding Functional Programming
The above String code is pretty simple. Let's add some more method calls. The following code is not practical; it is used for illustration purposes only.  

In the first method `noChain`, the code will convert a string to upper case, then invoke the method `removeMirror`, and then replaces all `"A"` with `"X"`. Lastly, it takes only the first 3 characters of the string if the string is long enough.  

The second implementation `chainEm` does exactly the same thing in one statement. For readability, each *link* in the chain is put on its own line. This is common practice. Since each method returns a string, we can continue to use the `dot` operator to create a *chain.*  

```java
   public static void noChain(String str) {
      str = str.toUpperCase();
      str = removeMirror(str);
      str = str.replace("A", "X");
      str = str.substring(0, Math.min(3, str.length()));
   }
   
   public static void chainEm(String str) {
      str = str.toUpperCase()
            .transform(EggsAmple1::removeMirror)
            .replace("A", "X")
            .transform(s -> s.substring(0, Math.min(3, s.length())));
   }
```
The `transform` method has a single argument, a `Function<>` interface. In our example, the interface is a *functional interface* that is fulfilled with a method that takes a String and returns a String. We give it a method pointer to the static method implemented in the EggsAmple1 class. Then we chain some more.  

The last call to `transform` uses a Lambda Expression to fulfill the interface. This isn't necessary and it is overkill. We do it simply to illustrate that the argument to transform is an interface that can fulfilled in more than one way.  

The `transform` method is what introduces *functional* programming because its argument is a function.

## Implementing the Comparator
Let's start off by attempting to implement the `thenComparing` method. Then we'll compare our implementation to the actual code in the `Comparator` interface.  

We want to support *chaining*, meaning that we want to return a `Comparator` in the same way that the String methods above returned a String. 

We are first going to simplify our problem by treating Comparator as a class that works only with Integers. Then we'll convert it to an interface, and then to a generic interface.
```{code-block} java
:linenos:
:emphasize-lines: 7
// implemented as a class
public class Comparator {
    public int compare(Integer i1, i2) { return i1 - i2; }

    public Comparator thenComparing(Comparator secondary) {
        // Use primary comparison. i1 and i2 are not defined. This won't work!
        int res = this.compare(i1, i2);
        if (res == 0) {
            // use secondary comparison
            res = secondary.compare(i1, i2);
        }
        return res;
    }
```
The above code won't work for two reasons:  
1) In line 7 we need two integer values, and we have no way to get them!  
2) On line 12, we are returning an `int` type, but the method prototype expects us to return a Comparator!  

Let's ignore this for a second to first understand the attempted functionality.  

The code first compares two Integers. If they are the same, it proceeds to to compare them using a secondary comparison implementation.

**Attempt #1 to Fix**  
In order to get line 7 to work, we need to get access to `i1` and `i2`. To illustrate how this is done, we will make up some syntax that is invalid in hopes that it acts like a bridge to the final solution. Let's alter the code as follows:  
```{admonition} Invalid Code
:class: error
The following code is bad. Java does not allow one to declare a method inside another method like this.
```

```{code-block} java
:linenos:
:emphasize-lines: 6, 14 
// implemented as a class
public class Comparator {
    public int compare(Integer i1, i2) { return i1 - i2; }

    public Comparator thenComparing(Comparator secondary) {
        public int composedCompare(Integer i1, Integer i2) {
            int res = this.compare(i1, i2);
            if (res == 0) {
                // use secondary comparison
                res = secondary.compare(i1, i2);
            }
            return res;
        }
        return new Comparator(composedCompare);
    }
    public Comparator (CompareMethod method) { }
```
It is obvious that we now have access to *i1* and *i2* because they are arguments to our nested method `composedCompare`.  

We have now also created a `new` Comparator object to return. We *imagined* a constructor that takes a *method* to be used as its `compare` method instead of the one coded on line 3. While this syntax does not work, the idea is sound. We created and returned an object with an altered version of the compare method.  

How do we fix the syntax?  

**Attempt #2 to Fix**  
To fix the syntax, we need to use **interfaces**.  
```{code-block} java
:linenos:
:emphasize-lines: 5
public interface Comparator {
    // abstract method provided the by implementer
    public int compare(Integer i1, Integer i2);

    default Comparator thenComparing(Comparator secondary) {
        final Comparator primary = this;
        // create a Comparator using Anonymous Inner Class syntax
        Comparator composed = new Comparator() {
            @Override
            public int compare(Integer i1, Integer i2) {
                int res = primary.compare(i1, i2);
                if (res == 0) {
                    // use secondary comparison
                    res = secondary.compare(i1, i2);
                }
                return res;
            }
        };
        return composed;
    }
}
```
The above code will now compile!! We had to introduce the `default` keyword to the method `thenComparing`. We chose to use an *Anonymous Inner Class* syntax to create an instance of a Comparator with the abstract method implemented. 

**Attempt #3: Using Lambdas and Generics**  
Let's now rewrite the code another time using a Lambda Expression and as a Generic. 
```java 
public interface Comparator<T> {
    // abstract method provided the by implementer
    public int compare(T i1, T i2);

    default Comparator<T> thenComparing(Comparator<T> secondary) {
        // create a Comparator using a lambda
        Comparator<T> composed = (i1, i2) -> {
            int res = this.compare(i1, i2);
            if (res == 0) {
                // use secondary comparison
                res = secondary.compare(i1, i2);
            }
            return res;
        };
        return composed;
    }
}
```
We added the `<T>` so that it will work with any type, not just Integers. The code became a little shorter using the lambda expression. We also eliminated the identifier `primary` and, instead, just referenced `this` directly. This implementation is very close Java's implementation.  

In the Java final implementation, it:  
1) Uses *Constraint Typing* to make the Generic typing more *extensive* (*inclusive*).  
2) Checks that the argument passed in is not null.  
3) Directly returns the lambda expression, avoiding the creation of a local variable.  
4) Explicitly casts the lambda expression so that also implements `Serializable`.<a href="#footnotes"><sup>[3]</sup></a>  
5) Uses a ternary operator to eliminate the if-statement, making the code even shorter.  

```java
public interface Comparator<T> {
    default Comparator<T> thenComparing(Comparator<? super T> other) {
        Objects.requireNonNull(other);
        return (Comparator<T> & Serializable) (c1, c2) -> {
            int res = compare(c1, c2);
            return (res != 0) ? res : other.compare(c1, c2);
        };
    }
```
## Decomposing the Comparator
Let's look at an even more complex implementation of `thenComparing`. In this implementation, the idea is very similar to the above. We want to allow chaining of Comparators. However, we want to sort Objects by some field. Java accomplishes this in two steps: first it overloads `thenComparing` with an implementation that calls a helper method `comparing`. Let's look a the unsimplified code first.  
```java
public static <T, U> Comparator<T> comparing(
        Function<? super T, ? extends U> keyExtractor,
        Comparator<? super U> keyComparator) {
    Objects.requireNonNull(keyExtractor);
    Objects.requireNonNull(keyComparator);
    return (Comparator<T> & Serializable)
        (c1, c2) -> keyComparator.compare(keyExtractor.apply(c1),
                                            keyExtractor.apply(c2));
}
default <U> Comparator<T> thenComparing(
        Function<? super T, ? extends U> keyExtractor,
        Comparator<? super U> keyComparator) {
    return thenComparing(comparing(keyExtractor, keyComparator));
}    
```
The primary source of confusing comes from all the Generic Typing. So let's simplify that first by specifying the Generics and adding some comments. Below we have modified the code in a number of ways:  
1) Replace **T** with `Dog`  
2) Replace **U** with `Bark` (a field or "key" of the Dog class)  
3) Rename `keyExtractor` to `getsBark`  
4) Rename `keyComparer` to `comparesBarks`  
5) Delete  validation code (checking for null)  
6) Separating the return and lambda lines    

```java
// this will get a comparator that compares two Dogs by their Bark.
// It needs two helpers:
//    1) A method to get the Bark from the Dog  (keyExtractor)
//    2) A Comparator that knows how to compare Barks  (keyComparator)
public static Comparator<Dog> comparing(
        Function<Dog, Bark> getsBark,     // a function that gets the Bark from the Dog
        Comparator<Bark> comparesBarks) { // a Comparator that compares Barks

    // to compare Dogs, actually compare their barks. Both Comparators return `int`
    Comparator<Dog> res = (d1, d2) -> comparesBarks
                    .compare(getsBark.apply(d1),  getsBark.apply(d2));
    return res;
}

// This is an overload of thenComparing 
default <Bark> Comparator<Dog> thenComparing(
        Function<Dog, Bark> getsBark,
        Comparator<Bark> comparesBarks) {

    // call static method to get our Dog Comparator
    Comparator<Dog> dogComparator = comparing(getsBark, comparesBarks);
    
    // Call our earlier implementation of thenComparing that
    // takes a single Comparator Argument
    return thenComparing(dogComparator);
}    
```
Note that `getsBark` is of type `Function<T, R>`. This means that it is an interface and we must invoke the abstract method `apply`.  

Look at the revision. Is it easier to read? I hope so!  

Can you now explain the details of what is happening in the following code?  
```java
// Compose a comparator using primary, secondary and tertiary comparisons
Comparator<Integer> primary = (i1, i2) -> i1 % 2 - i2 % 2;
Comparator<Integer> comparator = primary
        .thenComparing((i1, i2) -> i1 % 10 - i2 % 10)
        .thenComparing(Integer::compare);
// now sort with our composed comparator
list.sort(comparator);
```

## What's so important? ![Billy](../_static/whats_so_important.png) 
Here is how you can simplify code so that you better understand it:  
* Because generics make code hard to read, first eliminate all the `extends` and `super`  
* Break up single lines into multiple lines (e.g. temporary assignment then return)  
* Rename Generics to something common (e.g. Dog and Bark)  
    * This requires an understanding of their relationship, which can be hard.  
* Consider eliminating the Generic altogether and hard-coding to Integer  

## Footnotes
[1] *Fluent Interface*  
**Fluent interface** is the practice of calling multiple methods in one expression is known as **method chaining**.  

More specifically, when a method returns a reference to the same object (typically `this`) so that subsequent method calls can be chained, the class is said to use a *fluent interface* style. This approach is commonly used in APIs, builders, and configuration objects to create readable, expressive code.
[2] **Ternary Operator**  
A *ternary operator* is a compact conditional expression that chooses between two values based on a boolean condition. In Java, it has the form:  
```java
// generic form
Result r = condition ? valueIfTrue : valueIfFalse;
// example
int max = (a > b) ? a : b;
```
The condition is evaluated first; if it is `true`, the expression yields the first value, otherwise it yields the second. Because the ternary operator is an expression (not a statement), it produces a value and can be used directly in assignments or method arguments.

It is often used as a concise alternative to a simple `if–else` statement. While ternary expressions can make code shorter and clearer for simple decisions, they should be used sparingly. Overly complex or nested ternary expressions can reduce readability.

[3] **Serializable**  
When you see a lambda cast as **`(Comparator<T> & Serializable)`**, Java is being told that the **same lambda object should implement more than one interface**. By default, a lambda only implements a *single functional interface*—in this case, `Comparator<T>`. Adding `& Serializable` explicitly marks the lambda as also implementing `Serializable`, which means the resulting object can be **serialized** (converted into a byte stream for storage or transmission).  

**`Serializable`** is a *marker interface* in Java (it has no methods) that signals to the JVM and libraries that an object is allowed to be serialized—for example, written to a file, cached, or sent over a network. Lambdas are *not serializable by default*, even if the functional interface is, so this intersection cast is required when a framework or API expects a serializable object. In short, `(Comparator<T> & Serializable)` ensures the lambda can be used in contexts that require both comparison behavior **and** safe persistence or transport.  

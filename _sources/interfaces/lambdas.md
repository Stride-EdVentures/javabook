# Lambdas

In this lesson we will learn how to fulfill a Functional Interface with a Lambda Expression.
And we will see how to practically apply lambdas in several ways.

## Introduction
In the prior lesson we learned how a Method Reference can be used to fulfill an interface that has exactly one `abstract` method.  

The general syntax for a Method Reference is: `context::methodName`.  The "context" can be `this`, or the class name, or the instance identifier.  

While this does allow for some concise code, we can make further improvements using `Lambda Expressions`.  

```{admonition} Lambda Expression
:class: note
A **Lambda Expression** is shorthand notation that defines an anonymous method.
```

## Lambda Syntax
A Lambda Expression has several valid syntaxes.   
```java
    // The most common syntax using a single argument with a 1-liner method body.
    // Note that `return` is implied
    arg -> expression;

    // Multiple arguments. Method body is one line.
    (arg1, arg2) -> expression;

    // Typed arguments. It is optional to provide types for the arguments.
    // If { curly-braces } are provided, then the body can be multiple lines
    // AND it must explicitly use the `return` keyword.
    (Type arg1, Type arg2) -> { 
        statement(s);
        return expression;
    }
```

A lambda expression is shorthand to create a method. In the table below you'll see identical methods in both columns. The Lambda Expression in the right column creates a method that has no name. This is why it is called an `anonymous method`.    
|Full Method|Lambda Expression|
|-----------|-----------------|
|public int add(int x, int y) {<br>&nbsp;&nbsp;&nbsp;return x + y;<br>}|(x, y) -> x + y|
|public int sub(int a, int b) {<br>&nbsp;&nbsp;&nbsp;return a - b;<br>}|(n, m) -> n - m|
|public double exp(int x, int n){<br>&nbsp;&nbsp;&nbsp;return Math.pow(x, n);<br>}|(x, n) -> Math.pow(x, n)|
|public int printSumTwo(int[] arr){<br>&nbsp;&nbsp;&nbsp;int sum = arr[0] + arr[1];<br>&nbsp;&nbsp;&nbsp;System.out.println(sum);<br>&nbsp;&nbsp;&nbsp;return sum;<br>}|(arr) -> {<br>&nbsp;&nbsp;&nbsp;int sum = arr[0] + arr[1];<br>&nbsp;&nbsp;&nbsp;System.out.println(sum);<br>&nbsp;&nbsp;&nbsp;return sum;<br>}|

**Lambda Syntax Summary:**
* no access modifier  (`public`/`private`)  
* no return type (inferred from interface)   
* no name… it is anonymous!  
* no argument types required (inferred from interface)  
* short methods do not need { braces }  
* short methods have no `return` (inferred)  
* short methods have no semi-colon `;`

## Functional Interface
We have been fulfilling interfaces with a method reference and now a lambda expression. In order to do this, the interface must have exactly one `abstract` method. We call this type of interface a `Functional Interface`.

```{admonition} Functional Interface
:class: note
**Functional Interface**: An interface that has exactly one `abstract` method.  

An interface may have many `abstract` methods as well as `default` and `static` methods.  
```

## Sorting with Lambdas
Let's attempt to sort an integer array backwards using lambda expressions and a custom `Comparator`. Because the interface `Comparator` is a `Functional Interface`, we can fulfill it by providing one method. In our prior lesson, we fulfilled it with a Method Reference. Now we will fulfill the functional interface using a `Lambda Expression`.   

Consider how you would solve this coding problem (sorting an integer array backwards) before you reveal the answer. 

```{admonition} Click to see answer
:class: hint dropdown
We can fulfill the `Comparator<Integer>` functional interface as follows:  

```java
public void sortList(List<Integer> list) {
    // ask i2 to do the comparison which will reverse the sort order
    list.sort((i1, i2) -> i2.compareTo(i1));
}
```

### Lambdas Calling Methods
There is no restriction on what code can be inside a lambda expression. It can be many lines long and it can invoke other methods.  

Using Lambdas, write code to sort a list of integers ordered as if the digits were reversed. For example:  

```java
// Let the original array be:
[400, 123, 56, 251, 511, 72]

// Those digits reversed would be:
[4, 321, 65, 152, 115, 27]

// Sorting the above results in:
[4, 27, 65, 115, 152, 321]

// The final sorted list would be:
[400, 72, 56, 511, 251, 123]
```

Assume that you have the following method to reverse the digits.  
```java
// Here is the method that will reverse the digits (iteratively)
// Can you write this method recursively?
public static Integer reverse(Integer number) {
    int reversed = 0;
    while (number != 0) {
        reversed = reversed * 10 + number % 10;
        number = number / 10;
    }
    return reversed;
}
```

```{admonition} Click to see answer
:class: tip dropdown
```java
public void sortList(List<Integer> list) {
    // Reverse i1 and i2. Then order with those.
    list.sort((i1, i2) -> {
        i1 = reverse(i1);
        i2 = reverse(i2);
        return i1.compareTo(i2);
    });

    // Same as above, but using a single-line lambda that does the arithmetic
    list.sort((i1, i2) -> reverse(i1) - reverse(i2));
}

// This is a recursive implementation of the reverse method.
// The initial call should be with result = 0.  `recReverse(n, 0)`
public static Integer recReverse(Integer number, Integer result) {
    if (number == 0) {
        return result;
    }
    return recReverse(number / 10, result * 10 + number % 10);
}
```

## Returning a Function
It is common to have a function return a function. For example, `Collections.reverseOrder()` returns a `Comparator` which is conceptually a method. To return a method from a method, we often use lambda expressions (although a Method Reference can be used).  

```java
public Comparator<Integer> getComparator() {
    return (i1, i2) -> i1 - i2;
}
```

The method `getComparator` simply returns a function. Many students get confused about what is actually happening in the `getComparator` method. It does not invoke the comparator; it creates a comparator by returning a method. `getComparator` does not accept any arguments. It returns a function that may get invoked later, but it does not run the code right away. The function returned by `getComparator` accepts two arguments and returns an Integer because it fulfills `Comparator<Integer>`. 

Below is code to demonstrate how we would call `getComparator`:  

```java
public void sortList(List<Integer> list) {
    // we are invoking the method `getComparator` to get the Comparator.
    // This we why we have `()`... to invoke the method.
    list.sort(getComparator());
}
```

Doing the above doesn't provide much power; there is no real reason to write code as we did above. However, it does allow us to easily modify or paramerterize the method. For example, let's say that we want to sort all integers less than 500 in order, and those above 500 are done in reverse. We would write that `Comparator` as a lambda expression as follows:  

```java
public Comparator<Integer> getComparator() {
    return  (i1, i2) -> {
        // assure numbers <= 500 come before numbers > 500
        if (i1 <= 500 || i2 <= 500) {
            return i1.compareTo(i2);
        }
        return i2.compareTo(i1);
    };
}
```

There is still no benefit to the above. But, let's customize it a bit more. Let's say that we want to have the barrier at customized values. In other words, we don't always want to use 500, we want to use `n`. Furthermore, perhaps we need to generate the function in multiple places. Repeating the lambda inline is not 'DRY'. Using a method to return the `Comparator` is much better. Here is example code:  
```java
public Comparator<Integer> getComparator(Integer n) {
    return  (i1, i2) -> {
        // assure numbers <= n come before numbers > n
        if (i1 <= n || i2 <= n) {
            return i1.compareTo(i2);
        }
        return i2.compareTo(i1);
    };
}

public void sortList(List<Integer> list, int n) {
    // sort by paramerterized comparator
    list.sort(getComparator(n));
}

public List<Comparator<Integer>> getComparators() {
    List<Comparator<Integer>> list = new List<>();
    int nValues = { 250, 500, 750 };

    for (int n : nValues) {
        list.add(getComparator(n));
    }

    return list;
}
```

## What's so important? ![Billy](../_static/whats_so_important.png)  

* A Lambda expression is a shorthand way to create a method that has no name, an _anonymous method_.  
* You can use a Lambda to fulfill a functional interface, an interface with exactly one abstract method.  
* Lambdas are often used to return a function from a method.  

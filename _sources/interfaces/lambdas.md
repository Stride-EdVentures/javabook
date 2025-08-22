# Lambdas

In this lesson we will learn how to fulfill a Functional Interface with a Lambda Expression.
And we will see how to apply this.

# Introduction
So far we've seen how a Method Reference can be used to fulfill a `Functional Interface.`  

```{admonition} Functional Interface
:class: note
**Functional Interface**: An interface that has exactly one `abstract` method.  

An interface can have many `abstract` methods as well as `default` and `static` methods.  
```

The general syntax for a Method Reference is: `context::methodName`.  The context can be `this`, the class name, or the instance identifier.  

While this does allow some concise code, we can make it even better with `lambda expressions`.  

```{admonition} Lambda Expression
:class: note
A **Lambda Expression** is shorthand notation that defines an anonymous method that acts as a `functional interface.`  

For example, if we want to fulfill the `Comparator<Integer>` functional interface, we can do the following:  

```java
public void sortList(List<Integer> list) {
    list.sort((i1, i2) -> (i1 % 10) - (i2 % 10));
}
```

A Lambda Expression has several valid syntaxes.   
```java
    // The most common syntax using a single argument with a 1-liner method body.
    // Note that `return` is implied
    arg -> arg-expression;

    // Multiple arguments. Method body is one line.
    (arg1, arg2) -> arg-expression;

    // Typed arguments. It is optional to provide types for the arguments.
    // If { curly-braces } are provided, then the body can be multiple lines
    // AND it must explicitly use the `return` keyword.
    (Type arg1, Type arg2) -> { 
        statement-1;
        return statement-2;
    }
```

A lambda expression is shorthand to create a method. In the table below you'll see identical method in both columns. The Lambda Expression in the right column creates a method that has no name. This is why it is called an `anonymous method`.    
|Full Method|Lambda Expression|
|-----------|-----------------|
|public int add(int x, int y) {<br>&nbsp;&nbsp;&nbsp;return x + y;<br>}|(x, y) -> x + y|
|public int sub(int a, int b) {<br>&nbsp;&nbsp;&nbsp;return a - b;<br>}|(n, m) -> n - m|
|public double exp(int x, int n){<br>&nbsp;&nbsp;&nbsp;return Math.pow(x, n);<br>}|(x, n) -> Math.pow(x, n)|
|public int printSumTwo(int[] arr){<br>&nbsp;&nbsp;&nbsp;int sum = arr[0] + arr[1];<br>&nbsp;&nbsp;&nbsp;System.out.println(sum);<br>&nbsp;&nbsp;&nbsp;return sum;<br>}|(arr) -> { System.out.println(arr[0] + arr[1]); return arr[0] + arr[1]; }|


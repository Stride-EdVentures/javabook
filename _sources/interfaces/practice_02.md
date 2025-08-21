# <i class="fas fa-pen-square fa-fw"></i> Practice Custom Sorting

**Question #1:** Examine the code below. Look at the method `runExample` to see three attempts to call `add`. Only one will succeed? Which one works?

```java
// Recall how the Function interface is defined
public interface Function<T, R> {
   R apply(T t);
}

public class Quiz {
    public void add(Function<Fraction, Double> op) {
        Fraction f1 = new Fraction(1, 3);
        Fraction f2 = new Fraction(2, 7);
        Double sum = op.apply(f1) + op.apply(f2);
        System.out.println(sum);
    }
    public static void runExample() {
        add(Quiz::tryTwo);
        add(Quiz::threePee);
        add(Quiz::toDouble);
    }

    public static void tryTwo(Fraction f1, Fraction f2) { }
    public static Fraction threePee(Double d1) { }
    public static Double toDouble(Fraction f1) { }
}
```

```{admonition} Click to see answer
:class: dropdown
`add(Quiz::toDouble)` will succeed because it has the correct signature.  
`toDouble` takes a `Fraction` and returns a `Double`. 
```

**Question #2:** Write a method to sort an integer array in its _Natural Order_.  

**Question #3:** Write a method to sort an integer in reverse. Accomplish this in three different ways:  
1) Have the hosting `class` implement the Comparator that does the arithmetic directly.  
2) Use a method reference to a function calls an Integer's Comparable backwards.  
3) Use Collections.reverseOrder.  

```{admonition} Click to see answer

```java
// TODO code
```
**Question #4:** Write a method to sort an integer array by its 1's digit.  
For example:
```
[ 15, 20, 31, 46 ] -> [ 20, 31, 15, 46 ]
// One's digits in the sorted list are: 0, 1, 5, 6
``` 
**Question #5:** Write a method to sort an integer array as follows:   
1) Even numbers before all Odd numbers  
2) 1's digits are used as the secondary sort  
3) The value of the number is used as the tertiary sort  

For example:
```
Orig:  [44, 22, 86, 35, 14, 6, 50, 40, 31, 55, 3, 72, 10, 31, 57, 74, 85, 59, 79, 25]
After: [10, 40, 50, 22, 72, 14, 44, 74, 6, 86, 31, 31, 3, 25, 35, 55, 85, 57, 59, 79]
```




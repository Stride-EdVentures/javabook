# Practice Custom Sorting

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

**Question #2:** 
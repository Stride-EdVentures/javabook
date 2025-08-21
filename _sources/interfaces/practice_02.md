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
`add(Quiz::toDouble)` will succeed because it has the correct method signature.  
`toDouble` takes a `Fraction` and returns a `Double`. 
```

**Question #2:** Write code to sort a List of Integers in its _Natural Order_.  

Don't write the sort method. Use a library and one line of code.  
```{admonition} Click to see answer
:class: dropdown
```java
public static void sortArray(List<Integer> list) {
    list.sort(null);
}
```

**Question #3:** Write code to sort a list of integers in reverse. Accomplish this in three different ways:  
1) Have the hosting `class` implement the Comparator that does the arithmetic directly.  
2) Use a method reference to a function that calls the Integer's `Comparable.compareTo`.  
3) Use Collections.reverseOrder.  

```{admonition} Click to see answer
:class: dropdown
```java
public class Example implements Comparator<Integer> {

    public void sort3Ways(List<Integer> list) {
        // #1: Use the Comparator that this class implements
        list.sort(this); 

        // #2: Use the instance method reference
        list.sort(this::reverse);

        // #3: Use the Collections comparator
        // Notice the dot & parentheses. This is a method invocation.
        list.sort(Collections.reverseOrder());
    }

    public int compare(Integer i1, Integer i2) {
        // reverse order arithmetic
        return i2 - i1;
    }

    public int reverse(Integer i1, Integer i2) {
        i2.compareTo(i1);
    }
}
```
**Question #4:** Write code to sort an integer array by its 1's digit.  
For example:
```java
[ 15, 20, 31, 46 ] -> [ 20, 31, 15, 46 ]
// One's digits in the sorted list are: 0, 1, 5, 6
``` 
```{admonition} Click to see answer
:class: dropdown

```java
public class Example {
    public static void sortBy1(Integer[] arr) {
        Arrays.sort(arr, Example::by1sLonger);
        Arrays.sort(arr, Example::by1sBetter);
    }

    public static int by1sLonger(Integer o1, Integer o2) {
        int d1 = o1 % 10;
        int d2 = o2 % 10;
        if (d1 < d2) {
            return -1;
        }
        if (d1 > d2) {
            return 1;
        }
        return 0;
    }

    public static int by1sBetter(Integer o1, Integer o2) {
        return o1 % 10 - o2 % 10;
    }
}
```

**Question #5:** Write code to sort an array of Strings in the following four ways:  
1) Default sort order
2) Reversing sort order   
3) Ignoring the case of the String  
4) Using this custom order that will reverse the String and also ignore the case  

Note that a regular sort is case-sensitive and will result in Upper-Case letters coming first.
Here is sample output:
```
Original: [Too Small, One, Two, Three, four, five, six, seven, Eight, Nine, ten, bigger]
Default:  [Eight, Nine, One, Three, Too Small, Two, bigger, five, four, seven, six, ten]
Reverse:  [ten, six, seven, four, five, bigger, Two, Too Small, Three, One, Nine, Eight]
No-Case:  [bigger, Eight, five, four, Nine, One, seven, six, ten, Three, Too Small, Two]
Custom:   [Three, Nine, One, five, Too Small, ten, seven, Two, bigger, four, Eight, six]

In the custom sort, see how we sorted by the reverse of the string:  
          [eerht, enin, eno, evif, llams oot, net, neves, owt, reggib, ruof, thgie, xis] 
```

```{admonition} Click to see answer
:class: dropdown

```java
public class Example {
   public static void demoSorting() {
      String[] words = { "Too Small", "One", "Two", "Three", "four", 
            "five", "six", "seven", "Eight", "Nine", "ten", "bigger" };
      List<String> arr = new ArrayList<>(Arrays.asList(words));
      System.out.println("Original: " + arr);
      
      // use the default comparator which calls objects .equals
      // Note the case-sensitive comparison
      arr.sort(null);
      System.out.println("Default:  " + arr);
      
      // provide a "reverseOrder" comparator
      arr.sort(Collections.reverseOrder());
      System.out.println("Reverse  :" + arr);
      
      // provide a case-insensitive comparator
      // Notice the dot operator and no parentheses. 
      // We are using a static field, not calling a method, not referencing a method
      arr.sort(String.CASE_INSENSITIVE_ORDER);
      System.out.println("No-Case:  " + arr);
      
      // provide a custom comparator
      arr.sort(Example::myCompare);
      System.out.println("Custom:   " + arr);
   }
   
   public static int myCompare(String s1, String s2) {
      // reverse each string, lower-case it, and compare those
      s1 = reverseString(s1).toLowerCase();
      s2 = reverseString(s2).toLowerCase();
      return s1.compareTo(s2);
   }
   
   public static String reverseString(String s) {
      if (s.length() <= 1) {
         return s;
      }
      return s.charAt(s.length()-1) + reverseString(s.substring(0, s.length()-1));
   }
```

**Question #6:** Write a method to sort an integer array using primary, secondary & tertiary sorting rules as follows:   
1) **Primary:** All positive numbers before all negative numbers. If signs are equal, use...  
2) **Secondary:** 10's digits. If the 10's digiti is the same, use...  
3) **Tertiary:** Reverse _Natural Order_ (larger first). 

For example, the array below shows how all the positive values come first. Then, we see that since [7, 3, 2] all have 0 as their 10's digit, they come first. The order of these three number is due to 7 > 3 > 2. The last three numbers [-47, -49, -49] all have 4 as their 10's digit, and -47 > -49. 
```
Before: [36, -23, 25, -24, 3, -47, -39, -27, -49, 7, 2, 44, 28, -49, -1, -2, 45, -4, 20, 34]
 After: [7, 3, 2, 28, 25, 20, 36, 34, 45, 44, -1, -2, -4, -23, -24, -27, -39, -47, -49, -49]
```

```{admonition} Click to see answer
:class: dropdown

```java
public class Example {
    public static void tertiarySort(Integer[] arr) {
        System.out.println("Before: " + Arrays.toString(arr));
        Arrays.sort(arr, Example::tertiaryComp);
        System.out.println(" After: " + Arrays.toString(arr));
    }
    
    public static int tertiaryComp(Integer o1, Integer o2) {
        int test = posIsLessThan(o1, o2);
        if (test != 0) {
            return test;
        }
        test = tensDigit(o1, o2);
        if (test != 0) {
            return test;
        }
        return numberButRev(o1, o2);
    }

    public static int tensDigit(Integer o1, Integer o2) {
        return (Math.abs(o1) / 10 % 10) - (Math.abs(o2) / 10 % 10);
    }

    public static int numberButRev(Integer o1, Integer o2) {
        return o2.compareTo(o1);
    }

    public static int posIsLessThan(Integer o1, Integer o2) {
        if (o1 < 0 ^ o2 < 0) {
            // different sign. Use the sign of o2.
            return o2;
        } else {
            // same sign.
            return 0;
        }
    }
}
```



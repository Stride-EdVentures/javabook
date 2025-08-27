# Constraint Typing

In this lesson we learn:  
1. why we need to constrain our types  
2. The syntax of Contraint Typing  

```java

    // TODO: show how this is the logical rewrite of the code
    public static <T extends Comparable<T>> void example3(List<T> list) {
        for (int i = 0; i < list.size() - 1; i++) {
            T t1 = list.get(i);
            T t2 = list.get(i+1);
            int cmp = t1.compareTo(t2);
            System.out.println(cmp);
        }
    }

    // found in the .class file to manage the Constraint. 
    public static <T extends Comparable<T>> void example3(List<T> list) {
        for(int i = 0; i < list.size() - 1; ++i) {
            T t1 = (Comparable)list.get(i);
            T t2 = (Comparable)list.get(i + 1);
            int cmp = t1.compareTo(t2);
            System.out.println(cmp);
        }
    }

    // runtime code after Type Erasure
    public static void example3(List list) {
        for(int i = 0; i < list.size() - 1; ++i) {
            Comparable t1 = (Comparable) list.get(i);
            Comparable t2 = (Comparable) list.get(i + 1);
            int cmp = t1.compareTo(t2);
            System.out.println(cmp);
        }
    } 
```

<a id="wildcards"></a>

## Constraint Typing
We can bound constrain type parameter, and we can have Bounded Wildcards. By constraining our types via **bounding**, we enable flexibility and code reuse. Let's look at each.  

### Constrain (Bound Type Parameter)
There are times where we require a parameter of a generic type to extend (or implement) something. We do this with as follows:  

```java
public static <T extends Comparable<T>> reverseCompare(T o1, T o2) {
    // We can't call `compareTo` if the object of type `T` doesn't
    // implement `Comparable`. Luckily, we required this in the prototype.
    return o2.compareTo(o1);
}  

```

### Bounded Wildcards  
Bounded wildcards make your code more flexible and reusable while maintaining type safety.  

Bounded wildcards in Java are used to impose restrictions on the types that can be passed to a generic method, class, or interface. They are represented using the `?` symbol (the **wildcard symble**), combined with bounds (`extends` or `super`) to define the range of acceptable types. There are three types of Bounded Wildcards.  

#### Upper-Bounded Wildcards (? extends T)

Restricts the wildcard to a specific type `T` or its subclasses.
Useful when you want to read data from a structure but not modify it.
Example:
```java
public void processNumbers(List<? extends Number> list) {
    for (Number num : list) {
        System.out.println(num);
    }
}
```

Here, list can accept `List<Integer>`, `List<Double>`, or any subclass of `Number`.

#### Lower-Bounded Wildcards (? super T)

Restricts the wildcard to a specific type `T` or its superclasses. Note that a class can be considered a superclass of itself. `T` is a superclass of `T`.   

In the code below we require the Comparator to have a generic type that is a superclass of `T`. This way, we can make use of the Comparator in the `Person` class, the superclass of `Kid`. We are also allowed to use the Comparator found in the `Kid` class.  

```java
public class Person {
    public int age;
    public static int compareByAge(Person p1, Person p2) {
        return p1.age - p2.age;
    }
}

public class Kid extends Person {
    public int dominance;
    public static int compareByDominance(Kid k1, Kid k2) {
        return k1.dominance - k2.dominance;
    }
 }

public class Example {
    public void example(Kid k1, Kid k2) {
        System.out.printf("Person Comparison: %d\f", 
                           reverseCompare(k1, k2, Person::compareByAge));
        System.out.printf("   Kid Comparison: %d\f", 
                           reverseCompare(k1, k2, Kid::compareByDominance));
    }

    public static <T> int reverseCompare(T o1, T o2, Comparator<? super T> comparator) {
        return comparator.reversed().compare(o1, o2);
    }
}
```

#### Unbounded Wildcards (?)

Represents an unknown type without any restrictions.
Useful when you don't care about the type but want to ensure type safety. This is especially helpful when we have to deal with `Type Erasure`.   
Example:
```java
// In this implementation, we want to assure that the object passed in
// is a Map and not a supertype or subtype. It must be exactly a Map.
// It can be a map with Keys and Values of any type.
// If it is a Map, then let's say that they are equal if they are
// the same size.
@Override
public boolean equals(Object obj) {
    // Using getClass() for equality checks is very strict and often discouraged 
    // unless you have a specific reason to disallow subclass equality. 
    // Most Java APIs (like Map.equals) use instanceof to allow flexibility.    
    if (obj == null || obj.getClass() != Map.class) {
        return false;
    }
    // We need to use `?` because there is no generic type defined
    // in this method. The method prototype has no `T` defined.
    Map<?, ?> other = (Map<?, ?>) obj;
    return other.size() == this.size();
}
```

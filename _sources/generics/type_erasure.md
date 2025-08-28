# Type Erasure

This is an advanced lesson about what happens under the hood when we use generics.  

Due to `Type Erasure` we:  
1. Cannot generically create objects.  
2. Must sometimes use `<?>` in our declarations.  

## What is Type Erasure
**TODO** 
Type Erasure is when the generic types get replaced with `Object`. This can be done because all classes inherit from `Object`. The benefit is that the code is implemented only once. We don't have multiple copies of the implementation.

The hope is that at compile time, the compiler would be able to identify type issues then. At runtime, we assume the types are correct. 

```java
    // ---- Code as the developer wrote it ----
    public static <T> T example(List<T> list) {
        T t = list.get(0);
        return t;
    }
    public static void callIt() {
        List<String> list = Arrays.asList("one", "two");
        String s = example(list);
    }

    // -------- Code after Type Erasure ----------

    public static Object example(List list) {
        Object t = list.get(0);
        return t;
    }

    public static void callIt() {
        // Generics are eliminated
        List list = Arrays.asList("one", "two");

        // Casting happens for you as necessary
        String s = (String) example(list);
    }
```
## Typical Type Erasure Example
```java
// This is the original code written by the developer
public static <T extends Comparable<T>> void example3(List<T> list) {
    for (int i = 0; i < list.size() - 1; i++) {
        T t1 = list.get(i);
        T t2 = list.get(i+1);
        int cmp = t1.compareTo(t2);
        System.out.println(cmp);
    }
}

// This is the code found in the .class file.
// Notice how the objects in the list are type cast to Comparable. 
public static <T extends Comparable<T>> void example3(List<T> list) {
    for(int i = 0; i < list.size() - 1; ++i) {
        T t1 = (Comparable) list.get(i);
        T t2 = (Comparable) list.get(i + 1);
        int cmp = t1.compareTo(t2);
        System.out.println(cmp);
    }
}

// The is what the code looks like at runtime after Type Erasure.
// All references to `T` and `<T>` are eliminated. 
public static void example3(List list) {
    for(int i = 0; i < list.size() - 1; ++i) {
        Comparable t1 = (Comparable) list.get(i);
        Comparable t2 = (Comparable) list.get(i + 1);
        int cmp = t1.compareTo(t2);
        System.out.println(cmp);
    }
} 
```
## Case Study : Create Array
Let's say that we wanted to write a method that would create an array of some unknown type, and then fill the array with that type. We might try the following:  
```java
// This code will NOT work!!
public static <T> T[] createArray(int n) {
    T[] arr = new T[n];
    for (int i = 0; i < n; n++) {
        arr[i] = new T();
    }
}
```
The above code doesn't work because of `Type Erasure`. At runtime, the type `T` is not known because it is replaced with `Object`. It cannot create a new instance of type `T`.  There are two ways to get around this.

### Use Collection Classes and Supplier
```java
    // Example call with type String: createList(5, String::new)
    public static <T> List<T> createList(int n, Supplier<T> cons) {
        // we are creating a collection that holds a generic type.
        // We create the list using the concrete class ArrayList
        List<T> list = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            list.add(cons.get());
        }
        return list;
    }
```

### Use Reflection
```java
public static <T> T[] example1(Class<T> clazz, int n)  {
    try {
        @SuppressWarnings("unchecked")
        T[] arr = (T[]) java.lang.reflect.Array.newInstance(clazz, n);

        Constructor<T> cons = clazz.getConstructor();

        for (int i = 0; i < n; i++) {
            arr[i] = cons.newInstance(); // clazz.getDeclaredConstructor().newInstance();
        }
        return arr;
    } catch (InstantiationException | IllegalAccessException | NoSuchMethodException | 
                SecurityException | IllegalArgumentException | InvocationTargetException e) {
        e.printStackTrace();
    }
    return null;
}
```

## Wildcards & Casting

Wildcards are especially helpful when we have to deal with `Type Erasure`. Read the comments in the following example:
```java
public class Example extends Map<String, String> {

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
        // When casting, we can't use Map<K, V> because 'K' and 'V'
        // are not defined anywhere. Not in the class or in the method.
        // More importantly, we can't use Map<String, String> because we don't
        // know the key/value types because this information got erased at runtime.
        // We must use Map<?, ?> because we can't make a type-safe cast due to
        // the key/value types truly being unknown at runtime.
        Map<?, ?> other = (Map<?, ?>) obj;
        return other.size() == this.size();
    }
}
```
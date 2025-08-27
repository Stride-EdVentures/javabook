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


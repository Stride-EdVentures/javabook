# Singleton

A Singleton is a design pattern that ensures a class has exactly one instance in an application and provides a global point of access to that instance. It is perhaps the most simple and widely used pattern, but it can be abused and over used.

## Typical Example
The easiest way to create a Singleton in a Java application is through a `static` field.

```java
public class MySingleton {

    // The single instance, stored in a static field that
    // gets `Lazy Initialized` by the getInstance() method.
    private static MySingleton instance;

    // An `Eager singleton` style would instantiate immediately.
    // Do not do this in addition to Lazy Initialization. Choose ONE!
    private static final MySingleton INSTANCE = new MySingleton();

    // Private constructor prevents direct instantiation
    private MySingleton() { }

    // Public method to get the single instance `lazily`
    public static MySingleton getInstance() {
        if (instance == null) {
            instance = new MySingleton();
        }
        return instance;
    }
}
```
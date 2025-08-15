# Anonymous Classes

## Default Methods

An interface can include a method with implementation. If an interface has only one abstract method, it is a Functional Interface. A Functional Interface can be implemented with Lambdas and method pointers. Note: an unimplemented method is called an abstract method.

```java
public interface MyInterface {
    public int countStuff(List<Integer> list);

    public default void defaultMethod() {
        // an instance method that has access to “this”
        countStuff(null);
    }
}
```

## Static Methods
An interface can statics methods with implementation. 

```java
public interface MyInterface {
    public int countStuff(List<Integer> list);

    public static void utilityMethod() {
        System.out.println("This is a static method.");
    }
}
```
# Full Review

## Recall the Uses of Interfaces
Interfaces are powerful and common. Below is a list of ways interfaces are used. **You are not expected to understand these examples yet.** Future lessons should add a lot of clarity.  

* **For Abstraction & Extensibility:** Here we see a method that accepts a `List<Integer>` instead of an `ArrayList<Integer>`. This allows the caller to use a variety of datastructures so long as they implement `List`, an interface. 
```java
public int calculateSumtin(List<Integer> list) { }
```

* **Functional Programming:** It is powerful to pass around functions as arguments or to have functions return functions. 
```java
public static void main(String[] args) {
    String[] fruit = { "apple", "cherry", "watermelon" };
    Consumable<String> behavior = getBehavior("I have a");
    actOnEach(Arrays.asList(fruit), behavior);
}

/**
 * Return a Consumable function that prints out the argument using
 * a given prefix. This makes use of a concept called "closures". 
 */
public Consumable<String> getBehavior(String prefix) {
    // create a function using Lambda syntax
    return s -> System.out.printf("%s %s\n", prefix, s);
}

public void actOnEach(List<String> list, Consumable<String> consumer) {
    // consume the elements in natural sorted order
    list.sort(null);
    for (String s : list) {
        consumer.accept(s);
    }
}
```

* **Callbacks that handle Events** is necessary and frequent in GUI Programming. This allows a program be be *Event Driven*, meaning that when the user of the application causes an event, code is triggered.  Here is example code for how callbacks can be implemented in a GUI application when setting up a menu.  
```java
private void createMenuBar() {
    JMenuBar bar = new JMenuBar();
    this.setJMenuBar(bar);

    JMenu menu = new JMenu("Options");
    JMenu item = new JMenuItem("Tickle", 'T');

    // Use a method pointer to fulfill the ActionListener interface
    item.addActionListener(this::myCallback);
    menu.add(item);
    bar.add(menu);
}
private void myCallback(ActionEvent ae) {
    System.out.println("That tickles!");
}
```

* We can **Customize functionality** such as how a list is sorted. We have a lesson dedicated to this activity.  
```java
public static void main(String[] args) {
    String[] fruit = { "apple", "cherry", "watermelon" };
    List<String> list = Arrays.asList(fruit);

    // get a Comparator from the Collections class to allow us
    // to sort this list in reverse order
    list.sort(Collections.reverseSort());
```

* We can **enable iteration via for-each loop** on an a class that didn't inheritly support it. We do this by implementing the `Iterable` interface and supplying (or implementing) the`Iterator` interface.  
```java
public class Dogs implements Iterable<Dog> {
    private List<Dog> dogs;

    // Return the iterator provided by the List<Dog> object.
    // We don't need to implement it directly. Whew!
    public Iterator<Dog> iterator() {
        return dogs.iterator();
    }

    public static void demoForEach() {
        Dogs myDogs = new Dogs();
        /* code that adds dogs not shown */

        // Iterate over the Dogs class directly, NOT List<Dog>
        for (Dog dog : myDogs) { ... }
    }
}

```

* **Try-with-resources** is built into Java and it allows a programmer to easily and safely close resources. We often do this when working with files so that we don't need to call the `close()` method. For example, the code below will create the `Scanner` in a try-with-resources clause. Whether the file is found or not, we are guaranteed to close the Scanner object correctly. Any class that implements `AutoCloseable` can be used this way.
```java
public void readFile(String filename) {
    try (Scanner parser = new Scanner(new File(filename))) {
        while (parser.hasNext()) {
            System.out.println(parser.next());
        }
    } catch (FileNotFoundException ex) { 
        // Let the user know the file wasn't found
    }
}
```

* **Streams** are a powerful way to process data using functional programming. See future lessons on how to use Streams.  

## Function&lt;T, R&gt;
```java
/**
 * The function TAKES something of type T
 * The function RETURNS something of type R
 */
public interface Function<T, R> {

    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument. The function TAKES something of type T
     * @return the function result. The function RETURNS something of type R
     */
    R apply(T t);

    // The `Function<T,R>` interface has other methods such as `andThen` and `compose`. 
    // These other methods are `default` methods, meaning that the functionality is actually
    // provided for you. The syntax can look pretty wonky!!  

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }
}
```
## Implementation Types
Students do not need to know about these implementation types.  

An "implementation type" describes where code is written. Where code is written will define its *scope* (where and how code can be referenced). These implemenation types leverage advanced techniques, and these lessons will only make use of Top-Level and Anonymous. We illustrate this simply to be more complete.     

While classes and interfaces have differences, they are mostly similar.  

|Type      |	Description|Class|Interface|
|----------|---------------|---------|-----|
|Top-Level|	Defined in its own file|Yes|Yes|
|Static Nested|	Statically defined inside another class|Yes|*implicitly* static|
|Inner|	Non-static class inside another class|Yes|No|
|Interface Nested|Defined inside an interface|No|Yes|
|Local|	Class inside a method|Yes|No|
|Anonymous|	Inline Implementation |Creates an anonymous class|Can anonymously extend an interface<br>Creates an anonymous class, not an interface|
|Package-Private|Non-public class in the same file|Yes|Yes|

TODO: Example Implementation types for Interfaces
```java
// Top-Level: in file MyInterface.java
public interface MyInterface {
    void act();
}

// Static Nested: in file MyClass.java
public class MyClass {

    public interface MyInterface {
        void act();
    }
}
```
# Applied Interfaces

In this lesson we will examine how interfaces are baked into the Java Language. We will examine `Iterable` and `AutoCloseable`.

## Iterable

All classes that are in the `Collection` classes will inherit from `Collection` and therefore will implement `Iterable`. 

```java
public interface Iterable<T> {
    public Iterator<T> iterator();
}

public interface Iterator<E> {
    public boolean hasNext();
	public E next();
	public void remove(); 
}
```

**TODO: Discuss this more.**

## AutoCloseable

Recall a `try-with-resources` where we add parentheses to the `try` portion. Inside the parentheses, we instantiate a resource object that needs to have `closed` called on it when we're all done using it. Closing it help keep the system clean and responsive.  

**In short:** A `try(Resource res)` will guarantee that `res.close()` is called.

```java
try (Scanner parser = new Scanner(new File("missing.txt"))) {
    // the parser object is scoped to this block of code
    System.out.println("Never reached");
} catch (FileNotFoundException ex) {
      // Good practice says we ought to do something here
} finally {
    System.out.println("Finally blocks are always called");
    // This next line is VERY BAD! Parser is out of scope. 
    // Closing is "redundant" anyway. parser is closed for us!
    parser.close(); 
}
```
This will work for any class that implements `AutoCloseable`, classes such as `Scanner`, `InputStream` and `Reader`. The list of classes that implement `AutoCloseable` is long. More importantly, you can write your own class.

```java
public class CloseableWork implements AutoCloseable {

    @Override
    public void close() {
        System.out.println("I'm closing myself now. Saul Goodman.");
    }

    public void doWork() {
        try (CloseableWork cw = new CloseableWork()) {
            System.out.println("I'm working. But, wait, I feel sick. I think I'm going to throw!");
            // Throw an UnChecked exception so that we don't have to catch it.
            throw new RuntimeException("Not really unexpected");
        }
    }

}

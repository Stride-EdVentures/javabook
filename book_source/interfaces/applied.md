# Applied Interfaces

In this lesson we will examine how interfaces are baked into the Java Language. We will examine `Iterable` and `AutoCloseable`. We will also take a look at `Listeners` in GUI programming.  

## Iterable

All classes that are in the `Collection` classes will inherit from `Collection` and therefore will implement `Iterable`. This allows the objects to be used in a `for-each` loop.  

Let's look at the two relevant interfaces.

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
The generic interface, `List` extends `Collection` (another interface) and therefore must implement `Iterable`. It turns out that not only can you use a List in a `for-each` loop, but any object that implements `Iterable` can be used in a `for-each` loop. You can create your own custom class to do this.   

There are **two questions** we will answer:
### How does the for-each work?
How is it that just because an object implements an interface that it can then be put into a `for-each` loop? This woeks because the compiler will translate a `for-each` loop into a `for` loop in the following way:

```java
// Beforehand, the "sugar" code looks like this:
for (Type t : iter) {
    System.out.println(t);
}

// The compiler verifies at compile time that `iter` is-a `Iterable<T>`.
// If not, then the compiler will throw an error. 
// 
// If all is good, the "unsugared" code looks like this.
// When running, this is the actual code that gets executed. 
for (Iterator<Type> it = iter.iterator(); it.hasNext(); ) {
    Type t = it.next();
    System.out.println(t);
}
```
The compiler gets the `Iterator` only if the object can provide an iterator. If the object does not implement `Iterable<T>`, then it cannot give an iterator and the compiler will throw an exception (fail to compile).  

With the iterator, the newly created for-loop will continually get items until `hasNext` returns false.  

### Why have two interfaces?
It might seem plausible to simply have the iterable object implement `Iterator` directly and circumvent the need for the `Iterable` interface altogether. We could eliminate the need to call `iterator`. This _could_ work except that we want to be able have nested loops where each loop iterates independently. Consider:

```java
for (Type t : iter) {
    // This inner loop has no dependency on the outer loop
    for (Type t : iter) {
        System.out.println("Inner: " + t);
    }
    System.out.println("Outer: " + t);
}
```
If the object didn't have a way to request a fresh instance of `Iterator` then the code above would not behave like a nested loop at all. The nested iterator would not have the ability to maintain its own, independent state. This is because there is only one object implementing the itertor. The `unsugared` code would look like this _buggy_ code:

```java
while (iter.hasNext()) {
    Type t1 = iter.next();
    while (iter.hasNext()) {
        Type t2 = iter.next();
        System.out.println("Inner: " + t2);
    }
    System.out.println("Outer: " + t1);
}
```
Having the `Iterable` interface and calling `iterator()` to get a new instance of an object that implements `Iterator` allows us to have nested loops that iterate independently.  

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
```

## Listeners
Listeners are interfaces that are _registered_ with objects. <a href="#footnotes"><sup>[1]</sup></a> We add a listener to a component so that when the user clicks on the component, we are informed and can react. When an event occurs on the component, the event information is dispatched to all listeners. The methods that are invoked (those that receive notifications) are called `Event Handlers`.

In Java GUI applications, several listener interfaces are commonly used to handle various types of events. Here are some of the most frequently used ones:  
1. **ActionListener:** Used for handling action events, such as button clicks and menu selections.  
2. **MouseListener:** Handles mouse events like clicks, presses, releases, and entering/exiting a component.  
3. **MouseMotionListener:** Deals with mouse movement events, such as dragging and moving the mouse.  
4. **KeyListener:** Manages keyboard events, including key presses, releases, and typing.  
5. **WindowListener:** Handles window events like opening, closing, iconifying (minimize), and deiconifying (restore) windows.  
6. **FocusListener:** Manages focus events, such as gaining or losing focus on a component.  
7. **ItemListener:** Used for handling item events, typically in components like checkboxes and radio buttons.  

```java
public class HelloDialog extends JPanel implements ActionListener {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.printf("Button %s was pressed!", e.getActionCommand());
    }

    public HelloDialog() {
        JButton btnHello = new JButton("Hello");
        this.add(btnHello);
        JButton btnSecond = new JButton("Surprise!");
        this.add(btnSecond;)
        
        // use a lambda expression to fulfill the ActionListener interface.
        // The method accepts an ActionEvent object that we ignore.
        btnHello.addActionListener(e -> System.out.println("Hello"));

        // use a reference to "this" dialog that implements ActionListener
        btnSecond.addActionListener(this);
        this.setVisible(true); 
    }
}
```

## What's so important?  (Summary)

<iframe width="280" height="190" src="https://www.youtube.com/embed/7qVlNiAYshQ?si=nndqiBeEeDHqN8fu&start=140&end=150" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>   

[Click here](https://www.youtube.com/embed/7qVlNiAYshQ?si=nndqiBeEeDHqN8fu) to see the full video reference.  

* Interfaces are used to leverage language extensions:  
    * AutoCloseable in a try-with-resources  
    * Iterable & Iterator in For-Each loops   
* We use interfaces to define methods that handle events.  
* We can use Method Pointers and Lambdas for Functional Interfaces.  
* Add a listener to a component to handle events triggered by the user and dispatched by the Event Dispatch Thread.  

<a id="footnotes"></a>

## Footnotes
[1] When a object registers for events, this follows the `Observer Pattern`. (TODO: put a link to this pattern, once created in this site)
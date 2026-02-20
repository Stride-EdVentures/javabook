# Lesson I6: Anonymous Classes

We've seen how lambda expressions is shorthand for creating a function that has no name. It is anonymous.  

Now, we will see how to create a single instance of a class that has no name. 

## Introduction
Anonymous Classes are usually refered to as **Anonymous Inner Classes** because they are declared inside another class or method. They are most commonly used to implement an interface with multiple `abstract` methods without the overhead of creating a dedicated class for the implementation. 

```{admonition} **Benefits**
_Anonymous Inner Classes_:  
* Help to reduce code clutter  
* Keep related code together  
* Eliminate the need for single-use class files    
```

## Syntax
The syntax can be strange at first. Here is an overly generic description of the syntax:  
```java
ClassOrInterface obj = new ClassOrInterface() {
    // code that implements needed methods   
}
```
When we create an _Anonymous Inner Class_, we create a single instance that can be referenced with an identifier of type _ClassOrInterface_, the same type that the _Anonymous Inner Class_ extended.  

Let's look at an example: 
```java
public class Example {
    public void go() {
        // declare an identier to reference our anonymous class.
        // The type of the idenifier is the "supertype" of the anonymous class.
        Comparator<Integer> comparator = 
            // The anonymous inner class creation starts now.
            // We create an instance of the class that has the nested code
            new Comparator<>() {
                @Override
                public int compare(Integer i1, Integer i2) {
                    return i1 - i2;
                }
            };  // <-- this semi-colon belongs to the assignment statement
    }
}
```
In the above code we have created a single instance of a class that has no class name; it is _anonymous_. We assigned the object instance to the identifier `comparator`. 

```{admonition} new an interface?!
It looks like the code instantiated an instance of an `interface`. But, we've learned that you cannot `new` an interface. In reality, while an interface appears directly after `new`, we created an instance of a class that implemented the interface. In the nested code segment, the developer is required to implement all `abstract` methods.
```
We can create equivalent code using familiar, named classes as follows:

```{code-block} java
:linenos:
public class NamedClass implements Comparator<Integer> {
    @Override
    public int compare(Integer i1, Integer i2) {
        return i1 - i2;
    }    
}

public class Example {
    public void go() {
        Comparator<Integer> comparator = new NamedClass();
    }
}
```
In the above code we created an instance of `NamedClass` that implements `Comparator<Integer>`. We can convert this to an anonymous implementation by:  
* Taking the body of the NamedClass on **Lines 2-5** and move them to come after the constructor found on **Line 10**.  
* Modify the `NamedClass()` constructor to be `Comparator<>`.  

## Class vs Interface
We can create an _Anonymous Inner Class_ from a _Concrete Class_, an _Abstract Class_, or an _Interface_. All that is required is that the anonymous class implements all `abstract` methods. An anonymous inner class cannot be abstract.   

All of the following work:
```java
    // MouseAdapter is a concrete class
    MouseAdapter ma = new MouseAdapter() { /* code */ };

    // InputStream is an abstract class
    InputStream is = new InputStream() { /* code */ };

    // Comparator is an interface
    Comparator<Integer> = new Comparator<>() { /* code */ };
```

## Common Usage
The most common usage is to create **Event Handlers** in a GUI application. Many Event Handlers are established using a `Functional Interface`, but not all events work this way. For example, here is code that sets up two listeners (Event Handlers).  
```java
public class ExampleDialog extends JPane {
    public void createComponents() {
        JButton btn = new JButton("Tickle Me");
        // set up an event handler using lambda expression
        // This works because the ActionListener is a Functional Interface
        btn.setActionListener( ae -> System.out.println("That tickles!"));
        this.add(btn);

        // Create a MouseListener with implementation for all abstract methods
        MouseListener ml = new MouseListener() {
            @Override
            public void mouseClicked(MouseEvent e) { /* code not shown */ }

            @Override
            public void mousePressed(MouseEvent e) { /* code not shown */ }

            @Override
            public void mouseReleased(MouseEvent e) { /* code not shown */ }

            @Override
            public void mouseEntered(MouseEvent e) { /* code not shown */ }

            @Override
            public void mouseExited(MouseEvent e) { /* code not shown */ }
        };

        this.addMouseListener(ml);
    }
}
```
Even with the `/* code not shown */`, the above code is pretty long. If fully implemented, the code would likely not be all that easy to read. This is especially unfortunate because it is common to need only one method such as `mouseClicked`. Luckily, there is support to make the code more readable.  

The Java Libraries offer a class called `MouseAdapter` that is a concrete class. It has a vacuous (empty) implementation for all of abstract methods. Furthermore, it also implements other interfaces: MouseMotionListener, MouseWheelListener, EventListener. This allows the developer to do the following:

```java
public class ExampleDialog extends JPane {
    public void createComponents() {
        
        // Create a MouseListener and selectively override one method.
        // This is so short, we can inline the Anonymous Inner Class as the argument
        this.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) { /* code not shown */ }
        });
    }
}
```

```{admonition} Key Idea
Anonymous Inner Classes are used to implement listeners that are **not** Functional Interfaces.  

Developers often override select methods of concrete classes that have vacuous implementation of these interfaces to dramatically shorten the code.
```

## What's so Important? ![Billy](../_static/whats_so_important.png)
Let's repeat the key ideas of this relatively short lesson. An Anonymous Inner class:
* is a child class that has no name… it is anonymous!  
* creates one object that overrides behaviors of its parent class (or interface)  
* uses a shorthand notation to reduce implementation overhead (reduces clutter, keeps related code together, eliminates the need for single-use class fils)  
* is often used to hook up an event handler  

The most common usage is to create an implementation of an `interface` that has multiple `abstract` methods.  
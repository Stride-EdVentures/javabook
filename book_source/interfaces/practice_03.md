# <i class="fas fa-pen-square fa-fw"></i> Practice Lambdas

**Question #1:** Write a lambda expression that is the same as the following method? Look for a `generic functional interface` that could be fulfilled by the method. Then, demonstrate how you would invoke the lambda expression.

```java
public void printMe(String msg) {
    System.out.println(msg);
}
```

```{admonition} Click to see answer
:class: dropdown hint
```java
// this lambda is equivalent to the `printMe` method above
msg -> System.out.println(msg);

// The method could fullfil a `Consumer<String>` interface.
Consumer<String> consumer = msg -> System.out.println(msg);

// invoke the method on the interface
consumer.accept("This will get printed.");
```

**Question #2:** Write a function named `getSum` that returns a `Function<String, Integer>` that will return the Integer value of the numeric value provided in the String plus 100. Write a second function named `getSumN` that will do the same thing, but return the sum of the number value provided in the String plus the value of `n` passed into `getSumN`.  Lastly, show how you might invoke the code you wrote.  

```{admonition} Click to see answer
:class: dropdown hint
```java

// recall what Function<T, R> looks like
public interface Function<T, R> {
    R apply(T t);
}

// return a function (wrapped up in an interface)
public Function<String, Integer> getSum() {
    return takes -> 100 + Integer.parseInt(takes);
}

public Function<String, Integer> getSumN(int n) {
    return takes -> n + Integer.parseInt(takes);
}

public void invokeItAll() {
    Function<String, Integer> fn1 = getSum();
    
    // Need to invoke `apply` to excute the parseInt code
    System.out.println(fn1.apply("50")); // outputs 150

    Function<String, Integer> fn2 = getSumN(4);
    System.out.println(fn2.apply("60")); // outputs 64
}
```

**Question #3:** Write a method `consumeAll` that will accept a List of integers and a `Consumer<Integer>` argument. Invoke the consumer behavior on every value found in the list.  

```{admonition} Click to see answer
:class: dropdown hint
```java
public void consumeAll(List<Integer> list, Consumer<Integer> consumer) {
    // explicitly use a for-each loop
    for (Integer n : list) {
        consumer.accept(n);
    }

    // The List interface offers us another way to do this!
    list.forEach(consumer);
}
```

**Bonus: Question #4:** This question requires that you know a bit about [Swing](https://beginnersbook.com/2015/07/java-swing-tutorial/). Write a simple dialog that has two buttons on it. When you click one button, "Hello" will be printed in the console. When you click the second button, the text of the Button will be printed to the console.  

For this question, you do not need to write the whole program.  

```{admonition} Click to see answer
:class: dropdown hint
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

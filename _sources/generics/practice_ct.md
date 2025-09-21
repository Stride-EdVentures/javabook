# <i class="fas fa-pen-square fa-fw"></i> Practice: Contraint Typing

**Question #1:** Write the prototype for a generic static method `answer1` that accepts a `List` where the objects in the list are guaranteed to be an instancof `Node`. Have the method return a `void`.  

```{admonition} Click to see answer
:class: dropdown hint
```java
public static <T extends Node> void answer1(List<T> list) { }
```

**Question #2:** Update this prototype so that the body of the method will work. Note that the method `compareTo` belongs to the `Comparable` interface.  
```java
public static <T> int reverseCompare(T o1, T o2) {
    return o2.compareTo(o1);
}  
```

```{admonition} Click to see answer
:class: dropdown hint
```java
public static <T extends Comparable<T>> int reverseCompare(T o1, T o2) {
    // We can't call `compareTo` if the object of type `T` doesn't
    // implement `Comparable`. Luckily, we required this in the prototype.
    return o2.compareTo(o1);
}  

```

**Question #3:** Update this prototype so that it is a proper generic that will process a list of any type of `Animal` (e.g. `List<Cat>`).

```java
public void processAnimals(List list) {
    for (Animal animal : list) {
        System.out.println(animal);
    }
}
```
```{admonition} Click to see answer
:class: dropdown hint
Note that we have two possibilities. They are subtly different.
```java
public void processAnimals(List<? extends Animal> list) {
    /* code that cannot add anything to the List (except null) */
    list.add(new Dog());    // ❌ What if it's actually List<Cat>?
    list.add(new Cat());    // ❌ What if it's actually List<Dog>?
    list.add(new Animal()); // ❌ What if it's actually List<Dog>?

    // due to Type Erasure, even the following fails
    list.add(list.get(0));  // ❌ Surprisingly fails!
}

public <T extends Animal> void processAnimals(List<T> list) {
    /* code that offers a bit more */
    T baby = list.get(0).makeBaby();
    list.add(baby);                    // this works
}
```
**Question #x:** This question does not make use of any **Constraints**... yet. It is a warm up to the next problem.  

Write the prototype for a generic instance method of a generic class with `<T>` defined. The method will be named `answer`. The method will accept two arguments:  
* A `Comparator` interface named `comparator`. The compare method will compare objects of type `U`.  
* A `Function` interface named `extractor`. The function will _take_ an object of type `T`. It will _return_ an object of type `U`.  

```java
public class Example<T> {
    // prototype for answer
}
```

```{admonition} Click to see answer
:class: dropdown hint

```java
public class Example<T> {
    public <U> void answer(Comparator<U> comparator, Function<T, U> extractor) { }
}
```
**Question #y:** This is an extension to the above question where we now add **constraints**.  

Write the prototype for a generic instance method of a generic class with `<T>` defined. The method will be named `answerMe`. The method will accept two arguments:  
* A `Comparator` interface named `comparator`. The compare method will compare any type that is a _supertype_ of a new generic type `U`.  
* A `Function` interface named `extractor`. The function will _take_ any type that is a _supertype_ of `T`. It will _return_ any type that is a _subtype_ of `U`.  

```java
public class Example<T> {
    // prototype for answerMe
}
```

```{admonition} Click to see answer
:class: dropdown hint

```java
public class Example<T> {
    public <U> void answerMe(
            Comparator<? super U> comparator,
            Function<? super T, ? extends U> extractor) { }
}
```
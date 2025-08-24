# <i class="fas fa-pen-square fa-fw"></i> Practice: Interfaces 101

**Question #1:** Describe the difference between an `interface` and a `class`.  

<details><summary>Click to see answer</summary>
The differences between an interface and a class is summarized in this table with more a more detailed explanation below.  

|  |`interface`|`class`|
|--|-----------|-------|
|Access modifier|must be `public`|unbounded|
|Abstract methods|*implicitly* `abstract`|May have `abstract` methods if the class is defined as `abstract`|
|Implementation allowed?|Only in `static` and `default` methods|yes|
|Hierarchy Keyword|`extends`|`extends`|
|Has fields|**NO**|yes|
|Has Constructors|**NO**|yes|

 
1. **Access modifiers** include `public` and `private`.  All the methods in an interface must be `public` while a class can have any and all access modifiers.  
2. **Abstract methods** have no implementation. A class can have abstract methods, but then the class must be defined as `abstract` and cannot be instantiated directly. An interface *implicitly* defines all its methods as `abstract`. However, it is possible for an interface to also have `static` and `default` methods which have implemenations. `default` is a keyword that defines an *instance* method with implementation.  
3. **Hierarchy** is defined with the `extends` keyword for both an interface and a class. This is because an interface can inherit the implementation of `default` methods. The `static` methods are not inherited and can only be accessed via the implementating class.  
4. **Fields** are not allowed in interfaces and, therefore, interfaces themselves don't have state. This gives the impression that interfaces don't require state, however, a class that implements an interface may have state. Consider the `iterator` interface which as the method `boolean hasNext`. This means that the class that implements the interface must know the current whether another element is available. This is state.  
5. **Constructors** appear only in classes, not in interfaces.  
6. **Implementation type** is an andvanced concept. (<a href="#implementation-types">see below</a>) It is sufficient to know that both an `interface` and a `class` are implemented with similar, but not identical, flexibility and restrictions. They are generally defined in their own file, but this isn't required. 
</details>
<hr>

**Question #2:** Create an interface and a class that makes a promise via the `implements` keyword. 
```{admonition} Click to see answer
:class: dropdown
```java
// define the interface in the file "GoodStudent.java"
public interface GoodStudent {
    void studyHard(String bookTitle);
    void goToOfficeHours(int duration);
}

// implement this class in the file "CSSStudent.java"
public class CSSStudent implements GoodStudent {
    public void takeExam(int quarter) { /* Code not shown */ }

    // Implement the interface GoodStudent
    public void studyHard(String bookTitle) { /* Code not shown */ }
    public void goToOfficeHours(int duration) { /* Code not shown */ }
}
```
</details>
<hr>

**Question #3:** Write code that illustrates how you can get access to interface methods via casting (aka *type casting*). Include code that will ask an object if it implements an interface. 
```{admonition} Click to see answer
:class: dropdown
```java
if (person instanceof Golfer) {
    Golfer golfer = (Golfer) person;
    golfer.play18Holes();
}
```

<hr>  

**Question #4:** Describe what the `IS-A` relationship means?  
```{admonition} Click to see answer
:class: dropdown
An `IS-A` relationship means that an object either *inherits* or *implements* something. For example, in the code beloce we can say all of the following:   
* `lunchItem` IS-A Fruit  
* `lunchItem` IS-A Apple  
* `lunchItem` IS-A Edible  

Furthermore, because Apple IS-A Fruit, we don't need to explicitly cast the new Apple into a Fruit identifier.   
```java
public interface Edible {
    void eat();
}
public class Fruit {
    public void juiceMe();
    public void ripenOnCounter();
}
public class Apple extends Fruit implements Edible {
    public void slice();
}
public static void main(String[] args) {
    Fruit lunchItem = new Apple();
}
```

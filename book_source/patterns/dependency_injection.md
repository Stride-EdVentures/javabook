# Dependency Injection

Dependency Injection (DI) helps address several problems that developers encounter by giving an object its dependencies from the outside rather than having the object construct them internally. This reduces coupling, enables easier testing through mocking, reduces the number of changes necessary to swap in a new implementation for a dependency, and increases interoperability in different contexts (e.g. production vs testing, online vs local).  


```{admonition} Inversion of Control
**Inversion of Control (IoC)** is a general principle. Instead of an object controlling it's own dependencies and flow, control is inverted to something else (e.g. Framework).  

> **IoC means** that an object does not control how its dependencies are created or selected.  
> **IoC means** that an object does not fully determine its own behavior. Some control over what it does, when it does it, or how it does it is delegated to external code.  
```

**Two Patterns of Inversion of Control:**
*   **Dependency Injection (DI)**
    *   Dependencies are *supplied* to an object by an external container
    *   Object does not create or locate its dependencies
    *   Dependencies are explicit (constructors, setters, fields)

*   **Service Locator**
    *   Object *asks* a central registry for its dependencies
    *   Object knows about the locator and how to use it
    *   Dependencies are hidden in implementation

**More Patterns of Inversion of Control:**  
There are other ways to achieve IoC that we will not discuss. We list a few more here to illustrate the various ways to delegate dependency resolution (or functionality) to an external entity/function. There are many ways that external code determines behavior.  
*   **Framework / Container Callbacks**: A Framework controls the execution flow and the user code is called at predefined lifecycle points. This is common in web servers, GUI frameworks, test frameworks.  
*   **Template Method**: The base class defines the algorithm, and subclasses fill in customizable steps. The base class controls the flow.  
*   **Observer/Event Listener/Callback**: Objects react to events via callbacks/listeners rather than polling. This is common in GUI and event-driven systems.  
*   **Plugin / Extension Architecture**: An application discovers and invokes external components such as plugins where the plugins do not control their own lifecycle or execution. This is common in IDEs, browsers, and game engines.  


```{admonition} Dependency Injection (DI)
:class: note
Dependency Injection is the most common way to achieve IoC.    

External code will control the specific implementation for a dependency and when & how it gets created. The object does not decide the class; the object does not internally construct the dependency with `new`.    
```

## Overview
In the Spring framework, Dependency Injection can happen only for **Beans**, objects that are controlled by the framework. Spring builds objects, manages them, and *"injects"* them where needed. This makes code more modular, testable, and flexible. The classes that implement the dependencies must be annotated with either `@Component` or `@Service`. All of these dependencies will be instantiated at the start of the application, and there will be only one instance. If there is a need to create multiple objects, then special care is necessary.  

**How are dependencies resolved?**  
Spring has several ways to resolve the dependencies. It can all feel *magical*. If the developer doesn't follow good practices, the code can end up poorly organized and fragile. An object requesting the dependencies needs to annotate its code with `@Autowired` so that Spring can identify when and where to inject them. Managing dependencies and testing flexibility becomes breeze with Spring when you properly annotate.  

The best practice is to use **Constructor Injection** for several reasons <a href="#footnotes"><sup>[1]</sup></a>. The primary reason is that constructor injection gives the developer more options and greater control.  

There are more details on how Spring manages IoC [here.](../frameworks/spring.md)  

## Three Forms of DI
There are three ways to inject dependencies.  
    1. Constructor Injection **(Recommended)**   
    2. Field Injection (Harder to test. Not recommended.)  
    3. Setter Injection (For optional dependencies)  

### Constructor Injection 
The Constructor Injection method enables one to easily to see what dependencies are required, supports immutability (dependencies are `final`), and works well with unit tests.

This is the preferred approach in modern Java. It becomes very easy to create the service in a test using the desired dependencies because Spring can be completely excluded from the process. When Spring is excluded then the tests can run faster with less *magic*.   

In the code below, Spring will automatically create exactly one instance of OrderService and automatically provide the PaymentProcessor dependency. This means that PaymentProcessor must also be a bean.  
```java
// Depencency Injection is best done with objects managed by Spring.
// We need to annotate with Component/Service to make it managed by Spring.
@Component
public class OrderService {
    // PaymentProcess is the dependency that Spring supplies
    private final PaymentProcessor payment;

    // This autowired annotation tells Spring to inject the constructor's arguments
    @Autowired
    public OrderService(PaymentProcessor payment) {
        this.payment = payment;
    }
}

// In a test file
public class MyTest {
    @Test
    void testOrderService() {
        // In this Test, we "manually" create/mock the dependency
        PaymentProcessor mockPayment = Mockito.mock(PaymentProcessor.class);
        OrderService service = new OrderService(mockPayment);

        // Run test...
    }
}
```
### Field Injection
Field Injection is very short and convenient. This style of injection is attractive, but can become problematic during testing. It breaks encapsulation, hides dependencies, and does not work outside of the framework providing the IoC. This means that the framework, and all its overhead, needs to be included in the tests. In fact, field injection is considered an <a href="#footnotes">anti-pattern<sup>[2]</sup></a> in most cases.  

Here is a short example of field injection. Note that the `@Autowired` is attached to the fields. There are no constructor arguments. 
```java
@Service
public class OrderService {
    @Autowired
    private PaymentProcessor payment;

    public OrderService() { 
        // Dependencies (payment) is NOT available yet.
        // Injection happens AFTER construction of this object.
    }
}
```
### Setter Injection
A Setter Injection allows one to optionally provide dependencies after construction. It can lead to an invalid state, is less safe, and it is less test-friendly.   

```java
public class OrderService {
    private PaymentProcessor payment;

    @Autowired(required=false)
    public void setPayment(PaymentProcessor payment) {
        this.payment = payment;
    }
}
```
## Post Construction DI
In the case that a class has dependencies that cannot be injected normally, the object can have the dependencies injected after construction. Normally, this would be a good time to use the Setter Injection, but there might be other circumstances at play. Spring offers other ways.  

**AutowireCapableBeanFactory**  
If you want Spring to decide the implementation for the dependencies, you can use a Spring specific class `AutowireCapableBeanFactory`. This class offers the ability to examine objects and their @Autowired annotations and to inject dependencies.  
> This should be considered an *anti-pattern*.  

**Manual Injection**  
The developer can create a Factory that determines the dependencies and then sets them after construction. This can also be done in a `@Configuration`.  

Here is an example Factory class that injects dependencies determined by Spring:  
```java
@Service
public class MyClassFactory {
    private final AutowireCapableBeanFactory beanFactory;

    @Autowired
    public AnimationFactory(AutowireCapableBeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }

    public MyClass createMyClass() {
        MyClass obj = new MyClass();
        // Spring injects dependencies into fields annotated with @Autowired
        beanFactory.autowireBean(obj);

        // do other desired initialization
        return obj;
    }
}
```
## What's so Important? ![Billy](../_static/whats_so_important.png)   
* Dependency Injection is a Design Pattern.  
* DI is a specific implementation of Inversion of Control.  
* There are several ways to do DI:  
    1. Constructor Injection (recommended)   
    2. Field Injection   
    3. Setter Injection   

## Footnotes
1. **Constructor Injection**: This is the preferred method of injection because it: 
   - Makes dependencies explicit and visible at class creation time. The constructor has access to the dependencies.  
   - Guarantees the object is fully initialized. Multi-step object creation is best done with a Factory or Builder pattern which are fine, but those methods add code. Less code is simpler.     
   - Improves testability by allowing direct construction with mocks or fakes. See [JUnit](../frameworks/junit.md) and [Mockito](../frameworks/mockito.md).    

2. **Anti-Pattern**: An anti-pattern is a common approach to solving a problem that seems reasonable at first but actually leads to poor outcomes in practice.
It's essentially a "bad habit" or flawed solution that developers repeatedly fall into, often because it seems like the obvious or easiest choice. Unlike design patterns (which are proven good solutions), anti-patterns are solutions you should avoid.
**Examples:**  
- **God Object** - One massive class that does everything, making code hard to maintain and test.  
- **Spaghetti Code** - Tangled, unstructured code with complex control flow that's nearly impossible to follow  
- **Golden Hammer** - Using the same familiar tool or pattern for every problem ("when all you have is a hammer, everything looks like a nail")  
- **Copy-Paste Programming** - Duplicating code everywhere instead of extracting reusable methods or classes  


# Dependency Injection

Dependency Injection (DI) helps address several problems that developers encounter by giving an object its dependencies from the outside rather than having the object construct them internally. This reduces coupling, enables easier testing through mocking, reduces the number of changes necessary to swap in a new implementation for a dependency, and increases interoperability in different contexts (e.g. production vs local).  

```{admonition} DI and IoC
**Inversion of Control (IoC)** is the general principle.  Instead of the code controlling the flow, another framework or container controls it.  

DI is the most common way to achieve IoC.  
**Summary:** 
- Inversion of Control (IoC) is the broad principle: a class doesn’t control how its collaborators are created or obtained; that control is inverted to something else (a framework, a factory, or the calling code). 
- Dependency Injection (DI) is a specific way to achieve IoC: one inject the dependencies (typically via constructors, setters, or method parameters) rather than constructing them internally with new.  
* IoC container is a tool that can automate DI and manage lifecycle. But once can do DI without a container—this is often called manual DI.
``` 

A container (like Spring) builds objects, manages them, and *"injects"* them where needed. This makes code more modular, testable, and flexible.

## Overview
Dependency Injection can happen only for **Beans**, objects that are controlled by the framework. The classes must be annotated with either `@Component` or `@Service`. All of these classes will be instantiated at the start of the application and there will be only one instance. If there is a need to create multiple objects, then special care is necessary.  

**How are dependencies resolved?**  
Spring has several ways to resolve the dependencies. It can all feel *magical* and if the developer doesn't follow good practices, the code can end up poorly organized and fragile. Dependencies need to be annotated with `@Autowired` so that Spring can identify them.   

The best practice is to annotate classes with `@Component` or `@Service`, to use **Constructor Injection**, and allow Spring to manage it all. Nothing else needs to be done. However, a developer may create a `@Configuration` class to control which objects are instantiated to fulfill a dependency. 

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
@Component
public class OrderService {
    private final PaymentProcessor payment;

    @Autowired
    public OrderService(PaymentProcessor payment) {
        this.payment = payment;
    }
}

// In a test file
public class MyTest {
    @Test
    void testOrderService() {
        PaymentProcessor mockPayment = Mockito.mock(PaymentProcessor.class);
        OrderService service = new OrderService(mockPayment);

        // Run test...
    }
}
```
### Field Injection
Field Injection is very short and convenient. This style of injection is attractive, but can become problematic during testing. It breaks encapsulation, hides dependencies, and does not work outside of the framework providing the IoC. This means that the framework, and all its overhead, needs to be included in the tests. In fact, field injection is considered an <a href="#footnotes">anti-pattern</a><sup>[1]</sup> in most cases.  

Here is a short example:
```java
@Service
public class OrderService {
    @Autowired
    private PaymentProcessor payment;

    public OrderService() { }
}
```
### Setter Injection
A Setter Injection allows one to optionally provide dependencies after construction. It can lead to anb invalid state, is less safe, and it is less test-friendly.  

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
In the case that a class has dependencies that cannot be injected normally, the object can have the dependencies injected after construction. Normally, this would be a good time to use the Setter Injection, but there might be other circumstances at play. Spring offers another way. 

> This should be considered an *anti-pattern*.  

The basic idea would be to create a Factory class as follows:  
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
1. **Anti-Pattern**: An anti-pattern is a common approach to solving a problem that seems reasonable at first but actually leads to poor outcomes in practice.
It's essentially a "bad habit" or flawed solution that developers repeatedly fall into, often because it seems like the obvious or easiest choice. Unlike design patterns (which are proven good solutions), anti-patterns are solutions you should avoid.
**Examples:**  
- **God Object** - One massive class that does everything, making code hard to maintain and test.  
- **Spaghetti Code** - Tangled, unstructured code with complex control flow that's nearly impossible to follow  
- **Golden Hammer** - Using the same familiar tool or pattern for every problem ("when all you have is a hammer, everything looks like a nail")  
- **Copy-Paste Programming** - Duplicating code everywhere instead of extracting reusable methods or classes  


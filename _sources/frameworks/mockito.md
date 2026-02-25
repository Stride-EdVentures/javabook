# Mockito

Mockito helps you create **mocks** so your unit tests can focus on a component in isolation. For example, it allows test code to run without requiring a real database, without making actual HTTP calls, and without waiting for slow dependencies to produce their lengthy results.  

In Mockito, a **mocked object** is a *test double* whose behavior you control. If you don't specify behavior for a method (via *stubbing*), Mockito supplies a default return. 

A developer can easily **stub out** simple behavior and then verify higher level interactions. Note that you can *stub out* methods only on mocks and spies.   

```{admonition} Good Practice
:class: note
Keep unit tests fast by stubbing all **external I/O**.
```

## Quick Example
In code example below, the goal is to test the `UserService` implementation. It depends on the `UserRepository` to perform the action `findNameById`. Instead, we *stub* out *findNameById* to eliminate that dependency and to assure behavior.  
 

```java
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;

class UserServiceTest {
    @Test
    void getsUserName_fromRepositoryMock() {
        // quick mock of a UserRepository. No stubbing. 
        UserRepository repo = mock(UserRepository.class); 

        // quick stub with a canned result, "Ada"
        when(repo.findNameById(42L)).thenReturn("Ada");

        // The UserService depends on the UserRepository.
        // Here we directly inject the dependency with a Constructor Injection
        UserService service = new UserService(repo); 
        String result = service.getUserName(42L);

        // No DB calls actually happen because of the stub.
        // With the stub, the behavior is deterministic and quick.
        assertEquals("Ada", result);
    }
}
```
This shows quick ways to mock and isolate. Here we see:  
* `mock(...)` creates a dummy object.  
* `when(...).thenReturn(...)` stubs the method. It means that when the method is invoked, dependencies (external systems) are not used because we provided the actual behavior.

```{admonition} Good Practice
:class: note
While tht test above may seem *dumb*, you need to zero in on the **concept**. We are **isolating** the code we want to test and **eliminating dependencies**.  

*UserService* does more than just delegate to the *UserRepository*. We are testing all that *UserService* does without testing *UserRepository*.
```
   
## Annotations
Mockito comes with a lot of annotations. In order for the annotations to work, the testing class must first be annotated as follows:  
```java
@ExtendWith(MockitoExtension.class)
public class TestWithMockito {
    @Mock // this now works
    private MyDependency dep;
    ...
}
```
The `@ExtendWith` annotation bootstraps Mockito's annotation processing; it enables `@Mock`, `@Spy`, `@InjectMocks` and more.  

Here are some common annotations and what they do:  

| Annotation  | What It Does |
| -------------- | -------- |
| **`@Mock`**   | Creates and manages a mock instance for you. Mockito handles its lifecycle. You can *stub* a mocked object. |
| **`@InjectMocks`**  | Creates a real instance and injects the mocks into its constructor, fields, or setters. Use this annotation to create the object you intend to test. This instance cannot be stubbed (spied).|
| **`@Spy`** | Wraps a real instance; real methods run unless you explicitly stub them. Useful for partial mocking. |
| **`@Captor`**  | Provides a type‑safe `ArgumentCaptor` for capturing method arguments during verification. |

> Note: A lot of documentation will use the acronym `SUT` to refer to the `System Under Test`. This is the class or object you are testing. This is the *target* of your tests that you are isolating from dependencies.  

## Mocked but Unstubbed
When an object is *mocked but unstubbed*, the method return the following default values:  


| Category | Default Behavior for Mocked Methods  |
| ------------------------- | ------------------ |
| **Primitives**            | Returns `0`, `false`, or `'\0'` depending on type                                         |
| **Wrappers / Objects**    | Returns `null`                                                                            |
| **Collections & Maps**    | Returns an empty collection/map (e.g., `Collections.emptyList()`)                         |
| **Optional**              | Returns `Optional.empty()`                                                                |
| **Streams**               | Returns an empty stream (e.g., `Stream.empty()`)                                          |
| **void methods**          | Performs no action (no‑op)                                                                |
| **toString()**            | Returns a Mockito‑generated identifier such as: *Mock for MyService, hashCode: 123456*    |
| **equals() / hashCode()** | Uses identity equality — the mock equals itself and has a stable identity‑based hash code |

<details><summary>**Extra: Overriding Default Answers**
</summary>
Mockito lets you customize the return values of mocked, but **NOT stubbed**, methods. You can set a different *default answer*:

1) **Smart nulls** — helpful failure messages  

```java
Repo repo = mock(Repo.class, RETURNS_SMART_NULLS);
```

Unstubbed methods still return "defaults", but references that would be `null` may become *smart nulls* that throw with a helpful message if triggered.  

2) **Deep stubs** — fluent chain-friendly<a href="#footnotes">[1]</a> mocks  

```java
OrderService svc = mock(OrderService.class, RETURNS_DEEP_STUBS);
when(svc.currentOrder().billing().getCurrency()).thenReturn("USD");

// Unstubbed intermediate calls like currentOrder() and billing() return mocks,
// so fluent chains don't throw a NullPointerException.
```

Great for fluent APIs or builders, but use judiciously (can hide design issues if overused).

 3) **Custom default answer**  

```java
Repo repo = mock(Repo.class, withSettings()
        .defaultAnswer(invocation -> {
            // return a sensible default per method/return type
            if (invocation.getMethod().getReturnType() == String.class) return "DEFAULT";
            return RETURNS_DEFAULTS.answer(invocation);
        }));
```

You can program your own strategy for all unstubbed methods.
</details>

## Mock, Spy, InjectMocks
These annotations add greater power and flexibility in your testing.  

Consider this example code:   
```java
@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock // auto-created mock (like Dependency Injection)
    Gateway gateway;    

    @Spy  // partial mock (real unless stubbed)
    Logger logger = new Logger(); 

    @InjectMocks  // PaymentService will receive gateway & logger
    PaymentService service;

    @Captor 
    ArgumentCaptor<String> idCaptor;

    @Test
    void chargesThroughGateway_andLogs() {
        when(gateway.charge(anyString(), eq(100))).thenReturn(true);

        boolean ok = service.process("order-123", 100);

        assertTrue(ok);
        verify(logger).info(idCaptor.capture());
        assertEquals("order-123", idCaptor.getValue());
    }
}
```
**`@ExtendWith(MockitoExtension.class)`:**  
This says, *"Turn Mockito features on for this test class."*  

It tells JUnit to enable Mockito's annotation system. Without it, annotations like @Mock, @Spy, @InjectMock, and @Captor won’t work. MockitoExtension automatically creates mocks, injects them, and handles cleanup.


**`@Mock`**:  
This say, *"Give me a pretend object so the test only focuses on what I'm testing."*  

@Mock *automatically* provides a mock object without you having to create it directly. This is similar to how dependency injection works. You're not manually wiring it together.    

Mockito:  
*   Creates a **mock object** for you. You do *not* need to construct it. Mockito does it for you.
*   Manages its lifecycle during the test.
*   Injects it into your class during testing when used with `@InjectMocks`.

**`@Spy`:**  
This says, *"Use the real object, but let me intercept or override calls if I want."*
*   Wraps a **real object**. This is called a **partial mock**.
*   Real methods run *unless* you override them with stubbing.


**`@InjectMocks`**:  
This says, *"Build an object for me and plug in all the mocks/spies it needs."*
*   Creates the *PaymentService* instance for the test.
*   Automatically injects the `@Mock` and `@Spy` fields into it.

**`@Captor`**:  
This says, *"Capture whatever argument was passed so I can assert on it later."*   

@Captor allows you verify impacts to arguments that were passed to a mocked method.  

```{admonition} Good Practice
:class: note dropdown
It is Mr. Stride's opinion that developers should limit Argument Captures and `InOrder` because they can be a *code smell*. When a test begins to rely upon verifying the impact to arguments, or how many times a method was called, or the order in which things were called, then there becomes a tight coupling between the specific implementation of the behavior being tested and the test itself. This means that if the implementation changes (e.g. to become more efficient, to use a different library, to accommodate extended capabilities) then the tests are likely to fail.  

When a test fails even while the implementation is still correct, this illustrates test fragility that the developer must address. Repeated failures are annoying and are a waste of time because one is spending time correcting a test instead of improving the product's functionality. This can result in the developer choosing to overly simplify the test, or the developer turning the test off. Either way, now the tests are effectively dead weight, sucking up resources and adding no value.  

In summary, when the act of improving implementation causes a test to fail, this can mean a bad test, or worse yet, a bad design. Argument Captors are good at testing the side effects of a method instead of its direct contribution. There is a time and a place where Argument Captors are appropriate. However, the design of a system should strive to minimize functionality that relies on side effects. Instead, a system should have modules & methods that are directly testable.  

Argument Captors can be an indication of a bad design or the start of a fragile test. A developer should use these **practical heuristics**:  
* **Can I assert the outcome instead of the path?** If yes, drop interaction verification.  
* **Is the collaborator a boundary adapter where the output is the point?** If yes, captors are acceptable, but assert the contract, not incidental fields.  
* **Is the order itself a business rule?** If yes, use InOrder; otherwise don’t.  
* **Am I verifying something I can move into a pure function?<sup>[2]</sup>** If yes, extract and unit-test it.  
* **Would a fake make this more robust?** If yes, prefer a fake.   

In conclusion, `ArgumentCaptor` and `InOrder` are *sharp* tools; use them sparingly and intentionally. Overuse is a code smell (*too much behavior hidden in side effects*) and a test smell (*overspecification*). Favor *outcome-based* and *contract-based* assertions, pure function<sup>[2]</sup> extraction, and fakes/integration tests where they remove the need to police internal call choreography.
```

### Diagram of Dependencies
Here is an ASCII Diagram
```text
                 (Test Class)
                 ┌─────────────────────────────┐
                 │ @Mock    MyDependency dep   │  ← Fake/spy-able dependency
                 │ @Mock    OtherDep otherDep  │
                 │ @Spy     AuditLogger logger │  ← Real obj (partial mock)
                 │ @InjectMocks MyService sut  │  ← SUT (real instance)
                 └──────────────┬──────────────┘
                                │ injection (by @InjectMocks)
                                ▼
                          ┌───────────────┐
                          │   MyService   │  ← SUT (real)
                          ├───────────────┤
 uses these deps  ──────> │ dep           │  ← mock (stub/verify allowed)
 uses these deps  ──────> │ otherDep      │  ← mock (stub/verify allowed)
 uses these deps  ──────> │ logger        │  ← spy (real + selective stubbing)
                          └───────────────┘
```
```{admonition} Spies vs. Mocks
:class: note
**Mock**: all methods return defaults unless stubbed.  
**Spy**: wraps a real instance; **real methods run** unless you stub them.    

**Good Practice:**  
When stubbing spies, prefer `doReturn(...).when(spy).method(...)` to avoid invoking the real method during stubbing.

Here is code inside a test method that creates a Spy.  
```java
MyComponent real = new MyComponent();
// invoke Mockito's spy method to create a spy of the real object
MyComponent spyObj = org.mockito.Mockito.spy(real);

// Override just one method; others stay real:
doReturn(42).when(spyObj).compute(); 
```

## What's so Important? ![Billy](../_static/whats_so_important.png)   
* Mockito lets you isolate a class under test by replacing real dependencies with **mocks**, so tests run fast, deterministically, and without touching external systems.  
* Mockito allows a developer to override specific methods during a test via **stubbing**. For example, `when(...).thenReturn(...)` lets you specify exactly what a mocked method should return, allowing you to test logic without relying on real dependency behavior.
* Annotations simplify setup. Here are some annotations:  
    *   `@Mock` creates fake dependencies
    *   `@Spy` partially wraps real objects
    *   `@InjectMocks` wires mocks into the class under test
    *   `@Captor` captures arguments
    *   `@ExtendWith(MockitoExtension.class)` activates all of the above for JUnit 5
* Mockito can test whether methods were called or not, and to inspect the arguments of a method.   

## Footnotes
[1] A **fluent chain** (or *fluent interface*) is a style of method calling where each method returns an object that allows another method to be called immediately, forming a **chain** of calls that reads more like natural language.

Here is a simple example of a fluent chain:  
```java
svc.currentOrder().billing().getCurrency();
```
Each method returns the same object (often `this`), allowing the next method to be called using the chaining pattern. This is a good design, but in Mockito, if any intermediate method in a fluent chain returns `null`, the chain will throw a NullPointerException. Mockito address this with **deep stubs**. This makes fluent chains safe to use in unit tests without having to manually stub every intermediate method.  

```java
// Example Deep Stub to reduce NullPointExceptions in a fluent chain
MyService service = mock(MyService.class, RETURNS_DEEP_STUBS);

// Now, fluent chains succeed because methods return a mock.
```

[2] A **pure function** is a function that always gives the same output when given the same inputs and does nothing except compute and return a value. It does not read or modify external state, write to files, call databases, or change anything outside itself. Because a **pure function has no side effects**, it is predictable and easy to test: you simply check whether its return value is correct for a given set of inputs.

For example, the function below is pure because it only depends on its parameters and returns a value without changing anything else:
```java
int square(int x) {
    return x * x;
}
```
Calling `square(5)` will *always* return `25`, and the call never affects the rest of the program, making it simple, reliable, and ideal for unit testing.

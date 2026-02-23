# <i class="fas fa-pen-square fa-fw"></i> Practice: Mockito

**Question #0**: What is the purpose of Mockito?  

```{admonition} Click to see answer
:class: tip dropdown
The purpose of Mockito is to enable quick and easy ways for unit tests to focus on a component in isolation. It does this by allowing developers to mock dependencies so tests become reliable, fast, and consistently predictable. By removing external noise, Mockito lets us control the behavior of dependencies and build highly focused and customizable tests. For example, it allows test code to run without a real database, without making actual HTTP calls, and without waiting for slow services to produce their lengthy results. 
```

**Question #1**: This sentence is about the default values returned by a mocked object.  Fill in the blanks.  

A mocked method that is not stubbed will return ______ for objects, ______ for primitives, and an ______ collection for lists/maps. 

```{admonition} Click to see answer
:class: tip dropdown
A mocked method that is not stubbed will return `null` for objects, `0/false` for primitives, and an `empty` collection for lists/maps.
```

**Question #2**: Provide the **stubbing** code in the following:
```java
@Test
void returnsHello() {
    MyRepo repo = mock(MyRepo.class);

    // TODO: stub repo.fetchMessage() to return "Hello"

    assertEquals("Hello", repo.fetchMessage());
}
```
```{admonition} Click to see answer
:class: tip dropdown
Here is the code to complete the **stub**. The code reads close to actual English: *"When the method `repo.fetchMessage()` is called, don't do anything, just return the string `Hello`"*.  
```java
when(repo.fetchMessage()).thenReturn("Hello");
```
 

**Question #3**: When would a developer use `@Mock` instead of using the `mock()` API directly?  For example, the code below shows two tests, each creating a mock in a different way. Is one better than the other? Why?    
```java
@Mock
public MyDependency dep;

@Test
void test_using_auto_mock() {
    MyTestTarget target = new MyTestTarget(dep);
    boolean actual = target.action();
    assertTrue(actual);
}

@Test
void test_using_manual_mock() {
    MyDependency dep = Mock(MyDependency.class);
    MyTestTarget target = new MyTestTarget(dep);
    boolean actual = target.action();
    assertTrue(actual);
} 
```

```{admonition} Click to see answer
:class: tip dropdown
 
**Why use `@Mock`:**  
An object being tested (the *target* object) may have multiple dependencies that need to be injected. A suite of tests may require a mocked object to be created and used in many tests. Therefore, the use of `@Mock` can make tests cleaner as it provides automatic setup and automatic injection. It keeps tests cleaner and easier to read, especially when **multiple mocks** are involved.  However, using `@Mock` requires `@ExtendWith(MockitoExtension.class)` and is more heavy-handed.  

**Why use `mock()`:**  
The `mock(Dependency.class)` API is useful for creating mocks inside a method where the mocked object is not a field of the testing class. It can be clearer in small, simple test classes. Directly mocking the object makes the code more explicit and transparent which can, at times, be helpful to a developer reading the code.  
```

**Question #4**: Explain the difference between `@Mock` and `@Spy`.  

```{admonition} Click to see answer
:class: tip dropdown
Recall that the purpose of Mockito is to isolate the testing to the target by mocking out the dependencies.

@Mock = everything is fake + optional stubbing.  
@Spy = real object + optional stubbing. 
```

**Question #5**: Provide the missing annotations in the snippet of code. Critically analyze and explain your answer?  

```java
@ExtendWith(MockitoExtension.class)
class SnippetA {

    // TODO: Annotation goes here
    MyDependency dep;

    @InjectMocks
    MyService service;

    @Test
    void test_action() {        
        when(dep.actionA("example")).thenReturn(true);

        boolean ok = service.action("example");

        assertTrue(ok);
        verify(dep).actionA("example");
    }
}
```

```{admonition} Click to see answer
:class: tip dropdown
We can annotate MyDependency with either @Mock or @Spy, depending on our goals.   

`@Spy` will work in this sample code only if MyDependency has a zero-argument constructor. If MyDependency required arguments, then either we'd have to change the code to explicitly call `new MyDependency(args);`. Alternatively, we can use @Mock which avoids the constructor altogether by creating a *test double*.    

@Spy will create a real object where all the methods work as implemented. If we **want** these methods to be invoked normally, then @Spy is the right choice. If these real implementations cause instability in our test, then @Mock would be a better choice.  

If we annotate with `@Mock`, then all the methods will return the *default* values of a mocked object. This can cause the test to run faster, or it could mistakenly cause the test to fail. It depends on the methods called, and how integral they are to the success of `service.action`.  

Both annotations allow us to *stub* the method `actionA`. However, spies ought to use  `doReturn(...).when(spy).method()` to avoid invoking real methods during stubbing.   

In conclusion, the better choice here is likely @Mock because the code is likely to be faster and more isolated. Furthermore, the way the method was stubbed is not preferred for a spy.  
```

**Question #6**: Explain what the Mockito method `verify` does?  


```{admonition} Click to see answer
:class: tip dropdown
Mockito's `verify()` method is a powerful tool for ensuring that your code interacts with its dependencies as expected, and it will throw an exception upon failure.  

The verify method in Mockito is particularly useful for:  

1. Checking if certain methods on mock objects were called with specific arguments.  
2. Verifying the number of times a method was called.  
3. Verifying that an object was not used at all--that there were zero interactions with the object.  
3. Verifying the order of interactions with an object.  

> One should approach these types of tests with caution because they start to test **how** a behavior works instead of **if** a behavior works. Once you start assuring that a behavior takes certain actions in its implementation, then the tests get tied to that specific implementation. If the implementation changes, but the behavior is still correct, then the tests could break, which increases maintenance and developer frustration.  

Use interaction verification when the outcome is primarily side‑effects to collaborators. Let me explain...  

Sometimes a method does not return anything meaningful, and its whole purpose is to tell another object to do something. In those cases, the observable behavior is the interaction itself. So instead of checking return values (because there aren't any), the only way to confirm correct behavior is to verify that the right collaborator was called.  

> **IMPORTANT:** Keep it minimal: verify only what matters to the contract.
```
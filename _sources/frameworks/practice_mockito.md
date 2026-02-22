# <i class="fas fa-pen-square fa-fw"></i> Practice: Mockito

**Question #1**: Fill in the blanks.  
A mocked method that is not stubbed will return ______ for objects, ______ for primitives, and an ______ collection for lists/maps. 

Answer: A mocked method that is not stubbed will return null for objects, 0/false for primitives, and an empty collection for lists/maps.

**Question #2**: Explain the difference between @Mock and @Spy.   
Answer:  

**Question #3**: Fill in the missing line so this test passes by stubbing the mock:
```java
@Test
void returnsHello() {
    MyRepo repo = mock(MyRepo.class);

    // TODO: stub repo.fetchMessage() to return "Hello"

    assertEquals("Hello", repo.fetchMessage());
}
```

Answer: 
```java
when(repo.fetchMessage()).thenReturn("Hello");
```

**Question #4**: Explain the difference between @Mock and @Spy.  

Answer:  
@Mock = everything is fake.  
@Spy = real object + optional stubbing.  

**Question #5**: When would a developer use @Mock instead of using the mock() API directly?  

Answer:  
Use @Mock when you want cleaner tests, automatic setup, and automatic injection. It keeps tests cleaner and easier to read, especially when multiple mocks are involved.  @Mock requires @ExtendWith(MockitoExtension.class) and is more heavy-handed. 

The mock(Logger.class) API is useful for creating mocks inside a method, not as fields. It can be clearer in small, simple test classes. 

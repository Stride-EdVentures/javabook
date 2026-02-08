# Spring

The core goals of Spring are:

* **Dependency Injection (DI):** Promotes loose coupling by managing object creation and wiring.  
* **Aspect-Oriented Programming (AOP):** Helps separate cross-cutting concerns like logging, security, and transactions.  
* **Simplified Configuration:** Reduces boilerplate code via annotations and XML configuration. This helps one create *microservices*.   
* **Integration Support:** Easily integrates with other frameworks like JUnit and Mockito, making it easier for developers to write clean, maintainable, and testable code.
* **Web Development:** Spring MVC provides a powerful way to   build web applications.  
* **Security:** Spring Security offers robust authentication and authorization mechanisms.    

While Spring is mostly for Web Development, we will be focusing on the features beneficial to a **client** application. In particular, we will look at how it helps us create services and supports [Dependency Injection](../patterns/dependency_injection).  

> Note: We will be using **Spring Boot** which is a modernized and lite weight version of its predecessor.  

## Services
A service should be stateless, thread-safe, and idempotent<a href="#footnotes"><sup>[1]</sup></a>. With these qualities we can create a **Singleton** object, one and only instance of the service to field all the requests.  

**Service** simply means *"business logic layer"* and doesn't necessarily imply an online, web-based architecture. It's the go-to naming convention for classes that orchestrate operations and coordinate between different concerns.  

Spring allows a developer to easily create a Service with the `@Service` annotation.  

```{admonition} Microservices
:class: dropdown
A good **Architectural Approach** is *Microservices*.  
> Microservices is an architectural approach where you build an application as a collection of small, independent services that each focus on a specific business capability.  

Each microservice runs in its own process, manages its own data, and communicates with other services through well-defined APIs.  

Key characteristics include:
- **Independence:** Each service can be developed, deployed, and scaled *independently*.  
- **Single responsibility:** Each service handles one business domain or capability.  
- **Decentralized data management:** Services own their own databases rather than sharing one.  
- **Technology diversity:** Different services can use different programming languages, frameworks, or databases.  
- **Fault isolation:** If one service fails, it doesn't necessarily bring down the entire system.  

Even for in client-based application, these characteristics are good to have. These concepts are discussed further in the [SOLID Lesson](../patterns/solid). 
```

## Annotations
There are many annotations that come with Spring Boot. Here are some of the top-level annotations.  
### Core Component Annotations
- `@Component` is the most generic stereotype annotation. It marks a class as a Spring-managed component, meaning Spring will detect it during classpath scanning and register it as a bean in the application context. Use this when your class doesn't fit into a more specific category.  
- `@Service` is a specialization of @Component that indicates a class holds business logic. While functionally identical to @Component, it provides semantic meaning and makes your code more readable. Use this for your service layer classes.  
- `@Repository` is another `@Component` specialization for data access classes. It provides additional benefits like automatic exception translation from database-specific exceptions to Spring's *DataAccessException* hierarchy.  
- `@Controller` marks a class as a Spring `MVC controller` that handles web requests. The `@RestController` annotation combines @Controller with @ResponseBody, making it ideal for RESTful web services.  

### Dependency Injection:
- `@Autowired` tells Spring to automatically inject dependencies into your class. You can use it on constructors **(preferred)**, *setters*, or *fields*. (See [Dependency Injection](../patterns/dependency_injection)) Spring will find a matching bean in the application context and wire it in. Constructor injection is generally recommended over field injection for better testability.   
- `@MockitoBean` is an annotation that uses Mockito under the hood to replace a bean (to Mock a dependency) in the Spring ApplicationContext. See the Spring Configuration and Testing in [Dependency Injection](../patterns/dependency_injection) 
 
### Configuration:
- `@Configuration` indicates a class contains bean definitions. Methods annotated with @Bean inside a @Configuration class will be called by Spring to register those beans in the application context.  
- `@Bean` is used on methods within @Configuration classes to explicitly define beans. The method's return value is registered as a bean in Spring's Application Context.  
-@`SpringBootApplication` is put on the application Main class with the main method.  

### Testing:
- `@SpringBootTest` is used in integration tests to load the complete application context. It bootstraps the entire Spring Boot application, allowing you to test with all your actual beans and configurations. While this is convenient and easy, it is discouraged because it is heavy-weight. For faster, more isolated unit tests, developers should try to avoid this annotation. Using it can *launch* the application and trigger unintended behavior (e.g. GUI appearing).

- `@TestConfiguration` is used to define additional beans or override existing beans specifically for testing purposes. Unlike @Configuration, it won't be picked up by component scanning in your main application. You typically use it as a static inner class within your test or import it explicitly in your test with @Import. This is helpful when you need to mock certain beans or provide test-specific configurations without affecting your production code.  

These annotations work together to provide Spring's dependency injection, component scanning, and configuration capabilities that make Spring Boot development straightforward.  

## Beans
In Spring Boot, a **bean** is simply an object that is created, managed, and maintained by the Spring IoC (Inversion of Control) container.

A bean is just a regular Java object, but instead of creating it with the `new` keyword, Spring creates it and keeps track of it. Spring handles the bean's entire lifecycle—instantiation, dependency injection, initialization, and destruction. This can make the code more modular, testable, and loosely coupled.

Spring discovers and registers beans using the annotations @Component and @Service. In the following example both `ImageService` and `ImageProcessor` are beans, and the ImageProcessor has a dependency on ImageService which is injected in the constructor.
  
```java
@Service
public class ImageService {
    // This becomes a bean managed by Spring
}

@Component
public class ImageProcessor {
    private final ImageService imageService;
    
    @Autowired
    public ImageProcessor(ImageService imageService) {
        // Spring automatically injects the ImageService bean argument.
        // This is called `Constructor Injection` and is the preferred method of DI.
        this.imageService = imageService;
    }
}
```

When the application starts, Spring creates one instance of ImageService (by default, beans are [singletons](../patterns/singleton)) and automatically injects it into ImageProcessor. The application code never includes `new ImageService()` because Spring handles it all. However, when writing tests, one would want to explicitly instantiate services, real or mocked, to control the tests to make them predictable.  


## Spring Configuration and Testing
Spring will look at the return type of methods annotated with `@Bean` and call these methods to instantiate beans.   
```java
@Configuration
public class AppConfig {
    @Bean
    public ImageService imageService() {
        MySpecialImageService imgSvc = new MySpecialImageService();
        imgSvc.customInit();
        return imgSvc;
    }
}

// In a Test we can override the registered beans
@SpringBootTest
@Import(MyTest.TestConfig.class)
public class MyTest {
    @TestConfiguration
    static class TestConfig {        
        @Bean
        @Primary // use this bean over any other
        public ImageService imageService() {
            ImageService mocked = new ImageService() {
                @Override
                public BufferedImage getImage(String name) {
                    return Mockito.mock(BufferedImage.class);
                }
            };
            return mocked;
        }
    }
}
// Alternatively a Test can override the registered beans with Mockito
@SpringBootTest
@Import(MyTest.TestConfig.class)
public class MyTest {
    @TestConfiguration
    static class TestConfig {        
        @Bean
        @Primary
        public ImageService imageService() {
            ImageService mocked = Mockito.mock(ImageService.class);
            when(mocked.getImage(anyString()))
                .thenReturn(Mockito.mock(BufferedImage.class));
            return mocked;
        }
    }
}

// Alternatively, Mockito can be used as follows:
@SpringBootTest
public class MyTest {
    @MockitoBean
    private ImageService imageService;
    
    @Test
    public void testSomething() {
        when(imageService.getImage(anyString()))
            .thenReturn(Mockito.mock(BufferedImage.class));
        // your test code
    }
}
```

## Service Locator Pattern
Another IoC style is the Service Locator pattern. It is **NOT** recommended as it is often considered an anti-pattern. That said, the above Configuration code does allow one to explicitly provide the dependencies in Test code.  

Here is a class that one would add to a Spring project to create a Service Locator:  
```java
/**
 * This is a Singleton Pattern. This is a Component that will get automatically
 * registered by the IoC SpringBoot framework. The ApplicationContext object
 * will be saved and made available via the static field. This will allow all
 * other objects, Component or not, to use IoC to fulfill dependencies. Example:
 * 
 *    imageService = ApplicationContextProvider
 *                      .getApplicationContext()
 *                      .getBean(ImageService.class);
 */
@Component
public class ApplicationContextProvider implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) {
        context = applicationContext;
     }

    public static ApplicationContext getApplicationContext() {
        return context;
    }
}
```


## What's so Important? ![Billy](../_static/whats_so_important.png)   
* Spring ...

## Footnotes
* *Def **idempotent***: An idempotent method is one that can be called multiple times with the same inputs and produces the same result, without causing *additional* side effects.  
* `Bean`: This is ...

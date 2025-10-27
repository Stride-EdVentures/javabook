# Parallel Streams

TODO: Add this to Practice_Streams
```java
    // let map be Map<String, Integer>.
    // Use streams to output the keys that have an even value, 
    // sort by the keys, case-insensitive.
    // output using `forEach` and a Method Reference to println.
    List<String> result = map.entrySet().stream()
        .filter(entry -> entry.getValue() % 2 == 0) // keep even values
        .sorted(Comparator.comparing(entry -> entry.getKey().toLowerCase())) // sort by key, case-insensitive
        .map(Map.Entry::getKey) // extract keys only
        .collect(Collectors.toList());

    result.forEach(System.out::println);

```

## What is a Stream?

A `Stream` is a sequence of elements processed in a *functional* style.

**Key Characteristics of Streams** 
1. **Not a Data Structure:** Unlike collections (e.g., List, Set), a Stream does not store elements. Instead, it provides a way to process elements from a source.  
2. **Lazy Evaluation:** Stream operations are performed lazily, meaning they are not executed until a terminal operation (like collect, forEach, or reduce) is invoked.   
3. **Functional Style:** Streams rely on functional-style operations, such as filter, map, and reduce, which can be chained together to form a pipeline of operations.  
4. **Parallel Processing:** Streams can be processed in parallel, making it easier to write parallel code and improve performance.  

```{admonition} References
:class: dropdown seealso
[1] [Java Streams Tutorial | 2020](https://www.youtube.com/watch?v=Q93JsQ8vcwY)
[2] [Java 8 Stream API Tutorial](https://www.youtube.com/watch?v=8yyHwQtnOj4)
[3] [Master Java Streams: Complete Guide from Basics to Advanced in One Video!](https://www.youtube.com/watch?v=E10Q6-nWO9g)
[4] [The Java Stream API Tutorial - Baeldung](https://www.baeldung.com/java-8-streams)
[5] [Java Stream API: Real-world Examples for Beginners - HowToDoInJava](https://howtodoinjava.com/java/stream/java-streams-by-examples/)
[6] [Java - Streams - Online Tutorials Library](https://www.tutorialspoint.com/java/java_streams.htm)
[7] [Streams in Java- Complete Tutorial with Examples](https://www.scaler.com/topics/java/streams-in-java/)
[8] https://topmate.io/engineeringdigest
[9] https://razorpay.me/@engineeringdigest
[10] https://www.youtube.com/@EngineeringDigest/join
[11] https://discord.oia.bio/engineeringdigest
[12] https://insta.oia.bio/engineering-digest
[13] https://x.openinapp.co/thevipulvats

```
# Tasks in Parallel

**Resources:**    
* [Tatiana Fesenko (O'Reilly): Video](https://learning.oreilly.com/course/java-concurrency-and/9781789806410/)  


## ForkJoin Framework
**Problem:** It is hard to execute tasks in parallel because we don’t know how many threads to create, and coordinating their communication is error prone.  
**Solution:** Using ForkJoin can simplify by managing a pool of threads and by synchronizing the results. A common pool allows the framework to optimize based on available resources.  
**How:** Create a collection of tasks (or Callables). Use a `ForkJoinPool` to optimally invoke the collection on separate threads and to join the results.  

### Callable
`Callable<V>`: A Generic Functional Interface. The method has no arguments and returns something of type V.  

```java
Callable<Integer> c1 = () -> { logger.info(10); return 10; };
```

The ForkJoin Framework can execute a list of `Callables` on separate threads and return a list of `Futures`.
```java 
List<Future<Integer>> futures = pool.invokeAll(myCallables);
```

### Future


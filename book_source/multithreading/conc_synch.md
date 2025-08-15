# Concurrency & Synchronization

Resources:  
* [Threads: Thread Lifecycle | Java Concurrency and Multithreading in Practice](https://learning.oreilly.com/videos/java-concurrency-and/9781789806410/9781789806410-video4_1/)

## Concurrency

### Concurrency vs Parallelism
TODO: Define

### Concurrency Issues
**Deadlock:** A situation where two or more threads are unable to proceed because each is waiting for the other to release a resource. Ex: Two threads each holding a lock the other needs, causing both to wait indefinitely. 

**Race Condition:** Occurs when multiple threads access shared resources simultaneously, leading to unpredictable outcomes. Ex: Two threads incrementing a shared counter without synchronization, resulting in incorrect values.  

**Starvation:** A situation where a thread is perpetually denied access to resources, preventing it from making progress. Ex: A low-priority thread never getting CPU time because high-priority threads are always running.  

**Fairness:** Ensuring that all threads get a fair chance to execute, preventing starvation. Ex: Using fair locks that ensure threads acquire locks in the order they requested them.

#### Deadlock

Deadlock occurs when two or more threads are unable to proceed because each is waiting for the other to release a resource.
```java
 public class DeadlockExample {
      private final Object lock1 = new Object();
      private final Object lock2 = new Object();

      public void method1() {
          synchronized (lock1) {
              System.out.println("Thread 1: Holding lock 1...");
              synchronized (lock2) {
                  System.out.println("Thread 1: Holding lock 2...");
              }
          }
      }

      public void method2() {
          synchronized (lock2) {
              System.out.println("Thread 2: Holding lock 2...");
              synchronized (lock1) {
                  System.out.println("Thread 2: Holding lock 1...");
              }
          }
      }
  }
```

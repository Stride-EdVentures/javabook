# Introduction to Threads
**First, an analogy.**  

Let's think of a program as simply a long list of instructions that you are following. There is only one set of instructions written down on paper, and you start at the top and may bounce around to different pages depending on the situation. You would be considered the the `main` **thread** executing the instructions of this program.  

Now let's have the program include the following instructions:  
> Get a friend to follow the instructions on page 4. You will continue to the next instruction below.  
In this new situation, the friend is reading the same set instructions but is on a different page. Furthermore, the friend will work at the same time as you. Your friend is a new **thread**.  When your friend is done with his portion of work, he can go home.  

Let's get a little more specific about the type of work being done. Let's say that you're building a house where the instructions you're reading address you as the general contractor responsible for hiring all the workers and coordinating the entire project. You'll have to assure that some tasks fully complete before another begins. For example, the foundation is complete before the walls go up, and all the external walls are standing before the roof is built. 

Each contractor will be reading their own version of instructions, but they are all found in your "program." The workers independently act as if they're the only ones reading the instructions.  

There will be times when the workers are working at the same time. In some situations, there can be many workers on the same task. For example, we can have many workers engaged with framing the walls of the house. You can even have two workers working on the very same wall at the same time. When the framers are done with their job, they go home, never to return. Different workers come to the job site to continue new work.  

These workers have materials that are shared. There is a palette of wood used for framing. There is a limited supply of drills, hammers and nails. The access to these resources need to be controlled so that two workers don't fight over the same hammer or nail. The construction project doesn't work well if two workers simultaneously grab the same piece of wood and attempt to drag it in opposite directions. Synchronization of the workers' access to resources is required.   

In an uncontrolled workspace, it is possible that one worker grabs all the nails and then seeks a hammer, but no hammers are available. Another worker has a hammer but refuses to give it up until his wall is done. But he can't finish his work because he has no nails. The worker with the nails refuses to give up his nails until he can finish his task, but he has no hammer to work with. The two workers come to a halt. This is called a `deadlock`.  

Each worker can be thought of as a `thread` running in a program. The issues they face are the exact kind of issues a multi-threaded program encounters. In this chapter, we will learn of ways to coordinate the worker threads: create new workers, control access to resources, notify workers of important information, and to avoid deadlocks. We will discuss ways to optimize this orchestration (e.g. reuse existing workers instead of taking the extra time to hire new ones).  

## What is a thread?
A thread is like a small, lightweight process that runs within a larger program. It is a worker focused on a single path of execution through your program. Multiple threads can run at the same time, allowing your program to perform multiple tasks simultaneously.  

A thread has its own "context". It has its own stack<a href="#footnotes"><sup>[1]</sup></a>. It started somewhere unique, has its own local variables, and will end in its own unique way.  

A thread shares the the same memory space with the rest of the process. Many threads can access shared resources simultaneously. This can cause contention and deadlocks. The best way to avoid problems is to avoid sharing by using local variables and having exclusive access to their own copies of resources where possible. This is called `mutual exclusion`.   

Multiple threads does NOT necessarily mean faster execution. It depends on the specific task, resource contention, and the count of CPU cores.  

A process will consist of one or more threads.  

```{admonition} Definition
:class: note
A *thread* is a sequence of instructions that can be executed independently within a program. Threads enable multitasking and parallelism, allowing programs to perform multiple operations simultaneously.
```

## Why Use Threads?
Threads are useful for:
* **Multitasking:** Running multiple tasks at the same time, like downloading a file while updating the user interface.  
* **Responsiveness:** Keeping your program responsive, especially in applications with user interfaces, by performing long-running tasks in the background.  

**Example**
Imagine you have a program that needs to do two things: download a file and update a progress bar. You can create two threads:   
1. Download Thread: Handles the file download.  
2. UI Thread: Updates the progress bar.  
This way, the progress bar can update in real-time while the file is being downloaded, making your program more efficient and user-friendly.  

**Simple Code Example**
Here's a basic example of creating and starting a thread in Java:
```java
class MyTask extends Thread {
    public void run() {
        System.out.println("Thread is running...");
    }
}

public class ThreadExample {
    public static void main(String[] args) {
        MyTask task = new MyTask();
        task.start(); // Start the thread
    }
}
```

## Coding with John
Watch the following video. As you watch, takes notes on the following:  

* How do we create a Thread?  (in 4+ different ways)  
* What is the difference between creating and starting a thread?  
* Which of the Thread API are (a)synchronous?  
* How do we wait for a thread to complete?  
* How are interfaces used?  

<iframe width="560" height="315" src="https://www.youtube.com/embed/r_MbozD32eo?si=5hTdi9iOCo59CI28" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
</iframe>

```{admonition} Video Q & A
:class: dropdown
**Q: How do we create a Thread?**  
**A:** There is a Thread object, which is different from a "thread of execution." 
The easiest way to create a thread is to:  

    Thread t = new Thread() {
        @Override
        public void run() { }
    };
    t.start();

Other ways to create threads are:  
* Create a thread by creating a `Timer()`.  
* Call `SwingUtilities.invokeLater()`.  
* Use other libraries or Frameworks like the `ForkJoin Framework`.  

**Q: What is the difference between creating and starting a thread?**  
**A:** A Thread object can be created, but that doesn’t actually create a “thread of execution”.
The “thread of execution” is created when we call `t1.start();`

Once a thread is created, it can also be suspended. (see below **TODO**)
A suspended thread can be restarted. 


**Q: Which API are (a)synchronous?**  
**A:**  
Synchronous:  

    Thread t1 = New Thread();  
    t1.run();  
    t1.join();  

Asynchronous:  

    t1.start();

**Q: How to wait for a thread to complete?**  
A: We simply need to call `t1.join();`  

**Q: How are interfaces used?**  
**A:** The Thread constructor takes a `Runnable` interface.
```


## What's so important? ![Billy](../_static/whats_so_important.png)
* TODO: ...

## Footnotes
[1] Stack: **The stack** is a region of memory used primarily to manage **function (method) calls** and local execution state. It follows a *last‑in, first‑out (LIFO)* discipline: when a method is called, a stack frame is pushed onto the stack containing that method’s parameters, local variables, and return address; when the method returns, its frame is popped off.  

The stack is utilized automatically by the runtime during program execution, especially for **control flow and scoping**. It enables fast allocation and cleanup of short‑lived data, enforces method call order, and supports features such as recursion and exception handling.  

Each thread has its own stack. In Java (and most modern runtimes), every thread is allocated a **private call stack** that stores that thread's method calls, local variables, and intermediate execution state. Because stacks are not shared, threads do not see or interfere with each other's local variables, which is a key reason local variables are inherently thread‑safe. When a thread terminates, its stack is discarded.  

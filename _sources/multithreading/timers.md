# Timers and Threads

So far, we have talked about threads as independent workers that can execute instructions at the same time. A thread can run in a tight loop, pause, wake up, and continue working, all without stopping the rest of the program. Timers build directly on this idea. They exist to help us run code **later** or **repeatedly**, without blocking the main flow of execution. 

Timers do **not** remove the need for threads, nor do they actively manage a thread’s execution. Instead, they provide a mechanism for scheduling **when** code should run, typically by arranging for that code to be executed at fixed times (aka intervals). Depending on the type of timer, the scheduled code may run on a newly created background thread or be dispatched onto an existing thread, such as Swing’s Event Dispatch Thread. Understanding this distinction is especially important when working with animation and user interfaces.

## Animation
Before we begin, it is important to know that Swing has a **dedicated thread** called the *Event Dispatch Thread (EDT)* that is responsible for:
*   Handling user input  
*   Updating UI components  
*   Repainting the screen  

Animated programs need to coordinate with the EDT. The repainting part is especially tricky.     

Now let's look at two very simple ways to do Animation.  
1) The first uses a dedicated thread.  
2) The second uses a Timer.  

### Dedicated Thread
Let's start with a very direct approach. The following code will create a dedicated worker thread that controls its timing using `Thread.sleep`.

```java
public void start() {
    done = false;

    // create a thread that sleeps between calling update/paint.
    this.sleepThread = new Thread(() -> {
        while (!done) {
            update();       // synchronous: update objects
            repaint();      // asynchronous: request a repaint
            Thread.sleep(AnimationPanel.PHYSICS_DELAY);
        }
        // when done is false, we exit our thread
    });

    this.sleepThread.start();
}
```
Think of this thread as a dedicated animation worker. It is a **drummer** that sets the tempo for how fast animation is to update. Its entire job is to repeatedly:  

1.  Synchronously update the objects within the game    
2.  Asynchronously trigger or *request* a `repaint`   
3.  Pause for a short, fixed amount of time  

The call to `Thread.sleep(...)` controls how fast the animation *should* run. Without it, this thread would run as fast as the CPU allows, consuming resources and producing unpredictable results.  

Several important thread concepts appear here:
*   The update of the objects runs *synchronously* on *this* thread. It won't request a repaint until all objects have been updated.   
*   The *request* to repaint is **asynchronous**. This means that the current thread does not do any painting. Instead it makes a cross-thread communication to the Event Dispatch Thread. It says, "*Hey, EDT, when you get time, would you mind repainting everything, please.*"  
*   Regardless of how long it takes to complete the update, the thread will still sleep by the same amount.  
*   Sleeping pauses *this thread only*. Other threads continue running.
*   A shared variable `done` is used to tell the thread when to stop. Other threads would set this value to `false` to stop the animation. This can be dangerous due to the `visibility` property of concurrency. This is discussed in a different lesson on concurrency.   

This approach is simple and generally good enough. Here are some problems:  
*   There is no guarantee that repainting will happen regularly. The *request* may go unanswered for *quite some time*.  
*   The `sleep` is not guaranteed to pause for the exact duration requested. The actual time spent sleeping could be longer.  
*   It does not consider how long it took to `udpate`. Let's say that we want to repaint about every 16 ms, and we set the sleep duration to 15 ms because we assume the update will take about 1 ms. It is entirely possible that during one *drum beat* the update took 14 ms. The sleep time will be unchanged at 15 ms.  

All of the above problems can result in janky animation.  

***

### Using a Timer
Let's use a Timer instead of a `sleep` in hopes of improving the animation. This will **not** solve all our threading problems.

```java
    public void start() {
        // ScheduleAtFixedRate will invoke run() at a regular interval regardless of how
        // long the previous call to update() took.       
        paintTimer = new java.util.Timer();
        // This is an Asynchronous call. Timer is started.
        paintTimer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() { 
                    update();       // synchronous
                    repaint();      // asynchronous
                    // no sleeping. run() is called on a fixed interval.
                } 
            }, 0, PHYSICS_DELAY);
    }
```
To stop the animation, another thread would have to call `paintTimer.cancel()`.  
The `repaint` call behaves the same as when using a dedicated thread. The timer thread will communicate with the EDT and kindly ask it to repaint when it has time. The EDT is a completely separate thread and the repainting can happen at any time.  

In both approaches (Dedicated Thread, Timer) the program needs to be aware that repainting can happen at the same time as the update. This can introduce contention for resources. To assure that update and painting happen at different times, we can put the timer on the Event Dispatch Thread by using the Swing Timer.  

### Using a Swing Timer
A `javax.swing.Timer` does not create a free‑running worker thread like the `java.util.Timer` examples above. Instead, it schedules **small pieces of work** to run *on the EDT* at regular intervals.  

This next example code uses a Swing Timer to do Animation.  
```java
public void start() {
    // A Swing Timer fires ActionEvents at a fixed interval.
    // The actionPerformed() method is invoked on the
    // Event Dispatch Thread (EDT).
    paintTimer = new javax.swing.Timer(PHYSICS_DELAY, e -> {
        update();   // runs on the EDT
        repaint();  // requests a repaint on the EDT (this very same thread)
        // no sleeping; the timer controls when this code runs
    });

    // Start the timer now
    paintTimer.start();
}
```
It would seem that the above Swing Timer code solves some issues. **But issues still remain.**  
1. The request to repaint can still be ignored so that two updates can happen before the painting. To assure that a paint happens for every update, we would need to make the painting be *synchronous* as professional games do. Doing synchronous painting can introduce other problems and complexity which is outside the scope of these lessons.<a href="#footnotes"><sup>[1]</sup></a>   
2. If there is too much work done on the EDT, repainting can be sluggish and unresponsive.  

For now, we will live with imperfect animation.  

### Comparing the Two Approaches

| Manual Thread + Sleep              | Swing Timer               |
| ---------------------------------- | ------------------------- |
| You manage the thread              | Swing manages timing      |
| Runs on background thread          | Runs on EDT               |
| Okay for animation and simulations | Good for updating UI Components       |
| Risky for Swing components         | Safe for Swing Components |
| Good if tasks take a long time     | Bad if tasks take a long time because it could interfere with UI responsiveness.|

Both approaches are valid, but for **different jobs**.  

## Progress Bar 
There are situations in a program when a large task need to be executed while the user waits. While the task is executing, we still want the UI to be receptive to user actions (e.g. clicking cancel). Furthermore, it is a much better user experience if the user can be informed of the progress and when the task is expected to end. This section will demonstrate how a Swing Timer can be used to update a Progress Bar. We will not demonstrate how to cancel the background task.  

```java
public void triggerWork() {
    // create a thread to do a lot of work.
    HugeTask task = new HugeTask();
    Thread t = new Thread(task);
    t.start();

    // create a progress bar that updates
    showProgress(task);
}

public void showProgress(HugeTask task) {
    JProgressBar progressBar = createProgressBar();     // code not shown
    JDialog dialog = createProgressDialog(progressBar); // code not shown

    // IMPORTANT:
    // Because the JDialog a modal dialog, setVisible(true) is a synchronous call.
    // It will initiate a call to pump/dispatch messages synchronously and it
    // will not return until the dialog is dismissed. The dialog won't get dismissed 
    // until the huge task completes and the timer ends. To avoid this chicken-and-the-egg
    // problem, we asynchronously request that the EDT invoke `setVisible` when
    // the thread has "an opportunity."
    SwingUtilities.invokeLater(() -> dialog.setVisible(true));

    // This timer polls the HugeTask to see how much of the work is done.
    // When the work is done, getProgress will return 10.
    Timer timer = new Timer(500, e -> {
        int value = task.getProgress(); // value 1-10
        if (value < 10) {
            progressBar.setValue(value);
        } else {
            ((Timer) e.getSource()).stop();
            dialog.dispose();
        }
    });

    timer.start();
}
```

This timer fires every 500 milliseconds. Each time it fires, Swing places a task onto the EDT's event queue. When the EDT is ready, it executes that task.

Key observations:
*   No explicit threads are created when creating the Timer 
*   No sleeping is required   
*   UI updates happen on the EDT--the *correct* thread  
*   Updates happen when the EDT has an opportunity  

In other words, the timer acts like a scheduler telling the EDT:

> "As close as you can to this time interval, run this code for me."

## What's so important? ![Billy](../_static/whats_so_important.png)  
Timers are fundamentally about **controlling execution across threads**, not just about "waiting" or "delaying" code.

*   Timers are a way to **schedule work without blocking execution**, allowing programs to update, animate, or respond periodically while other code continues to run.

*   Timers **do not replace threads**. Timers are enabled by and execute on different threads. 

*   **Swing Timers** run on the Event Dispatch Thread which makes it easy to update the GUI directly. There is no need to call `SwingUtilties.invokeLater` to assure that components update safely.  

*   **Understanding timers requires understanding threads first**, including execution flow, shared state, and coordination between independently running pieces of code.  


## Footnotes
[1] **Synchronous Painting**

> Synchronous painting introduces complexity because GUI frameworks manage component hierarchies, buffering, and repaint scheduling automatically. Forcing immediate painting can interfere with child components, require manual **double buffering** to avoid **flicker** and **tearing**, and demand careful coordination of rendering and state updates, which is why professional systems use specialized rendering loops instead.   
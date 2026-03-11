# Log4j

Many real-world applications are difficult to debug because their failures emerge only under specific timing conditions such as unpredictable thread scheduling, variations in the environment, or user interactions that you can't reliably reproduce. When stepping through code isn't an option, detailed **logs become the only way to understand** what the system was doing at the moment things went wrong. Capturing state (threads, inputs, timing, and decisions) often provides the key insight needed to uncover the underlying issue.  

Logging also serves important **business and operational needs**. Websites may track which assets are used so they can correctly attribute costs or pay royalties (for example, when licensed images are displayed). Companies also analyze logs to understand usage patterns, measure performance, and compute Key Performance Indicators ([KPI](https://www.forbes.com/advisor/business/what-is-a-kpi-definition-examples/)) that reveal whether the business is healthy.  

```{admonition} Why Logging Matters
:class: dropdown 
Logging is vital because many real-world bugs don't surface under a debugger—they happen under production timing, user behavior, or multi‑threaded interactions you can't easily reproduce. Good logs provide a factual timeline of what the system was doing, letting developers diagnose issues long after they occurred.

Logging also cleanly separates **what the code reports** from **how it's captured**, allowing teams to change destinations, verbosity, or formats without touching business logic. This decoupling keeps systems maintainable and makes it easy to switch between quiet production logs and detailed debugging output simply by editing configuration.

Beyond debugging, logs support observability and business needs: tracking performance, identifying usage patterns, detecting anomalies, and generating metrics or KPIs.
```

**Log4j** is a popular Java logging framework. A developer writes to a log using a **Logger**, and the message can be directed to a myriad of destinations (files, console, or something custom<a href="#footnotes"><sup>[1]</sup></a>) via **Appenders**, and formatted with desired information. [Configuration](https://logging.apache.org/log4j/2.12.x/manual/configuration.html) is typically done with an XML file.  

A **configuration file** declares **what** can be logged (<a href="#logging-levels">Logging Levels</a>), **where** it is logged (`Appenders`), and **how** it is formatted.  

The code can create a `Logger` and then attempt to log a message at a specific level as follows:  
```java
// The name of the logger determines which Logger is created.
// Each specific logger will target specific locations to send its messages.
// Note that the XML file has <Logger name="swing">.
Logger swingLogger = LogManager.getLogger("swing");

// Construct our message using a `formatted print`. Log4j offers a variable argument, 
// formatted print to more easily construct messages.  `{}` are placeholders for the
// arguments that follow.
swingLogger.info("My number = {} which is {}!", 42, "dope");
```

**What**:  
In the code above, we determine *what* gets logged by setting the *Logging Level*. The XML file can set what level messages are filtered out and which make it to their destination. This allows the code to express the level of the message and the XML decides whether it worth logging or not, depending on the current configuration. The code above attempts to log a message at the `info` level by calling `swingLogger.info`.  

The `XML` file sets what gets filtered. For example, `<Logger level="info">` would allow only message that are as important, or *more* important, than "info" to get logged. It filters out `debug` and `trace` messages.  

**Where**:  
Each Logger has one or more specific targets such as the console, a file, or some custom target. The specific logger that is created is determined by the `XML` file. In the example XML below, the Logger with the name "swing" is created with the code `LogManager.getLogger("swing")`. We can see that the "swing" Logger has two `<AppenderRef>` tags meaning that there are **two** destinations for its messages. The Appenders with names are configured in the `<Appenders>` section of the XML.  

**How**:  
Each Appender has a `PatternLayout` that specifies a *template* for the message being logged. This is normally configured to provide a timestamp. It can also be configured to show the name or ID of the thread, the current Level, and/or the name of the logger. For details on the *template*, visit [Apache's Documentation](https://logging.apache.org/log4j/2.x/manual/pattern-layout.html).  
 

## `log4j2-spring.xml` Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
  <Appenders>
    <!-- Custom GUI appender -->
    <SwingAppender name="SwingAppender">
        <PatternLayout pattern="%d{mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </SwingAppender>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
    </Console>
    <File name="ThreadFile" fileName="logs/threading.log">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t]:  %msg%n"></PatternLayout>
    </File>
  </Appenders>
  <Loggers>
    <Logger name="swing" level="all" additivity="false">
      <AppenderRef ref="SwingAppender"/>
      <AppenderRef ref="ThreadFile" />
    </Logger>
    <Logger name="console" level="all" additivity="false">
      <AppenderRef ref="Console" />
    </Logger>
    <Root level="info">
      <AppenderRef ref="Console" />
    </Root>
  </Loggers>
</Configuration>
```

The XML above defines two different `Logger`s (*console* and *swing*), and three different `Appenders` (*SwingAppender*, *Console*, and a *File* with the name "threading.log").  

**Logger:**  
* Can have multiple Appenders  
* There is a default `Root` logger  
* Set the level that they filter messages  
* Can *bubble* up events to its parent loggers. Parents are set with dot-separated hierarchies in their names.  

**Appenders:**  
* The Appenders effectively say where the message go; they establish the targets for the messages.   
* They can have a lot of *policies* set on them to establish whether a new file gets created at each run, the maximum size of a file, and more.  

There is a lot that can be configured on an Appender. [Click here](https://howtodoinjava.com/log4j2/log4j2-xml-configuration-example/) for a configuration example with more details.  

In the above configuration, you'll see that the `Logger` with the name `swing` is configured with **TWO** `<AppenderRef>` tags. This means that when the code uses the swing logger the message will be directed to both places: a file named `threading.log` and to the custom `SwingAppender`<a href="#footnotes"><sup>[1]</sup></a> object.  

## Logging Levels

Log4j defines levels that control verbosity and severity by filtering out messages at various levels.  

Here are the Levels (from least *severe* to most *severe*):  

*   **TRACE** – very fine‑grained diagnostics (lowest, most verbose, often filtered out)  
*   **DEBUG** – internal state/change tracking for debugging  
*   **INFO** – normal application milestones/health  
*   **WARN** – something looks off; attention may be needed (**not** filtered when `logger.info` is called.)
*   **ERROR** – an operation failed; functionality impacted  
*   **FATAL** – unrecoverable; app may abort (never filtered)  

> Effective level filtering means *"log this level **and more severe**."*   

**For example:**
* logger.warn("gets logged when XML set at warn, info, debug, or trace.")  
* logger.fatal("always gets logged.")  
* logger.trace("gets logged ONLY when XML set at trace")  

**When XML is set to:**  
* level="trace" : All messages are logged.  
* level="info" : Messages called with logger.info, logger.warn, logger.error, or logger.fatal **will** get logged.  


## Output Format with **PatternLayout**

**`PatternLayout`** uses conversion specifiers to format each log line. Common ones:

*   `%d{...}` → date/time with custom pattern (e.g., `yyyy-MM-dd HH:mm:ss.SSS`)
*   `%t` / `%tn` / `%tid` → thread name; thread name and thread id (depending on pattern support)
*   `%-5level` → padded level
*   `%logger{36}` / `%c{1}` → logger name (optionally abbreviate)
*   `%m` → message; `%n` → newline   

**Thread context:** You can include **thread name** and supported **thread identifiers** in the pattern to disentangle concurrent logs, for example:  
```
%d{HH:mm:ss.SSS} [thread_id="%tid" thread_name="%tn"] %-5level %logger{36} - %msg%n
```

[More PatternLayout info.](https://logging.apache.org/log4j/2.x/manual/pattern-layout.html)  

## Code Example
This code will be specific to the example XML shown above. It will create a logger and write at different levels:  

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class MyClass {
  private Logger consoleLogger;
  private Logger swingLogger;

  public MyClass {
    consoleLogger = LogManager.getLogger("console");
    swingLogger = LogManager.getLogger("UserActionFile");
  }

  public void doWork(String orderId) {
    consoleLogger.trace("Entering placeOrder id={}", orderId);
    swingLogger.debug("Validating {}", orderId);
    swingLogger.info("Order {} placed successfully", orderId);
    swingLogger.warn("Slow response from payment provider for {}", orderId);
    swingLogger.error("Failed to persist order {}", orderId);
    swingLogger.fatal("System is shutting down due to unrecoverable error");
  }
}
```

## What's so Important? ![Billy](../_static/whats_so_important.png)   
*   Logging makes *impossible-to-reproduce* bugs solvable by capturing timing, state, and thread context that you can’t get from a debugger.
*   It decouples **what your code logs** from **where the logs go**, so you can change outputs (console, files, GUI components) *without touching the Java code*.
*   Logging levels let you switch between *quiet* production logs and *chatty* debugging logs instantly by editing the XML—no recompilation needed.
*   In multi-threaded or asynchronous systems, logs provide the *only* reliable timeline of what happened and in what order.
*   Centralized, well-structured logs become useful for analytics, KPIs, performance trends, audit trails, and detecting unusual behavior.



## Footnotes
[1] In the CSS 490 course, the *Console* project makes use of a *custom* logger named `SwingAppender`. This class pipes the message to the logging pane (the `JTextPane` that is visible front and center). This allows the user of the application to see the logs.   
Here are some references:  
*   **Log4j 2 Configuration (official manual)** – file formats, discovery order, examples: [Apache Log4j 2 Configuration](https://logging.apache.org/log4j/2.12.x/manual/configuration.html)
*   **PatternLayout (official manual)** – specifiers for timestamps, threads, levels, logger names, etc.: [Pattern Layout](https://logging.apache.org/log4j/2.x/manual/pattern-layout.html)
*   **API usage (official manual)** – `LogManager`, `Logger`, level methods: [Log4j API](https://logging.apache.org/log4j/2.x/manual/api.html)
*   **Spring Boot + Log4j 2** – how Boot picks up your config and naming guidance: [Spring Boot Logging](https://docs.spring.io/spring-boot/reference/features/logging.html), [Boot + Log4j2 example](https://howtodoinjava.com/spring-boot/spring-boot-log4j2-config/)




 
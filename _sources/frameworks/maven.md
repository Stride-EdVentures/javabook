# Maven

**Maven** is a **build automation tool** for Java projects. It handles the tedious parts of building software so developers don't have to.  Specifically, Maven manages three things that would otherwise be painful:

* **Dependencies** — Your project needs external libraries (e.g., a library for reading JSON, or connecting to a database). Instead of hunting down `.jar` files and manually adding them to your project, you tell Maven what you need. It downloads the correct versions automatically from the internet and makes them available to your code.

* **Build lifecycle** — Maven knows the standard steps to go from source code to a finished, runnable program: compile the code, run the tests, package everything into a `.jar` file. You run one command and Maven executes all of those steps in the right order.

* **Consistency** — Every developer on the team builds the project the exact same way, on any machine. "It works on my computer" becomes much less of a problem.

Maven is configured through a single file at the root of the project called `pom.xml` (Project Object Model). This file describes the project's name, version, dependencies, and how it should be built. When a new developer joins a project, they clone the repo and Maven takes care of the rest.

```{admonition} The big idea
:class: note
Maven answers the question: *"How do we turn source code into working software, reliably, every time?"*
```

You can think of Maven like a recipe card for your project. The `pom.xml` is the recipe; it lists the ingredients (dependencies) and the steps (build lifecycle). Maven is the chef that follows it.

**Pros:** 
* Dependency Management  
* Industry Standard  
* Well Designed Structure  

**Cons:**  
* Ramp-up  
* Structure can be overkill  
* Opaque mechanisms  
    * If the build breaks, fixing it is tough!   

## POM.xml
The `pom.xml` (Project Object Model) file is the core of a Maven project. It contains information about the project and configuration details used by Maven to build the project. Here's a basic example of a pom.xml file and an explanation of its components:

POM == Project Object Model

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.googlecode.json-simple</groupId>
            <artifactId>json-simple</artifactId>
            <version>1.1.1</version>
        </dependency>
    </dependencies>
</project>
```

```{admonition} XML Details
:class: dropdown
**Details:**  

**&lt;project&gt;:**  
    The root element of the pom.xml file. It defines the XML namespace and schema location.  
**&lt;modelVersion&gt;:**  
    Specifies the version of the POM model. For most projects, this will be 4.0.0.  
**&lt;groupId&gt;:**  
    A unique identifier for your project group. It usually follows the reverse domain name convention (e.g., com.example).  
**&lt;artifactId&gt;:**  
    The name of your project. This is the name of the JAR file that will be generated (e.g., my-app).  
**&lt;version&gt;:**  
    The version of your project. This helps in managing different versions of the same project (e.g., 1.0.0).  
**&lt;dependencies&gt;:**  
    A section where you define the dependencies your project needs. Each dependency is specified within a &lt;dependency&gt; element.  
**&lt;dependency&gt;:**  
    Defines a single dependency. In this example, we have a dependency on JUnit, a popular testing framework.  
**&lt;groupId&gt;:**  
    The group ID of the dependency (e.g., junit).  
**&lt;artifactId&gt;:**  
    The artifact ID of the dependency (e.g., junit).  
**&lt;version&gt;:**  
    The version of the dependency (e.g., 4.13.2).  
**&lt;scope&gt;:**  
    The scope of the dependency. In this case, test means the dependency is only used for testing.  
```

## Project File Structure
Maven follows a mandatory and specific directory structure to maintain consistency and convention across projects. Here's an overview of the Maven project structure :

```
my-app
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── App.java
│   │   ├── resources
│   │   │   └── application.properties
│   ├── test
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── AppTest.java
│   │   ├── resources
│   │   │   └── test-config.properties
│
├── pom.xml
```

Here is an explanation of the above directory structure:    
**src/main/java:**  
  This directory contains your main application source code. The package structure should follow the standard Java package naming conventions (e.g., com.example).  
**src/main/resources:**  
  This directory is for non-Java resources required by your application, such as configuration files, property files, XML files, etc. These resources are included in the classpath when the project is built.
**src/test/java:**  
  This directory contains your test source code. It follows the same package structure as your main source code. Test classes are typically named with a Test suffix (e.g., AppTest.java).  
**src/test/resources:**  
  This directory is for resources needed by your tests, such as test configuration files, mock data, etc. These resources are also included in the classpath during the test phase.  
**pom.xml:**  
  The Project Object Model file that contains information about the project and configuration details used by Maven to build the project. It includes dependencies, plugins, build configurations, and more.


In the `CSS 490: Multithreading in GUI Application` class, we have the following directory structure.

```
├───.mvn
│   └───wrapper
├───.vscode
├───lib
├───logs
├───src
│   ├───main
│   │   ├───java
│   │   │   └───com
│   │   │       └───mrstride
|   |   |           ├───entity
│   │   │           ├───gui
│   │   │           └───services
│   │   └───resources
│   │       ├───images
│   │       ├───levels
│   │       └───playbacks
│   └───test
│       └───java
│           └───com
│               └───mrstride
|                   ├───entity
│                   ├───gui
│                   └───services
└───target

```

## What's so important? ![Billy](../_static/whats_so_important.png)  
* **Maven automates the entire build process**, handling compilation, testing, packaging, and dependency management so we don't waste time manually managing jar files or build steps.  
* **The pom.xml is the single source of truth** for a project's configuration, letting any developer clone the repo and build instantly with consistent results.  
* **Dependency management becomes effortless.** Maven automatically downloads and version‑controls libraries so projects stay organized and up‑to‑date.  
* **Standard directory structure means fewer surprises** and makes it easier to navigate, share, and understand Java projects across courses and teams.  

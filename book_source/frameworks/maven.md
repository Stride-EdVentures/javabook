# Maven

## What is Maven?

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
```
<project>:
  The root element of the pom.xml file. It defines the XML namespace and schema location.
<modelVersion>:
  Specifies the version of the POM model. For most projects, this will be 4.0.0.
<groupId>:
  A unique identifier for your project group. It usually follows the reverse domain name convention (e.g., com.example).
<artifactId>:
  The name of your project. This is the name of the JAR file that will be generated (e.g., my-app).
<version>:
  The version of your project. This helps in managing different versions of the same project (e.g., 1.0.0).
<dependencies>:
  A section where you define the dependencies your project needs. Each dependency is specified within a <dependency> element.
<dependency>:
  Defines a single dependency. In this example, we have a dependency on JUnit, a popular testing framework.
<groupId>: The group ID of the dependency (e.g., junit).
<artifactId>: The artifact ID of the dependency (e.g., junit).
<version>: The version of the dependency (e.g., 4.13.2).
<scope>: The scope of the dependency. In this case, test means the dependency is only used for testing.
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
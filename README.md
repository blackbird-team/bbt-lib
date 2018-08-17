# Black Bird Team - Library

Set of modules for Backend development.

__TypeScript friendly__ - library contains a declaration file ```index.d.ts```

# Abstract

This library consists of classes and language constructs, often used by our team when developing projects. above all these are basic methods, for example, interaction with the file system, sending http requests, connecting to the database, logging, and so on. This library was designed to reduce the count of simple but useful, third-party libraries in the list of production dependencies, as well as to reduce copy pasting commonly used designs.

# Introduction

Most of the functions and methods of the classes represented in the library are asynchronous and return the ```Promise``` object. So they can be used in the design of the Promise chain:

```javascript
someone()
  .then(result => {
    // Handle with result
  })
  .catch(err => {
    // Something went wrong
  });
```

or ```async/await```:

```javascript
// Some async scope
  try {
    const result = await someone();
  } catch(err) {
    // Something went wrong
  }

```

In general, this applies to everything that is in the library. In the case of rare exceptions, a warning will be indicated in the description for that component uselines.



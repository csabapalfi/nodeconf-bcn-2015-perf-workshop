# Challenge - calc-server

**calc-server** implements an [RPN calculator](https://en.wikipedia.org/wiki/Reverse_Polish_notation) service over WebSockets. See [client.js](client.js) for a usage example.

## The problem

Memory usage seems to steadily increase over the lifetime of the process. Your task is to confirm the presence of a memory leak, identify the type of object that's leaking, and fix the problem.

Your tasks are:
 1. Confirm and find the memory leak without looking at the code
 2. Fix the leak

Suggested steps:

1. Generate some load on the server with Minigun and observe changes in memory usage. A sample Minigun test script is provided in [test.json](test.json). Feel
free to tweak it (e.g. extend the scenario with more operations).
  - `minigun run test.json`
2. Confirm that memory usage is growing under load, and that memory is not reclaimed by the GC.
  - Use `top` to monitor memory usage
    - `top -pid $(pgrep -lfa node | grep server.js | awk '{print $1}')`
  - Ensure that memory is not being reclaimed by forcing a collection
    - Run node with `--expose-gc` and `--trace-gc`
    - Add a `SIGUSR2` handler that will run `gc()`
    - Then force a collection with:

      `pgrep -laf node | grep server | awk '{ print $1}' | xargs kill -USR2`
3. Use `heapdump` to analyse memory growth.
  - Restart the process and take a snapshot
  - Run a load-test, take another snapshot
  - Load the snapshots into Chrome Dev Tools and compare them
4. Fix the problem. :wrench::smiley_cat:

## notes about memory

### goals

* avoid frequent gc increasing latency
* avoid memory leaks

### real memory vs virtual memory
* allocated RSS vs available VSZ for your process
* not always precise - especially accross OSes

### gc spaces
* new space (1-8MB), old space (and large object space, code space)
* most objects die young
* allocating in new is fast

### gc process
* stop the world
* new space filled up -> scavenges
* objects surviving couple scavenges promoted to old
* after a few promotions: mark-sweep and mark-compact

> GC processes of course change from node version to node version

### leak signs
* growing mem usage
* process killed by Linux OOM killer

## heapdumps

* heapdump (npm: heapdump), dumps on USR2 signal
* requires enough memory (2x heaps)
* blocks your app
* node version vs chrome devtools version
* can use it in prod, no overhead

## chrome devtools

* heap snapshots - load
* by constructors
* distance - from root
* count - all object on heap
* shallow size: directly by the object itself
* retained size: by holding references to other objects, and thus preventing them from being automatically disposed by a garbage collector
* compare mode: shows size delta
* retainer tree - even shows variable name

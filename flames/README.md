# Challenge — flames

In this challenge you'll find program that simulates CPU usage in different
operations. The simulation is paremeterized with the amount of spin time
they will waste.

## Generating flamegraphs

You need to be using Linux, either on your laptop, a virtual machine or a VPS.

Make sure perf is installed.

Run your node program with:
`node --perf_basic_prof myprogram.js`

Run perf to trace the node process for 10 seconds:
`sudo perf record -q -F 999 -p $(pgrep node) -g -- sleep 10`

Make sure the generated map file is owned by the same user that runs perf:
`sudo chown root /tmp/perf-*.map`

Output the recorded activity into a file:
`sudo perf script > /tmp/script`

Use stackvis to generate a flame-graph from the perf script.
`stackvis perf < /tmp/script > /tmp/flamegraph.html`

Open flamegraph.html in your browser.

## Interpreting flamegraphs

A flamegraph shows collapsed stack traces collected from the target program.

The horizontal axis has no meaning.

Every ocurrence of a function in a stack trace is represented by a rectangle.
If the stacktrace up to that function is the same as in another collected
stacktrace then they are collapsed and the rectangle becomes wider.

This means that the wider the rectange, the more frequent was the function
seen in the underlying stacktrace.

## Experiment

Try changing the parameters passed to `spin(milliseconds)`, re-generate a
flamegraph and compare with the previous one.


## Solution

It's not really a challenge so no solution.

## How to use

1. define latency and throughput (rps) goals - based external reqs or initial benchmarks
2. run load test and monitor resources (memory, cpu, event loop lag)
3. CPU 100% or too high? - generate flamegraphs to see where CPU time is spent
    * run your app with --perf_basic_prof (only on linux)
    * then run `perf record` to sample stack traces
    * .map file will contain memory address to JS function mapping
    * then collapse matching stack frames and generete flamegraph

> see fg.sh

## gotchas/tips
* inlined function won't show up (can confirm inlining by passing --trace-inlining flag)
* sometime system calls are logged as node:unknown, (e.g libdate development headers are not installed
* wider rectangle longer time potential issues
* not just how wide but difference between stack frames on top of each other - (and summing that across all call paths)
* huge graph might crash browser:
    * can reduce size by grepping intermediary file
    * some clever flamegraph tooling by brendan gregg
* flamechart vs flamegraph: chart maps stack to execution time, can be collapsed into a flamegraph
* lots of high stack might still have the gaps that can added up to get insights

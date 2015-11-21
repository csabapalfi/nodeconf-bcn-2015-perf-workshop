# Welcome

This repository contains a colletion of challenges as part of the node performance
workshop.

You can find a handy cheat-sheet below.

# CHEATSHEET

### Monitor Memory usage

`$ ps -o pid,pmem,vsz,rss,comm -p <PID>`

Alternatives: `top`, `htop`, `free`, `vmstat`


Self monitoring:

```javascript
$ node
> process.memoryUsage()
{ rss: 13037568,
  heapTotal: 6147328,
    heapUsed: 2790824 }
```

### Motitor CPU usage

`$ ps -o pid,pcpu,cpu,comm -p <PID>`

Alternatives: `top`, `htop`

### Show CPU utilization over a 5 second period

`$ ps -o pid,pcpu,cpu,comm -p <PID>`

### Show open TCP ports

`lsof -nP -iTCP -sTCP:LISTEN`

or

`netstat -lntp`

### Show open file descriptors

Every file, port, unix pipe, or any kind of stream (unix stream) is represented by a file descriptor.

`lsof -nP -p <PID>`

### Monitor network bandwith

`iftop`, `iptraf`, or `nethogs`

### Monitor GC activity

`node --trace_gc <program>`

### Monitor event loop lag

https://www.npmjs.com/package/toobusy-js

### Write a heapdump every time RSS increases by 10 MB

```javascript
var heapdump = require('heapdump');
var oneMb = Math.pow(2, 20);
var threshold = 10 * oneMb;
var last = get();
setInterval(check, 1000);
function get() { return process.memoryUsage().rss; }
function check() {
  var now = get();
  if (now - last < threshold)
    return;

  heapdump.writeSnapshot();
  console.log('Memory increase from %d MB to %d MB. Wrote dump',
              Math.floor(last / oneMb),
              Math.floor(now / oneMb));
  last = now;
}
```

### Generate flamegraphs

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

###

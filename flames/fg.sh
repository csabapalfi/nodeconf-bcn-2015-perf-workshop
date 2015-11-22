#!/bin/bash

set -e

#node="/home/vagrant/nodes/iojs-v1.6.2-linux-x64/bin/iojs"
node="/home/vagrant/nodes/node-v0.12.1-linux-x64/bin/node"
node_flags='--perf_basic_prof'
script='/home/vagrant/porf/single.js'
script_log=/dev/null
# load_generator="node test.js"
# load_generator_log=/dev/null
seconds=5

perf_script=/tmp/perf-script
out=/tmp/fg.html

echo Using "$($node -v)"

$node $node_flags $script > $script_log &
script_pid=$!

sleep 1

# $load_generator > $load_generator_log &
# load_generator_pid=$!

sudo perf record -q -F 999 -p $script_pid -g -- sleep $seconds > /dev/null

# kill -HUP $load_generator_pid > /dev/null
# wait $load_generator_pid 2>/dev/null || true

kill -HUP $script_pid > /dev/null
wait $script_pid 2>/dev/null || true

sudo chown root /tmp/perf-$script_pid.map
sudo perf script > $perf_script
stackvis perf < $perf_script > $out

echo Done. Produced $out

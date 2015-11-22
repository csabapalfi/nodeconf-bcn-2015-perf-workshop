# Challenge — bigfile

In this challenge you'll find a webserver that is only tasked with serving
one big file for download.

## The problem

The problem is that the server is constrained to used less memory than the size
of the file it is serving for download.

Memory constraints are usually imposed by hardware limitations, however for
practical reasons, in this challenge there is a memory watcher that will
throw an error if the memory used by the process exceeds a threshold.

Then open 2 terminal windows, one for each of these commands:

1. `node server`
2. `curl -O http://localhost:9999/download`

The server should crash right after the download starts.

**Goal: Find a different way to serve the file that doesn't use much memory**.

After you fix the problem it should be possible to run these two commands without any crashes.

If you prefer, instead of using curl, you can just use a browser to download the file.


### Notice

Before starting the server, a file named `big.dat` will be created. It is a big
file, so you might want to delete it when you're done.

Also keep in mind that every time you're downloading the file a copy is created on
your disk. A few successful downloads can quickly amount to several GBs.

## Solutions

* streams

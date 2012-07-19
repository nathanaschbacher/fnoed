# Overview

fnoed is a node.js client to [fnordmetric](https://github.com/paulasmuth/fnordmetric/) with a simple, effective interface. 

    var Fnoed = require('fnoed');
    var metrics = new Fnoed();
    
    metrics.send('my_event');
    metrics.send({ _type: 'another_event', extra_stuff: 'additional event details'});
    metrics.send('my_event', true, function(err, res) {
        metrics.close();
    });

It allows you to easily send metric events directly to the redis backing of your fnordmetric installation.  The events are in

# Installation

    $ npm install fnoed

If you haven't already installed fnordmetric then do so:

    $ gem install fnordmetric

# Examples

In the `examples/` directory of the repository you'll find both an example fnordmetric startup script which you can use like this:

    $ cd fnoed/examples
    $ ruby example_fnord.rb run

and also an example node.js program that will send events using fnoed to the above running fnordmetric instance like this:

    $ cd fnoed/examples
    $ node example_fnoed.js

# API

### new Fnoed( _options_ )

If _options_ isn't passed in then the defaults used to will be:

    options = { host: 'localhost',
                port: 6379,
                event_queue_ttl: 60 };

`host` is the location of the fnordmetric redis backend that your installation is using.

`port` is the port that the fnordmetric redis backend is running on.

`event_queue_ttl` is the fnordmetric timeout/expiration for processing new event entries.

You may also include any [node_redis options](https://github.com/mranney/node_redis/#rediscreateclientport-host-options) you like and they'll be passed right along to the underling redis client. 

### .send( _event_ , [_keepalive_, [__return_] ] )

This method is for sending events to your fnordmetric redis backend.

`event` can be either a simple string of an event name defined in fnordmetric, like `.send('my_event');` or a full event object `.send({ _type: 'my_event', foo: 'additional info', bar: 'even more still'});`

`keepalive` **( optional, default: false )** tells fnoed whether or not to close the connection after it's done sending an event.  If you have to send a lot of events in rapid succession, then you can set this to true and keep the connection open to cut down on the resources required to reconnect to redis with each new event sent.  However, you'll have to later manage manually closing the connection using the `.close()` method to keep orphaned connections from piling up.

`_return` **( optional, default: function(){} )** is a callback expecting a `err, res` signature that can be used to catch errors, validate that sending an event completed, or perform some cleanup like closing the connection.

### .close()

This is essentially a convenience wrapper around the redis client's .end() method.  If you have told your .send() method to "keepalive", then at some point you'll have to manually close your connection to keep orphaned connections from piling up.



# License

(The MIT License)

Copyright (c) 2012 Coradine Aviation Systems

Copyright (c) 2012 Nathan Aschbacher

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

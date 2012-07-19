var Fnoed = require('../../fnoed');
var my_fnord = new Fnoed();

var num_events = Math.floor(Math.random() * (20 - 1 + 1)) + 1; // generate randome integer between 1 and 20
var num_sent = 0;

var interval_id = setInterval(metering, 100);

function metering() {
    my_fnord.send("MyEvent", true, function(err, res) { // keepalive is set to true, so the events use the same connection   
        if(num_sent >= num_events) {
            my_fnord.close(); // because keepalive is set to true we need to manually close the connection at some point
            clearInterval(interval_id);
        }
        else {
            num_sent++;
        }
    });
}



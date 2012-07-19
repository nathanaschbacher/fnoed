var redis = require("redis");
var uuid = require("node-uuid");


var Fnoed = function(options) {
    this.options = options || { host: 'localhost',
                                port: 6379,
                                event_queue_ttl: 60 };
};

Fnoed.prototype.client = null;

Fnoed.prototype.connect = function(options) {
    if(this.client === null) {
        this.client = redis.createClient(options.port, options.host, options);
    }
};

Fnoed.prototype.send = function() { // (event, keepalive, _return)
    var _this = this;
    var id = uuid.v4();

    var event = arguments[0] instanceof Object ? arguments[0] : { _type: arguments[0] };
    var keepalive = typeof(arguments[1]) == 'boolean' ? arguments[1] : false;
    var _return = typeof(arguments[arguments.length - 1]) == 'function' ? arguments[arguments.length - 1] : function(){};

    _this.connect(_this.options);

    _this.client.set("fnordmetric-event-" + id, JSON.stringify(event), function(err, res) {
        if(err) { _return(err, res); }
        else{
            _this.client.expire("fnordmetric-event-" + id, _this.options.event_queue_ttl, function(err, res) {
                if(err) { _return(err, res); }
                else {
                    _this.client.lpush("fnordmetric-queue", id, function(err, res) {
                        if(!keepalive) {
                            _this.close();
                        }
                        _return(err, res);
                    });
                }
            });
        }
    });
};


Fnoed.prototype.close = function() {
    if(this.client !== null) {
        this.client.end();
        this.client = null;
    }
};

module.exports = Fnoed;
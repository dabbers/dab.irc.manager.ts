"use strict";
var Core = require('dab.irc.core/src');
var Parser = require('dab.irc.parser/src');
var ManagedChannel_1 = require('./ManagedChannel');
var ChannelManager = (function () {
    function ChannelManager() {
    }
    Object.defineProperty(ChannelManager.prototype, "users", {
        get: function () {
            return this._users;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelManager.prototype, "channels", {
        get: function () {
            return this._channels;
        },
        enumerable: true,
        configurable: true
    });
    ChannelManager.prototype.register = function (server) {
        server.on(Parser.Events.JOIN, this.bindJoin);
        server.on(Parser.Events.PART, this.bindPart);
        server.on(Parser.Events.MODE, this.bindMode);
    };
    ChannelManager.prototype.unregister = function (server) {
        server.removeListener(Parser.Events.JOIN, this.bindJoin);
        server.removeListener(Parser.Events.PART, this.bindJoin);
        server.removeListener(Parser.Events.MODE, this.bindMode);
    };
    ChannelManager.prototype.join = function (channel) {
        if (this._channels.filter(function (v, id, ar) { return v.display.toLocaleLowerCase() == channel.display.toLocaleLowerCase(); }).length > 0) {
            return false;
        }
        if (channel instanceof ManagedChannel_1.ManagedChannel) {
            this._channels.push(channel);
        }
        else {
            this._channels.push(new ManagedChannel_1.ManagedChannel(channel.display, this));
        }
        return true;
    };
    ChannelManager.prototype.bindJoin = function (s, m) {
        var msg = m;
        this._users.join(msg, msg.destination);
    };
    ChannelManager.prototype.bindPart = function (s, m) {
        var msg = m;
        this._users.part(msg, msg.destination);
    };
    ChannelManager.prototype.bindMode = function (s, m) {
        var msg = m;
        if (msg.target instanceof Core.Channel) {
            var ch = this._channels.filter(function (v, i, a) { return v.display.toLocaleLowerCase() == s.display.toLocaleLowerCase(); });
            if (ch.length > 0) {
                ch[0].modeChanged(msg.modes);
            }
        }
    };
    ChannelManager.prototype.part = function (channel) {
        var i = 0;
        for (i in this._channels) {
            if (this._channels[i].display == channel.display) {
                break;
            }
        }
        this._channels.splice(i, 1);
    };
    return ChannelManager;
}());
exports.ChannelManager = ChannelManager;
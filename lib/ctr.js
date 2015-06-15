// Generated by IcedCoffeeScript 1.7.1-g
(function() {
  var Cipher, Counter, StreamCipher, WordArray, bulk_encrypt, encrypt, iced, __iced_k, __iced_k_noop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  WordArray = require('./wordarray').WordArray;

  StreamCipher = require('./algbase').StreamCipher;

  Counter = (function() {
    Counter.prototype.WORD_MAX = 0xffffffff;

    function Counter(_arg) {
      var i, len, value;
      value = _arg.value, len = _arg.len;
      this._value = value != null ? value.clone() : (len == null ? len = 2 : void 0, new WordArray((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
          _results.push(0);
        }
        return _results;
      })()));
    }

    Counter.prototype.inc = function() {
      var go, i;
      go = true;
      i = this._value.words.length - 1;
      while (go && i >= 0) {
        if ((++this._value.words[i]) > Counter.WORD_MAX) {
          this._value.words[i] = 0;
        } else {
          go = false;
        }
        i--;
      }
      return this;
    };

    Counter.prototype.inc_le = function() {
      var go, i;
      go = true;
      i = 0;
      while (go && i < this._value.words.length) {
        if ((++this._value.words[i]) > Counter.WORD_MAX) {
          this._value.words[i] = 0;
        } else {
          go = false;
        }
        i++;
      }
      return this;
    };

    Counter.prototype.get = function() {
      return this._value;
    };

    Counter.prototype.copy = function() {
      return this._value.clone();
    };

    return Counter;

  })();

  Cipher = (function(_super) {
    __extends(Cipher, _super);

    function Cipher(_arg) {
      this.block_cipher = _arg.block_cipher, this.iv = _arg.iv;
      Cipher.__super__.constructor.call(this);
      this.bsiw = this.block_cipher.blockSize / 4;
      if (!(this.iv.sigBytes === this.block_cipher.blockSize)) {
        throw new Error("IV is wrong length (" + this.iv.sigBytes + ")");
      }
      this.ctr = new Counter({
        value: this.iv
      });
    }

    Cipher.prototype.scrub = function() {
      return this.block_cipher.scrub();
    };

    Cipher.prototype.get_pad = function() {
      var pad;
      pad = this.ctr.copy();
      this.ctr.inc();
      this.block_cipher.encryptBlock(pad.words);
      return pad;
    };

    return Cipher;

  })(StreamCipher);

  encrypt = function(_arg) {
    var block_cipher, cipher, input, iv, ret;
    block_cipher = _arg.block_cipher, iv = _arg.iv, input = _arg.input;
    cipher = new Cipher({
      block_cipher: block_cipher,
      iv: iv
    });
    ret = cipher.encrypt(input);
    cipher.scrub();
    return ret;
  };

  bulk_encrypt = function(_arg, cb) {
    var block_cipher, cipher, input, iv, progress_hook, ret, what, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    block_cipher = _arg.block_cipher, iv = _arg.iv, input = _arg.input, progress_hook = _arg.progress_hook, what = _arg.what;
    cipher = new Cipher({
      block_cipher: block_cipher,
      iv: iv
    });
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/vagrant/src/ctr.iced"
        });
        cipher.bulk_encrypt({
          input: input,
          progress_hook: progress_hook,
          what: what
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 121
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        return cb(ret);
      };
    })(this));
  };

  exports.Counter = Counter;

  exports.Cipher = Cipher;

  exports.encrypt = encrypt;

  exports.bulk_encrypt = bulk_encrypt;

}).call(this);
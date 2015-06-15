// Generated by IcedCoffeeScript 1.7.1-g
(function() {
  var HMAC, PBKDF2, WordArray, iced, pbkdf2, util, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  HMAC = require('./hmac').HMAC;

  WordArray = require('./wordarray').WordArray;

  util = require('./util');

  PBKDF2 = (function() {
    function PBKDF2(_arg) {
      this.klass = _arg.klass, this.c = _arg.c;
      this.c || (this.c = 1024);
      this.klass || (this.klass = HMAC);
    }

    PBKDF2.prototype._PRF = function(input) {
      this.prf.reset();
      return this.prf.finalize(input);
    };

    PBKDF2.prototype._gen_T_i = function(_arg, cb) {
      var U, i, progress_hook, ret, salt, seed, stop, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      salt = _arg.salt, i = _arg.i, progress_hook = _arg.progress_hook;
      progress_hook(0);
      seed = salt.clone().concat(new WordArray([i]));
      U = this._PRF(seed);
      ret = U.clone();
      i = 1;
      (function(_this) {
        return (function(__iced_k) {
          var _results, _while;
          _results = [];
          _while = function(__iced_k) {
            var _break, _continue, _next;
            _break = function() {
              return __iced_k(_results);
            };
            _continue = function() {
              return iced.trampoline(function() {
                return _while(__iced_k);
              });
            };
            _next = function(__iced_next_arg) {
              _results.push(__iced_next_arg);
              return _continue();
            };
            if (!(i < _this.c)) {
              return _break();
            } else {
              stop = Math.min(_this.c, i + 128);
              while (i < stop) {
                U = _this._PRF(U);
                ret.xor(U, {});
                i++;
              }
              progress_hook(i);
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/vagrant/src/pbkdf2.iced",
                  funcname: "PBKDF2._gen_T_i"
                });
                util.default_delay(0, 0, __iced_deferrals.defer({
                  lineno: 57
                }));
                __iced_deferrals._fulfill();
              })(function() {
                return _next(null);
              });
            }
          };
          _while(__iced_k);
        });
      })(this)((function(_this) {
        return function() {
          progress_hook(i);
          return cb(ret);
        };
      })(this));
    };

    PBKDF2.prototype.run = function(_arg, cb) {
      var bs, dkLen, flat, i, key, n, ph, progress_hook, salt, tmp, tph, words, ___iced_passed_deferral, __iced_deferrals, __iced_k, _begin, _end, _positive;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      key = _arg.key, salt = _arg.salt, dkLen = _arg.dkLen, progress_hook = _arg.progress_hook;
      this.prf = new this.klass(key);
      bs = this.prf.get_output_size();
      n = Math.ceil(dkLen / bs);
      words = [];
      tph = null;
      ph = (function(_this) {
        return function(block) {
          return function(iter) {
            return typeof progress_hook === "function" ? progress_hook({
              what: "pbkdf2",
              total: n * _this.c,
              i: block * _this.c + iter
            }) : void 0;
          };
        };
      })(this);
      ph(0)(0);
      (function(_this) {
        return (function(__iced_k) {
          var _i, _results, _while;
          i = 1;
          _begin = 1;
          _end = n;
          _positive = _end > _begin;
          _results = [];
          _while = function(__iced_k) {
            var _break, _continue, _next;
            _break = function() {
              return __iced_k(_results);
            };
            _continue = function() {
              return iced.trampoline(function() {
                if (_positive) {
                  i += 1;
                } else {
                  i -= 1;
                }
                return _while(__iced_k);
              });
            };
            _next = function(__iced_next_arg) {
              _results.push(__iced_next_arg);
              return _continue();
            };
            if (!!((_positive === true && i > n) || (_positive === false && i < n))) {
              return _break();
            } else {

              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/vagrant/src/pbkdf2.iced",
                  funcname: "PBKDF2.run"
                });
                _this._gen_T_i({
                  salt: salt,
                  i: i,
                  progress_hook: ph(i - 1)
                }, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return tmp = arguments[0];
                    };
                  })(),
                  lineno: 80
                }));
                __iced_deferrals._fulfill();
              })(function() {
                return _next(words.push(tmp.words));
              });
            }
          };
          _while(__iced_k);
        });
      })(this)((function(_this) {
        return function() {
          var _ref;
          ph(n)(0);
          flat = (_ref = []).concat.apply(_ref, words);
          key.scrub();
          _this.prf.scrub();
          _this.prf = null;
          return cb(new WordArray(flat, dkLen));
        };
      })(this));
    };

    return PBKDF2;

  })();

  pbkdf2 = function(_arg, cb) {
    var c, dkLen, eng, key, klass, out, progress_hook, salt, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    key = _arg.key, salt = _arg.salt, klass = _arg.klass, c = _arg.c, dkLen = _arg.dkLen, progress_hook = _arg.progress_hook;
    eng = new PBKDF2({
      klass: klass,
      c: c
    });
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/vagrant/src/pbkdf2.iced"
        });
        eng.run({
          key: key,
          salt: salt,
          dkLen: dkLen,
          progress_hook: progress_hook
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return out = arguments[0];
            };
          })(),
          lineno: 106
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        return cb(out);
      };
    })(this));
  };

  exports.pbkdf2 = pbkdf2;

  exports.PBKDF2 = PBKDF2;

}).call(this);
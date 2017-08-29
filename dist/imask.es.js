function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

function conform(res, str) {
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  return isString(res) ? res : res ? str : fallback;
}

var DIRECTION = {
  NONE: 0,
  LEFT: -1,
  RIGHT: 1
};

function indexInDirection(pos, direction) {
  if (direction === DIRECTION.LEFT) --pos;
  return pos;
}

function refreshValue(target, key, descriptor) {
  var method = descriptor.set;
  descriptor.set = function () {
    var unmasked = void 0;
    if (this.isInitialized) unmasked = this.unmaskedValue;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var ret = method.call.apply(method, [this].concat(args));
    if (unmasked != null) this.unmaskedValue = unmasked;
    return ret;
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var Masked = (_class = function () {
  function Masked(_ref) {
    var mask = _ref.mask,
        validate = _ref.validate;
    classCallCheck(this, Masked);

    this._value = '';
    this.mask = mask;
    this.validate = validate || function () {
      return true;
    };
    this.isInitialized = true;
  }

  Masked.prototype._validate = function _validate() {
    return this.validate(this);
  };

  Masked.prototype.clone = function clone() {
    var m = new Masked(this);
    m._value = this.value.slice();
    return m;
  };

  Masked.prototype.reset = function reset() {
    this._value = '';
  };

  Masked.prototype.nearestInputPos = function nearestInputPos(cursorPos) /* direction */{
    return cursorPos;
  };

  Masked.prototype.extractInput = function extractInput() {
    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

    return this.value.slice(fromPos, toPos);
  };

  Masked.prototype._extractTail = function _extractTail() {
    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

    return this.extractInput(fromPos, toPos);
  };

  Masked.prototype._appendTail = function _appendTail(tail) {
    return !tail || this.append(tail);
  };

  Masked.prototype.append = function append(str, soft) {
    var oldValueLength = this.value.length;
    var consistentValue = this.clone();

    for (var ci = 0; ci < str.length; ++ci) {
      this._value += str[ci];
      if (this._validate() === false) {
        _extends(this, consistentValue);
        if (!soft) return false;
      }

      consistentValue = this.clone();
    }

    return this.value.length - oldValueLength;
  };

  // TODO
  // insert (str, fromPos, skipUnresolved)

  Masked.prototype.appendWithTail = function appendWithTail(str, tail) {
    // TODO refactor
    var appendCount = 0;
    var consistentValue = this.clone();
    var consistentAppended = void 0;

    for (var ci = 0; ci < str.length; ++ci) {
      var ch = str[ci];

      var appended = this.append(ch, true);
      consistentAppended = this.clone();
      var tailAppended = appended !== false && this._appendTail(tail) !== false;
      if (tailAppended === false) {
        _extends(this, consistentValue);
        break;
      }

      consistentValue = this.clone();
      _extends(this, consistentAppended);
      appendCount += appended;
    }

    // TODO needed for cases when
    // 1) REMOVE ONLY AND NO LOOP AT ALL
    // 2) last loop iteration removes tail
    // 3) when breaks on tail insert
    this._appendTail(tail);

    return appendCount;
  };

  Masked.prototype._unmask = function _unmask() {
    return this.value;
  };

  Masked.prototype.clear = function clear() {
    var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

    this._value = this.value.slice(0, from) + this.value.slice(to);
  };

  Masked.prototype.splice = function splice(start, deleteCount, inserted, removeDirection) {
    var tailPos = start + deleteCount;
    var tail = this._extractTail(tailPos);

    start = this.nearestInputPos(start, removeDirection);
    this.clear(start);
    return this.appendWithTail(inserted, tail);
  };

  createClass(Masked, [{
    key: 'mask',
    get: function get$$1() {
      return this._mask;
    },
    set: function set$$1(mask) {
      this._mask = mask;
    }
  }, {
    key: 'value',
    get: function get$$1() {
      return this._value;
    },
    set: function set$$1(value) {
      this.reset();
      this.append(value, true);
      this._appendTail();
    }
  }, {
    key: 'unmaskedValue',
    get: function get$$1() {
      return this._unmask();
    },
    set: function set$$1(value) {
      this.reset();
      this.append(value);
      this._appendTail();
    }
  }, {
    key: 'isComplete',
    get: function get$$1() {
      return true;
    }
  }]);
  return Masked;
}(), (_applyDecoratedDescriptor(_class.prototype, 'mask', [refreshValue], Object.getOwnPropertyDescriptor(_class.prototype, 'mask'), _class.prototype)), _class);

function createMask(opts) {
  var mask = opts.mask;
  if (mask instanceof Masked) return mask;
  if (mask instanceof RegExp) return new Masked(_extends({}, opts, {
    validate: function validate(masked) {
      return mask.test(masked.value);
    }
  }));
  if (isString(mask)) return new PatternMasked(opts);
  if (mask.prototype instanceof Masked) return new mask(opts);
  if (mask instanceof Function) return new Masked(_extends({}, opts, {
    validate: mask
  }));
  return new Masked(opts);
}

var PatternDefinition = function () {
  function PatternDefinition(opts) {
    classCallCheck(this, PatternDefinition);

    _extends(this, opts);

    if (this.mask) {
      this._masked = createMask(opts);
    }
  }

  PatternDefinition.prototype.reset = function reset() {
    this.isHollow = false;
    if (this._masked) this._masked.reset();
  };

  PatternDefinition.prototype.resolve = function resolve(ch) {
    if (!this._masked) return false;
    // TODO seems strange
    this._masked.value = ch;
    return this._masked.value;
  };

  createClass(PatternDefinition, [{
    key: 'isInput',
    get: function get$$1() {
      return this.type === PatternDefinition.TYPES.INPUT;
    }
  }, {
    key: 'isHiddenHollow',
    get: function get$$1() {
      return this.isHollow && this.optional;
    }
  }]);
  return PatternDefinition;
}();

PatternDefinition.DEFAULTS = {
  '0': /\d/,
  'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/, // http://stackoverflow.com/a/22075070
  '*': /./
};
PatternDefinition.TYPES = {
  INPUT: 'input',
  FIXED: 'fixed'
};

var _class$1;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var PatternMasked = (_class$1 = function (_Masked) {
  inherits(PatternMasked, _Masked);

  function PatternMasked(opts) {
    classCallCheck(this, PatternMasked);
    var definitions = opts.definitions,
        placeholder = opts.placeholder;

    var _this = possibleConstructorReturn(this, _Masked.call(this, opts));

    delete _this.isInitialized;

    _this.placeholder = placeholder;
    _this.definitions = definitions;

    _this.isInitialized = true;
    return _this;
  }

  PatternMasked.prototype._updateMask = function _updateMask() {
    var _this2 = this;

    var defs = this._definitions;
    this._charDefs = [];

    var pattern = this.mask;
    if (!pattern || !defs) return;

    var unmaskingBlock = false;
    var optionalBlock = false;
    var stopAlign = false;

    var _loop = function _loop(_i) {
      var char = pattern[_i];
      var type = !unmaskingBlock && char in defs ? PatternDefinition.TYPES.INPUT : PatternDefinition.TYPES.FIXED;
      var unmasking = type === PatternDefinition.TYPES.INPUT || unmaskingBlock;
      var optional = type === PatternDefinition.TYPES.INPUT && optionalBlock;

      if (char === PatternMasked.STOP_CHAR) {
        stopAlign = true;
        return 'continue';
      }

      if (char === '{' || char === '}') {
        unmaskingBlock = !unmaskingBlock;
        return 'continue';
      }

      if (char === '[' || char === ']') {
        optionalBlock = !optionalBlock;
        return 'continue';
      }

      if (char === PatternMasked.ESCAPE_CHAR) {
        ++_i;
        char = pattern[_i];
        // TODO validation
        if (!char) return 'break';
        type = PatternDefinition.TYPES.FIXED;
      }

      _this2._charDefs.push(new PatternDefinition({
        char: char,
        type: type,
        optional: optional,
        stopAlign: stopAlign,
        mask: unmasking && (type === PatternDefinition.TYPES.INPUT ? defs[char] : function (m) {
          return m.value === char;
        })
      }));

      stopAlign = false;
      i = _i;
    };

    _loop2: for (var i = 0; i < pattern.length; ++i) {
      var _ret = _loop(i);

      switch (_ret) {
        case 'continue':
          continue;

        case 'break':
          break _loop2;}
    }
  };

  PatternMasked.prototype.clone = function clone() {
    var _this3 = this;

    var m = new PatternMasked(this);
    m._value = this.value.slice();
    m._charDefs.forEach(function (d, i) {
      return _extends(d, _this3._charDefs[i]);
    });
    return m;
  };

  PatternMasked.prototype.reset = function reset() {
    _Masked.prototype.reset.call(this);
    this._charDefs.forEach(function (d) {
      delete d.isHollow;
    });
  };

  PatternMasked.prototype.hiddenHollowsBefore = function hiddenHollowsBefore(defIndex) {
    return this._charDefs.slice(0, defIndex).filter(function (d) {
      return d.isHiddenHollow;
    }).length;
  };

  PatternMasked.prototype.mapDefIndexToPos = function mapDefIndexToPos(defIndex) {
    if (defIndex == null) return;
    return defIndex - this.hiddenHollowsBefore(defIndex);
  };

  PatternMasked.prototype.mapPosToDefIndex = function mapPosToDefIndex(pos) {
    if (pos == null) return;
    var defIndex = pos;
    for (var di = 0; di < this._charDefs.length; ++di) {
      var def = this._charDefs[di];
      if (di >= defIndex) break;
      if (def.isHiddenHollow) ++defIndex;
    }
    return defIndex;
  };

  PatternMasked.prototype._unmask = function _unmask() {
    var str = this.value;
    var unmasked = '';

    for (var ci = 0, di = 0; ci < str.length && di < this._charDefs.length; ++di) {
      var ch = str[ci];
      var def = this._charDefs[di];

      if (def.isHiddenHollow) continue;
      if (def.unmasking && !def.isHollow) unmasked += ch;
      ++ci;
    }

    return unmasked;
  };

  PatternMasked.prototype._appendTail = function _appendTail(tail) {
    return (!tail || this.appendChunks(tail)) && this._appendPlaceholder();
  };

  PatternMasked.prototype.append = function append(str, soft) {
    var oldValueLength = this.value.length;

    for (var ci = 0, di = this.mapPosToDefIndex(this.value.length); ci < str.length;) {
      var ch = str[ci];
      var def = this._charDefs[di];

      // check overflow
      if (!def) return false;

      // reset
      def.isHollow = false;

      var resolved = void 0,
          skipped = void 0;
      var chres = conform(def.resolve(ch), ch);

      if (def.type === PatternDefinition.TYPES.INPUT) {
        if (chres) {
          var m = this.clone();
          this._value += chres;
          if (!this._validate()) {
            chres = '';
            _extends(this, m);
          }
        }

        resolved = !!chres;
        skipped = !chres && !def.optional;

        // if ok - next di
        if (!chres) {
          if (!def.optional && !soft) {
            this._value += this.placeholder.char;
            skipped = false;
          }
          if (!skipped) def.isHollow = true;
        }
      } else {
        this._value += def.char;
        resolved = chres && (def.mask || soft);
      }

      if (!skipped) ++di;
      if (resolved || skipped) ++ci;
    }

    return this.value.length - oldValueLength;
  };

  PatternMasked.prototype.appendChunks = function appendChunks(chunks, soft) {
    for (var ci = 0; ci < chunks.length; ++ci) {
      var _chunks$ci = chunks[ci],
          fromDefIndex = _chunks$ci[0],
          input = _chunks$ci[1];

      if (fromDefIndex != null) this._appendPlaceholder(fromDefIndex);
      if (this.append(input, soft) === false) return false;
    }
    return true;
  };

  PatternMasked.prototype._extractTail = function _extractTail(fromPos, toPos) {
    return this.extractInputChunks(fromPos, toPos);
  };

  PatternMasked.prototype.extractInput = function extractInput() {
    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

    // TODO fromPos === toPos
    var str = this.value;
    var input = '';

    var toDefIndex = this.mapPosToDefIndex(toPos);
    for (var ci = fromPos, di = this.mapPosToDefIndex(fromPos); ci < toPos && di < toDefIndex; ++di) {
      var ch = str[ci];
      var def = this._charDefs[di];

      if (!def) break;
      if (def.isHiddenHollow) continue;

      if (def.isInput && !def.isHollow) input += ch;
      ++ci;
    }
    return input;
  };

  PatternMasked.prototype.extractInputChunks = function extractInputChunks() {
    var _this4 = this;

    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

    // TODO fromPos === toPos
    var fromDefIndex = this.mapPosToDefIndex(fromPos);
    var toDefIndex = this.mapPosToDefIndex(toPos);
    var stopDefIndices = this._charDefs.map(function (d, i) {
      return [d, i];
    }).slice(fromDefIndex, toDefIndex).filter(function (_ref) {
      var d = _ref[0];
      return d.stopAlign;
    }).map(function (_ref2) {
      var i = _ref2[1];
      return i;
    });

    var stops = [fromDefIndex].concat(stopDefIndices, [toDefIndex]);

    return stops.map(function (s, i) {
      return [stopDefIndices.indexOf(s) >= 0 ? s : null, _this4.extractInput(_this4.mapDefIndexToPos(s), _this4.mapDefIndexToPos(stops[++i]))];
    });
  };

  PatternMasked.prototype._appendPlaceholder = function _appendPlaceholder(toDefIndex) {
    var maxDefIndex = toDefIndex || this._charDefs.length;
    for (var di = this.mapPosToDefIndex(this.value.length); di < maxDefIndex; ++di) {
      var def = this._charDefs[di];
      if (def.isInput) def.isHollow = true;

      if (this.placeholder.show === 'always' || toDefIndex) {
        this._value += !def.isInput ? def.char : !def.optional ? this.placeholder.char : '';
      }
    }
  };

  PatternMasked.prototype.clear = function clear() {
    var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

    this._value = this.value.slice(0, from) + this.value.slice(to);
    var fromDefIndex = this.mapPosToDefIndex(from);
    var toDefIndex = this.mapPosToDefIndex(to);
    this._charDefs.slice(fromDefIndex, toDefIndex).forEach(function (d) {
      return d.reset();
    });
  };

  PatternMasked.prototype.nearestInputPos = function nearestInputPos(cursorPos) {
    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.LEFT;

    if (!direction) return cursorPos;

    var initialDefIndex = this.mapPosToDefIndex(cursorPos);
    var di = initialDefIndex;

    var firstInputIndex = void 0,
        firstFilledInputIndex = void 0,
        firstVisibleHollowIndex = void 0,
        nextdi = void 0;

    // search forward
    for (nextdi = indexInDirection(di, direction); 0 <= nextdi && nextdi < this._charDefs.length; di += direction, nextdi += direction) {
      var nextDef = this._charDefs[nextdi];
      if (firstInputIndex == null && nextDef.isInput) firstInputIndex = di;
      if (firstVisibleHollowIndex == null && nextDef.isHollow && !nextDef.isHiddenHollow) firstVisibleHollowIndex = di;
      if (nextDef.isInput && !nextDef.isHollow) {
        firstFilledInputIndex = di;
        break;
      }
    }

    if (direction === DIRECTION.LEFT || firstInputIndex == null) {
      // search backwards
      direction = -direction;
      var overflow = false;

      // find hollows only before initial pos
      for (nextdi = indexInDirection(di, direction); 0 <= nextdi && nextdi < this._charDefs.length; di += direction, nextdi += direction) {
        var _nextDef = this._charDefs[nextdi];
        if (_nextDef.isInput) {
          firstInputIndex = di;
          if (_nextDef.isHollow && !_nextDef.isHiddenHollow) break;
        }

        // if hollow not found before start position - set `overflow`
        // and try to find just any input
        if (di === initialDefIndex) overflow = true;

        // first input found
        if (overflow && firstInputIndex != null) break;
      }

      // process overflow
      overflow = overflow || nextdi >= this._charDefs.length;
      if (overflow && firstInputIndex != null) di = firstInputIndex;
    } else if (firstFilledInputIndex == null) {
      // adjust index if delete at right and filled input not found at right
      di = firstVisibleHollowIndex != null ? firstVisibleHollowIndex : firstInputIndex;
    }

    return this.mapDefIndexToPos(di);
  };

  createClass(PatternMasked, [{
    key: 'placeholder',
    get: function get$$1() {
      return this._placeholder;
    },
    set: function set$$1(ph) {
      this._placeholder = _extends({}, PatternMasked.DEFAULT_PLACEHOLDER, ph);
    }
  }, {
    key: 'definitions',
    get: function get$$1() {
      return this._definitions;
    },
    set: function set$$1(defs) {
      defs = _extends({}, PatternDefinition.DEFAULTS, defs);

      this._definitions = defs;
      this._updateMask();
    }
  }, {
    key: 'mask',
    get: function get$$1() {
      return this._mask;
    },
    set: function set$$1(mask) {
      this._mask = mask;
      this._updateMask();
    }
  }, {
    key: 'isComplete',
    get: function get$$1() {
      return !this._charDefs.some(function (d) {
        return d.isInput && !d.optional && d.isHollow;
      });
    }
  }]);
  return PatternMasked;
}(Masked), (_applyDecoratedDescriptor$1(_class$1.prototype, 'placeholder', [refreshValue], Object.getOwnPropertyDescriptor(_class$1.prototype, 'placeholder'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1.prototype, 'definitions', [refreshValue], Object.getOwnPropertyDescriptor(_class$1.prototype, 'definitions'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1.prototype, 'mask', [refreshValue], Object.getOwnPropertyDescriptor(_class$1.prototype, 'mask'), _class$1.prototype)), _class$1);
PatternMasked.DEFAULT_PLACEHOLDER = {
  show: 'lazy',
  char: '_'
};
PatternMasked.STOP_CHAR = '`';
PatternMasked.ESCAPE_CHAR = '\\';
PatternMasked.Definition = PatternDefinition;

var ActionDetails = function () {
  function ActionDetails(value, cursorPos, oldValue, oldSelection) {
    classCallCheck(this, ActionDetails);

    this.value = value;
    this.cursorPos = cursorPos;
    this.oldValue = oldValue;
    this.oldSelection = oldSelection;
  }

  createClass(ActionDetails, [{
    key: 'startChangePos',
    get: function get$$1() {
      return Math.min(this.cursorPos, this.oldSelection.start);
    }
  }, {
    key: 'insertedCount',
    get: function get$$1() {
      return this.cursorPos - this.startChangePos;
    }
  }, {
    key: 'inserted',
    get: function get$$1() {
      return this.value.substr(this.startChangePos, this.insertedCount);
    }
  }, {
    key: 'removedCount',
    get: function get$$1() {
      // Math.max for opposite operation
      return Math.max(this.oldSelection.end - this.startChangePos ||
      // for Delete
      this.oldValue.length - this.value.length, 0);
    }
  }, {
    key: 'removed',
    get: function get$$1() {
      return this.oldValue.substr(this.startChangePos, this.removedCount);
    }
  }, {
    key: 'head',
    get: function get$$1() {
      return this.value.substring(0, this.startChangePos);
    }
  }, {
    key: 'tail',
    get: function get$$1() {
      this.value.substring(this.startChangePos + this.insertedCount);
    }
  }, {
    key: 'removeDirection',
    get: function get$$1() {
      return this.removedCount && (this.oldSelection.end === this.cursorPos || this.insertedCount ? DIRECTION.RIGHT : DIRECTION.LEFT);
    }
  }]);
  return ActionDetails;
}();

var InputMask = function () {
  function InputMask(el, opts) {
    classCallCheck(this, InputMask);

    this.el = el;
    this.masked = createMask(opts);

    this._listeners = {};
    this._value = '';
    this._unmaskedValue = '';

    this.saveSelection = this.saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._alignCursor = this._alignCursor.bind(this);
    this._alignCursorFriendly = this._alignCursorFriendly.bind(this);
  }

  InputMask.prototype.on = function on(ev, handler) {
    if (!this._listeners[ev]) this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  };

  InputMask.prototype.off = function off(ev, handler) {
    if (!this._listeners[ev]) return;
    if (!handler) {
      delete this._listeners[ev];
      return;
    }
    var hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0) this._listeners.splice(hIndex, 1);
    return this;
  };

  InputMask.prototype.bindEvents = function bindEvents() {
    this.el.addEventListener('keydown', this.saveSelection);
    this.el.addEventListener('input', this._onInput);
    this.el.addEventListener('drop', this._onDrop);
    this.el.addEventListener('click', this._alignCursorFriendly);
    this.el.addEventListener('change', this._onChange);
  };

  InputMask.prototype.unbindEvents = function unbindEvents() {
    this.el.removeEventListener('keydown', this.saveSelection);
    this.el.removeEventListener('input', this._onInput);
    this.el.removeEventListener('drop', this._onDrop);
    this.el.removeEventListener('click', this._alignCursorFriendly);
    this.el.removeEventListener('change', this._onChange);
  };

  InputMask.prototype.fireEvent = function fireEvent(ev) {
    var listeners = this._listeners[ev] || [];
    listeners.forEach(function (l) {
      return l();
    });
  };

  InputMask.prototype.saveSelection = function saveSelection(ev) {
    if (this.value !== this.el.value) {
      console.warn('Uncontrolled input change, refresh mask manually!');
    }
    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  };

  InputMask.prototype.destroy = function destroy() {
    this.unbindEvents();
    this._listeners.length = 0;
  };

  InputMask.prototype.updateValue = function updateValue() {
    var newUnmaskedValue = this.masked.unmaskedValue;
    var newValue = this.masked.value;
    var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;

    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;

    if (this.el.value !== newValue) this.el.value = newValue;
    if (isChanged) this._fireChangeEvents();
  };

  InputMask.prototype._fireChangeEvents = function _fireChangeEvents() {
    this.fireEvent('accept');
    if (this.masked.isComplete) this.fireEvent('complete');
  };

  InputMask.prototype.updateCursor = function updateCursor(cursorPos) {
    if (cursorPos == null) return;
    this.cursorPos = cursorPos;

    // also queue change cursor for mobile browsers
    this._delayUpdateCursor(cursorPos);
  };

  InputMask.prototype._delayUpdateCursor = function _delayUpdateCursor(cursorPos) {
    var _this = this;

    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(function () {
      _this.cursorPos = _this._changingCursorPos;
      _this._abortUpdateCursor();
    }, 10);
  };

  InputMask.prototype._abortUpdateCursor = function _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  };

  InputMask.prototype._alignCursor = function _alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.cursorPos);
  };

  InputMask.prototype._alignCursorFriendly = function _alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos) return;
    this._alignCursor();
  };

  InputMask.prototype._onInput = function _onInput() {
    this._abortUpdateCursor();

    var details = new ActionDetails(
    // new state
    this.el.value, this.cursorPos,
    // old state
    this.value, this._selection);

    var insertedCount = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection);

    var cursorPos = this.masked.nearestInputPos(details.startChangePos + insertedCount,
    // if none was removed - align to right
    details.removeDirection || DIRECTION.RIGHT);

    this.updateValue();
    this.updateCursor(cursorPos);
  };

  InputMask.prototype._onChange = function _onChange() {
    if (this.value !== this.el.value) this.value = this.el.value;
  };

  InputMask.prototype._onDrop = function _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  };

  createClass(InputMask, [{
    key: 'mask',
    get: function get$$1() {
      return this.masked.mask;
    },
    set: function set$$1(mask) {
      // TODO check
      this.masked.mask = mask;
      this.masked = createMask(this.masked);
    }
  }, {
    key: 'value',
    get: function get$$1() {
      return this._value;
    },
    set: function set$$1(str) {
      this.masked.value = str;
      this.updateValue();
      this._alignCursor();
    }
  }, {
    key: 'selectionStart',
    get: function get$$1() {
      return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
    }
  }, {
    key: 'cursorPos',
    get: function get$$1() {
      return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
    },
    set: function set$$1(pos) {
      if (this.el !== document.activeElement) return;

      this.el.setSelectionRange(pos, pos);
      this.saveSelection();
    }
  }, {
    key: 'unmaskedValue',
    get: function get$$1() {
      return this._unmaskedValue;
    },
    set: function set$$1(str) {
      this.masked.unmaskedValue = str;
      this.updateValue();
      this._alignCursor();
    }
  }]);
  return InputMask;
}();

function IMask(el) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var mask = new InputMask(el, opts);
  mask.bindEvents();
  // refresh
  mask.value = el.value;
  return mask;
}

IMask.InputMask = InputMask;

IMask.Masked = Masked;
IMask.PatternMasked = PatternMasked;

window.IMask = IMask;

export default IMask;
//# sourceMappingURL=imask.es.js.map
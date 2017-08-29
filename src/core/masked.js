import {refreshValue} from './utils';


export default
class Masked {
  constructor ({mask, validate}) {
    this._value = '';
    this.mask = mask;
    this.validate = validate || (() => true);
    this.isInitialized = true;
  }

  get mask () {
    return this._mask;
  }

  @refreshValue
  set mask (mask) {
    this._mask = mask;
  }

  _validate () {
    return this.validate(this);
  }

  clone () {
    const m = new Masked(this);
    m._value = this.value.slice();
    return m;
  }

  reset () {
    this._value = '';
  }

  get value () {
    return this._value;
  }

  set value (value) {
    this.reset();
    this.append(value, true);
    this._appendTail();
  }

  get unmaskedValue () {
    return this._unmask();
  }

  set unmaskedValue (value) {
    this.reset();
    this.append(value);
    this._appendTail();
  }

  get isComplete () {
    return true;
  }

  nearestInputPos (cursorPos, /* direction */) {
    return cursorPos;
  }

  extractInput (fromPos=0, toPos=this.value.length) {
    return this.value.slice(fromPos, toPos);
  }

  _extractTail (fromPos=0, toPos=this.value.length) {
    return this.extractInput(fromPos, toPos);
  }

  _appendTail (tail) {
    return !tail || this.append(tail);
  }

  append (str, soft) {
    const oldValueLength = this.value.length;
    let consistentValue = this.clone();

    for (let ci=0; ci<str.length; ++ci) {
      this._value += str[ci];
      if (this._validate() === false) {
        Object.assign(this, consistentValue);
        if (!soft) return false;
      }

      consistentValue = this.clone();
    }

    return this.value.length - oldValueLength;

  }

  // TODO
  // insert (str, fromPos, skipUnresolved)

  appendWithTail (str, tail) {
    // TODO refactor
    let appendCount = 0;
    let consistentValue = this.clone();
    let consistentAppended;

    for (let ci=0; ci<str.length; ++ci) {
      const ch = str[ci];

      const appended = this.append(ch, true);
      consistentAppended = this.clone();
      const tailAppended = appended !== false && this._appendTail(tail) !== false;
      if (tailAppended === false) {
        Object.assign(this, consistentValue);
        break;
      }

      consistentValue = this.clone();
      Object.assign(this, consistentAppended);
      appendCount += appended;
    }

    // TODO needed for cases when
    // 1) REMOVE ONLY AND NO LOOP AT ALL
    // 2) last loop iteration removes tail
    // 3) when breaks on tail insert
    this._appendTail(tail);

    return appendCount;
  }

  _unmask () {
    return this.value;
  }

  clear (from=0, to=this.value.length) {
    this._value = this.value.slice(0, from) + this.value.slice(to);
  }

  splice (start, deleteCount, inserted, removeDirection) {
    const tailPos = start + deleteCount;
    const tail = this._extractTail(tailPos);

    start = this.nearestInputPos(start, removeDirection);
    this.clear(start);
    return this.appendWithTail(inserted, tail);
  }
}
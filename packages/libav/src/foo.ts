declare type Pointer = number;

class Base {
  _ptr: Pointer;

  constructor(ptr: Pointer) {
    this._ptr = ptr;
  }
}

export default {
  Base,
};

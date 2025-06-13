class ValueEvent extends EventTarget {
    #value;

    constructor(value) {
        super();
        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.setValue(value);
    }
    
    setValue(value) {
        this.#value = value;
        this.revaluate();
    }

    setValueStatic(value) {
        this.#value = value
    }

    revaluate() {
        this.dispatchEvent(new Event("change"));
    }
}

module.exports = ValueEvent
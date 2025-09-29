class Serializer {
    constructor(obj_name) {
        this.name = obj_name;
    }

    save(data) {
        window.sessionStorage.setItem(this.name, JSON.stringify(data));
    }

    load() {
        return JSON.parse(window.sessionStorage.getItem(this.name));
    }
}

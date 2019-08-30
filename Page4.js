var Page4 = /** @class */ (function () {
    function Page4() {
        var _this = this;
        this._config = {
            option: {
                dom: null,
                show: true,
                refresh: false,
                class_name: "JH_Page1",
                stopPropagation: true,
                log: false,
                auto_hidden: false
            },
            page: {
                index: 0,
                size: 0,
                total: 0,
                pages: 0,
                from: 0,
                to: 0 //当前页记录结束位置
            },
            condition: ["num_total", "condition.page_index", "condition.page_size"],
            size: {
                dom: null,
                show: true,
                items: [20, 30, 50],
                class_name: "size",
                element: null
            },
            summary: {
                dom: null,
                show: true,
                auto_hidden: true,
                class_name: "summary",
                text: function (page) {
                    return "共<b>" + page.pages + "</b>页，每页<b>" + page.size + "</b>条。" +
                        "当前第<b>" + (page.index + 1) + "</b>页，显示<b>" + page.from + "</b>-<b>" + page.to + "</b>条，" +
                        "共<b>" + page.total + "</b>条。";
                },
                element: null
            },
            buttons: {
                number: {
                    start: 1,
                    end: 0,
                    max: 10
                },
                prev: {
                    dom: null,
                    text: "&lt;",
                    show: true,
                    auto_hidden: false,
                    class_name: {
                        name: "prev",
                        off: "off"
                    },
                    attr: {
                        href: "javascript:;"
                    }
                },
                next: {
                    dom: null,
                    text: "&gt;",
                    show: true,
                    auto_hidden: false,
                    class_name: {
                        name: "next",
                        off: "off"
                    },
                    attr: {
                        href: "javascript:;"
                    }
                },
                first: {
                    dom: null,
                    text: "&laquo;",
                    show: false,
                    auto_hidden: true,
                    class_name: {
                        name: "first",
                        off: "off"
                    },
                    attr: {
                        href: "javascript:;"
                    }
                },
                last: {
                    dom: null,
                    text: "&raquo;",
                    show: false,
                    auto_hidden: true,
                    class_name: {
                        name: "last",
                        off: "off"
                    },
                    attr: {
                        href: "javascript:;"
                    }
                },
                num: {
                    class_name: {
                        name: "cell",
                        on: "on"
                    },
                    attr: {
                        href: "javascript:;"
                    }
                }
            }
        };
        this.handle = function (e) { _this.clickAction(e); };
        this.sizehandle = function (e) { _this.cellAction(0, parseInt(_this._config.size.dom.value)); };
    }
    Object.defineProperty(Page4.prototype, "dom", {
        get: function () { return this._config.option.dom; },
        set: function (element) { this._config.option.dom = element; },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Page4.prototype, "index", {
        get: function () { return this._config.page.index; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Page4.prototype, "size", {
        get: function () { return this._config.page.size; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Page4.prototype, "hidden", {
        set: function (b) { this.dom.style.display = b ? "none" : "block"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page4.prototype, "config", {
        set: function (config) {
            this.setConfig(this._config, config);
        },
        enumerable: true,
        configurable: true
    });
    Page4.prototype.run = function (condition) {
        this.setSetting(condition);
        this.init();
        return this;
    };
    Page4.prototype.setSetting = function (condition) {
        var cs = this._config.condition;
        if (cs.length < 3)
            return;
        var total, index, size;
        if (condition === void 0) {
            total = 0;
            index = 0;
            size = this._config.size.items[0];
        }
        else {
            try {
                total = parseInt(eval("condition." + cs[0]));
            }
            catch (e) {
                total = 0;
            }
            ;
            try {
                index = parseInt(eval("condition." + cs[1]));
            }
            catch (e) {
                index = 0;
            }
            ;
            try {
                size = parseInt(eval("condition." + cs[2]));
            }
            catch (e) {
                size = 0;
            }
            ;
        }
        var pages = size == 0 ? 0 : Math.ceil(total / size);
        var from = total == 0 ? 0 : index * size + 1;
        var to;
        if ((index + 1) * size > total)
            to = total;
        else
            to = (index + 1) * size;
        this._config.page = { index: index, size: size, total: total, pages: pages, from: from, to: to };
        this.setNumber(index, size, total, pages);
        return this._config.page;
    };
    /**
     * 计算页码的起始数字和结束数字(必须执行)
     * */
    Page4.prototype.setNumber = function (index, size, total, pages) {
        var conf = this._config.buttons.number;
        var start, end;
        if (index + 1 < conf.max) {
            start = 1;
            end = conf.max;
        }
        else {
            start = index - Math.floor(conf.max / 2) + 1;
            end = start + conf.max - 1;
        }
        end = end > pages ? pages : end;
        start = end == pages ? end - conf.max : start;
        start = start < 1 ? 1 : start;
        conf.start = start;
        conf.end = end;
    };
    Page4.prototype.init = function () {
        if (this._config.option.log)
            console.log(this._config);
        if (this._config.option.dom) {
            var child = this._config.option.dom.childNodes;
            for (var i = child.length - 1; i >= 0; i--) {
                this._config.option.dom.removeChild(child[i]);
            }
        }
        this.createDom();
        this.createSize();
        this.createFirst();
        this.createPrev();
        this.createButtons();
        this.createNext();
        this.createLast();
        this.createsummary();
        return this;
    };
    Page4.prototype.destory = function () {
        var conf = this._config.option;
        conf.dom.removeEventListener("click", this.handle);
        conf.dom.removeEventListener("change", this.sizehandle);
    };
    Page4.prototype.createDom = function () {
        var conf = this._config.option;
        if (!conf.dom) {
            conf.dom = document.createElement("ul");
            conf.dom.classList.add(conf.class_name);
            conf.dom.addEventListener("click", this.handle);
        }
        conf.dom.hidden = !conf.show;
        if (conf.auto_hidden) {
            conf.dom.hidden = this._config.page.total <= this._config.page.size;
        }
        return this;
    };
    Page4.prototype.createSize = function () {
        var conf = this._config.size;
        if (conf.dom)
            conf.dom.removeEventListener("change", this.sizehandle);
        conf.dom = document.createElement("select");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.classList.add(conf.class_name);
        conf.dom.hidden = !conf.show;
        for (var x in conf.items) {
            var opt = document.createElement("option");
            if (conf.items[x] == this._config.page.size)
                opt.selected = true;
            opt.value = conf.items[x] + "";
            opt.innerHTML = conf.items[x] + "";
            conf.dom.appendChild(opt);
        }
        if (conf.element != null) {
            this.appendToElement(conf.element, conf.dom);
        }
        else {
            this.dom.appendChild(conf.dom);
        }
        conf.dom.addEventListener("change", this.sizehandle);
    };
    Page4.prototype.createFirst = function () {
        var conf = this._config.buttons.first;
        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.hidden = !conf.show;
        conf.dom.setAttribute("at", "first");
        this.dom.appendChild(conf.dom);
        if (this._config.buttons.number.start == 1) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden)
                conf.dom.hidden = true;
        }
    };
    Page4.prototype.createPrev = function () {
        var conf = this._config.buttons.prev;
        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.hidden = !conf.show;
        conf.dom.setAttribute("at", "prev");
        if (this.index == 0) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden)
                conf.dom.hidden = true;
        }
        this.dom.appendChild(conf.dom);
    };
    Page4.prototype.createButtons = function () {
        var conf = this._config.buttons.number;
        var num_conf = this._config.buttons.num;
        for (var i = conf.start; i <= conf.end; i++) {
            var li = document.createElement("a");
            this.setAttr(li, num_conf.attr);
            li.innerHTML = i + "";
            li.classList.add(num_conf.class_name.name);
            li.setAttribute("at", "cell");
            if (this.index == i - 1)
                li.classList.add(num_conf.class_name.on);
            this.dom.appendChild(li);
        }
    };
    Page4.prototype.createNext = function () {
        var conf = this._config.buttons.next;
        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.hidden = !conf.show;
        conf.dom.setAttribute("at", "next");
        if (this.index >= this._config.page.pages - 1) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden)
                conf.dom.hidden = true;
        }
        this.dom.appendChild(conf.dom);
    };
    Page4.prototype.createLast = function () {
        var conf = this._config.buttons.last;
        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.setAttribute("at", "last");
        conf.dom.hidden = !conf.show;
        if (this._config.buttons.number.end == this._config.page.pages) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden)
                conf.dom.hidden = true;
        }
        this.dom.appendChild(conf.dom);
    };
    Page4.prototype.createsummary = function () {
        var conf = this._config.summary;
        conf.dom = document.createElement("span");
        conf.dom.innerHTML = conf.text(this.clone(this._config.page));
        conf.dom.classList.add(conf.class_name);
        if (!conf.show || (conf.auto_hidden && this._config.page.pages < 1)) {
            conf.dom.hidden = true;
        }
        if (conf.element == null) {
            this.dom.appendChild(conf.dom);
        }
        else {
            this.appendToElement(conf.element, conf.dom);
        }
    };
    /* ****************************公共方法********************************/
    Page4.prototype.appendToElement = function (element, dom) {
        if (element instanceof Element) {
            this.emptyDom(element);
            element.appendChild(dom);
            return true;
        }
        try {
            var node = document.querySelector(element);
            node.appendChild(dom);
            return true;
        }
        catch (e) {
            console.warn(e);
            return false;
        }
    };
    Page4.prototype.emptyDom = function (dom) {
        var child = dom.childNodes;
        for (var i = child.length - 1; i >= 0; i--) {
            this._config.option.dom.removeChild(child[i]);
        }
    };
    /**11
     * 开始设置配置
     * @param config
     * @param data
     */
    Page4.prototype.setConfig = function (config, data) {
        if (!data)
            return;
        for (var x in data) {
            if (x == "dom")
                continue; //dom为内部属性,不允许修改
            var d = data[x];
            if (this.isArray(d)) {
                config[x] = d;
                continue;
            }
            if (typeof (d) == "object") {
                if (config[x] === void 0)
                    config[x] = {};
                this.setConfig(config[x], d);
                continue;
            }
            config[x] = d;
        }
    };
    /**
     * 判断是否为数据
     * @param a
     */
    Page4.prototype.isArray = function (a) {
        return Object.prototype.toString.call(a) == '[object Array]';
    };
    /**
     * 设置属性
     * @param element
     * @param object
     */
    Page4.prototype.setAttr = function (element, obj) {
        for (var x in obj) {
            var v = obj[x];
            var notdot = x.search(/\./) == -1;
            if (this.isArray(v)) {
                if (notdot) {
                    try {
                        if (typeof (element[x]) === "function")
                            eval("element." + x + "(" + v + ")");
                        else
                            element[x] = v;
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                else {
                    try {
                        var o = eval("element." + x);
                        if (typeof (o) === "function")
                            o(v);
                        else
                            o = v;
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                continue;
            }
            if (typeof (v) === "object") {
                if (notdot) {
                    try {
                        this.setAttr(element[x], v);
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                else {
                    try {
                        var o = eval("element." + x);
                        this.setAttr(o, v);
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                continue;
            }
            if (notdot) {
                try {
                    if (typeof (element[x]) === "function")
                        eval("element." + x + "(" + v + ")");
                    else
                        element[x] = v;
                }
                catch (e) {
                    console.warn(e);
                }
            }
            else {
                try {
                    var o = eval("element." + x);
                    if (typeof (o) === 'function')
                        o(v);
                    else
                        o = v;
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    };
    Page4.prototype.clickAction = function (e) {
        if (this._config.option.stopPropagation)
            e.stopPropagation();
        var target = e.target || e.srcElement;
        var ptarget = target;
        while (ptarget != this._config.option.dom) {
            if (ptarget.parentElement == this._config.option.dom) {
                var at = ptarget.getAttribute("at");
                switch (at) {
                    case "first":
                        {
                            if (this.index == 0)
                                return;
                            this.cellAction(0, this.size);
                        }
                        break;
                    case "prev":
                        {
                            if (this.index == 0)
                                return;
                            this.cellAction(this.index - 1, this.size);
                        }
                        break;
                    case "cell":
                        {
                            var n = parseInt(ptarget.innerHTML) - 1;
                            if (n == this.index)
                                return;
                            this.cellAction(n, this.size);
                        }
                        break;
                    case "next":
                        {
                            if (this.index == this._config.page.pages - 1)
                                return;
                            this.cellAction(this.index + 1, this.size);
                        }
                        break;
                    case "last":
                        {
                            if (this.index == this._config.page.pages - 1)
                                return;
                            this.cellAction(this._config.page.pages - 1, this.size);
                        }
                        break;
                }
                break;
            }
            ptarget = ptarget.parentElement;
        }
    };
    Page4.prototype.cellAction = function (index, size) {
        var cs = this._config.condition;
        var condition = new Object();
        try {
            for (var i = 0; i < cs.length; i++) {
                var v = i == 0 ? this._config.page.total : i == 1 ? index : size;
                var csi = cs[i];
                var notdot = csi.search(/\./) == -1;
                if (notdot) {
                    condition[csi] = v;
                }
                else {
                    var arr = csi.split(".");
                    var obj_1 = condition;
                    var j = 0;
                    while (j < arr.length) {
                        if (j == arr.length - 1) {
                            obj_1[arr[j]] = v;
                            break;
                        }
                        if (obj_1[arr[j]] === void 0) {
                            var o = {};
                            obj_1[arr[j]] = o;
                            obj_1 = o;
                        }
                        else {
                            obj_1 = obj_1[arr[j]];
                        }
                        j++;
                    }
                }
            }
            var pp = this.setSetting(condition);
            if (typeof (this.change) === "function") {
                this.change(pp.index, pp.size, pp.total);
            }
            if (this._config.option.refresh)
                this.run(condition);
        }
        catch (e) {
            console.warn(e);
        }
    };
    /**
     * 克隆对象
     * @param obj
     */
    Page4.prototype.clone = function (obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            }
            else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(this.clone(obj[i]));
                    }
                }
                else {
                    o = {};
                    for (var j in obj) {
                        o[j] = this.clone(obj[j]);
                    }
                }
            }
        }
        else {
            o = obj;
        }
        return o;
    };
    return Page4;
}());
//# sourceMappingURL=Page4.js.map
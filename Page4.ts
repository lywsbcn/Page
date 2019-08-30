class Page4 {

    private _config: PageConfig = {
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
            index: 0, 	//当前page_index(同_this.index)
            size: 0,	//当前page_size(同_this.size)
            total: 0,	//数据总数
            pages: 0,	//总页数
            from: 0,		//当前页记录起始位置
            to: 0		//当前页记录结束位置
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
            text: function (page: PageParam) {
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
                max:10
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
                    href:"javascript:;"
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
                    on:"on"
                },
                attr: {
                    href: "javascript:;"
                }
            }
        }
       
    }

    set dom(element) { this._config.option.dom = element; };
    get dom() { return this._config.option.dom; };

    get index(): number { return this._config.page.index; };
    get size(): number { return this._config.page.size; };

    set hidden(b: boolean) { this.dom.style.display = b ? "none" : "block"; }

    set config(config: PageConfig) {
        this.setConfig(this._config, config);
    }


    public run(condition?) {

        this.setSetting(condition);

        this.init();

        return this;

    }
    


    private setSetting(condition?) {

        let cs = this._config.condition;
        if (cs.length < 3) return;
        let total, index, size;
        if (condition === void 0) {
            total = 0;
            index = 0;
            size = this._config.size.items[0];
        } else {
            try { total = parseInt(eval("condition." + cs[0])); } catch (e) { total = 0 };
            try { index = parseInt(eval("condition." + cs[1])); } catch (e) { index = 0 };
            try { size = parseInt(eval("condition." + cs[2])); } catch (e) { size = 0 };
        }

        var pages = size == 0 ? 0 : Math.ceil(total / size);
        var from = total == 0 ? 0 : index * size + 1;
        var to;

        if ((index + 1) * size > total) to = total;
        else to = (index + 1) * size;
        this._config.page = { index: index, size: size, total: total, pages: pages, from: from, to: to };

        this.setNumber(index, size, total, pages);

        return this._config.page;
    }

    /**
     * 计算页码的起始数字和结束数字(必须执行)
     * */
    private setNumber(index: number, size: number, total: number, pages: number) {
        var conf = this._config.buttons.number;
        var start, end;
        if (index + 1 < conf.max) {
            start = 1;
            end = conf.max;
        } else {
            start = index - Math.floor(conf.max / 2) + 1
            end = start + conf.max - 1;
        }
        end = end > pages ? pages : end;
        start = end == pages ? end - conf.max : start;
        start = start < 1 ? 1 : start;
        conf.start = start;
        conf.end = end;
    }


    private init() {
        if (this._config.option.log) console.log(this._config);

        if (this._config.option.dom) {
            let child = this._config.option.dom.childNodes;
            for (let i = child.length - 1; i >= 0; i--) {
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

    }

    public destory() {
        let conf = this._config.option;
        conf.dom.removeEventListener("click", this.handle);
        conf.dom.removeEventListener("change", this.sizehandle);
    }

    private createDom() {
        let conf = this._config.option;
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
    }

    private createSize() {
        let conf = this._config.size;

        if (conf.dom) conf.dom.removeEventListener("change", this.sizehandle);

        conf.dom = document.createElement("select");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.classList.add(conf.class_name);
        conf.dom.hidden = !conf.show;

        for (var x in conf.items) {
            let opt = document.createElement("option");
            if (conf.items[x] == this._config.page.size) opt.selected = true;
            opt.value = conf.items[x] + "";
            opt.innerHTML = conf.items[x] + "";
            conf.dom.appendChild(opt)
        }


        if (conf.element != null) {
            this.appendToElement(conf.element, conf.dom);
        } else {
            this.dom.appendChild(conf.dom);
        }
        conf.dom.addEventListener("change", this.sizehandle);
        
    }

    private createFirst() {
        let conf = this._config.buttons.first;

        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.hidden = !conf.show;
        conf.dom.setAttribute("at", "first");

        this.dom.appendChild(conf.dom);
        if (this._config.buttons.number.start == 1) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden) conf.dom.hidden = true;
        }


    }


    private createPrev() {
        let conf = this._config.buttons.prev;

        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.hidden = !conf.show;
        conf.dom.setAttribute("at", "prev");

        if (this.index == 0) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden) conf.dom.hidden = true;
        }

        this.dom.appendChild(conf.dom);

    }
    private createButtons() {
        let conf = this._config.buttons.number;
        let num_conf = this._config.buttons.num;

        for (let i = conf.start; i <= conf.end; i++) {
            let li = document.createElement("a");
            this.setAttr(li, num_conf.attr);
            li.innerHTML = i + "";
            li.classList.add(num_conf.class_name.name);
            li.setAttribute("at", "cell");
            if (this.index == i - 1) li.classList.add(num_conf.class_name.on);
            this.dom.appendChild(li);
        }

    }
    private createNext() {
        let conf = this._config.buttons.next;

        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.hidden = !conf.show;
        conf.dom.setAttribute("at", "next");
        if (this.index >= this._config.page.pages - 1) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden) conf.dom.hidden = true;
        }
        this.dom.appendChild(conf.dom);
    }
    private createLast() {
        let conf = this._config.buttons.last;

        conf.dom = document.createElement("a");
        this.setAttr(conf.dom, conf.attr);
        conf.dom.innerHTML = conf.text;
        conf.dom.classList.add(conf.class_name.name);
        conf.dom.setAttribute("at", "last");
        conf.dom.hidden = !conf.show;


        if (this._config.buttons.number.end == this._config.page.pages) {
            conf.dom.classList.add(conf.class_name.off);
            if (conf.auto_hidden) conf.dom.hidden = true;
        }

        this.dom.appendChild(conf.dom);
    }
    private createsummary() {
        let conf = this._config.summary;
        conf.dom = document.createElement("span");
        conf.dom.innerHTML = conf.text(this.clone( this._config.page ));
        conf.dom.classList.add(conf.class_name);
        if (!conf.show || (conf.auto_hidden && this._config.page.pages < 1)) {
            conf.dom.hidden = true
        }

        if (conf.element == null) {
            this.dom.appendChild(conf.dom);
        } else {
            this.appendToElement(conf.element, conf.dom);
        }
    }

    /* ****************************公共方法********************************/

    private appendToElement(element, dom) {
        if (element instanceof Element) {
            this.emptyDom(element);
            element.appendChild(dom);
            return true;
        }

        try {
            let node = document.querySelector(element);
            node.appendChild(dom);
            return true;
        } catch (e) {
            console.warn(e);
            return false;
        }
    }

    private emptyDom(dom) {
        let child = dom.childNodes;
        for (let i = child.length - 1; i >= 0; i--) {
            this._config.option.dom.removeChild(child[i]);
        }
    }



    
    /**11
     * 开始设置配置
     * @param config
     * @param data
     */
    private setConfig(config, data?) {
        if (!data) return;
        for (var x in data) {
            if (x == "dom") continue;	//dom为内部属性,不允许修改
            var d = data[x];
            if (this.isArray(d))  {
                config[x] = d;
                continue;
            }
            if (typeof (d) == "object") {
                if (config[x] === void 0) config[x] = {};
                this.setConfig(config[x], d);
                continue;
            }
            config[x] = d;
        }
    }


    /**
     * 判断是否为数据
     * @param a
     */
    private isArray(a): boolean {
        return Object.prototype.toString.call(a) == '[object Array]';
    }

    /**
     * 设置属性
     * @param element
     * @param object
     */
    private setAttr(element: Element, obj: object) {

        for (var x in obj) {
            let v = obj[x];
            let notdot = x.search(/\./) == -1;

            if (this.isArray(v)) {
                if (notdot) {
                    try {
                        if (typeof (element[x]) === "function") eval("element." + x + "(" + v + ")");
                        else element[x] = v;
                    } catch (e) {
                        console.warn(e);
                    }

                } else {
                    try {
                        let o = eval("element." + x);
                        if (typeof (o) === "function") o(v);
                        else o = v;
                    } catch (e) {
                        console.warn(e);
                    }
                }

                continue;
            }

            if (typeof (v) === "object") {

                if (notdot) {
                    try {
                        this.setAttr(element[x], v);
                    } catch (e) {
                        console.warn(e);
                    }
                }
                else {
                    try {
                        let o = eval("element." + x);
                        this.setAttr(o, v);
                    } catch (e) {
                        console.warn(e);
                    }
                }

                continue;
            }

            if (notdot) {
                try {
                    if (typeof (element[x]) === "function") eval("element." + x + "(" + v + ")");
                    else element[x] = v;
                } catch (e) {
                    console.warn(e);
                }

            } else {
                try {
                    let o = eval("element." + x);
                    if (typeof (o) === 'function') o(v);
                    else o = v;
                } catch (e) {
                    console.warn(e);
                }
            }


        }

    }


    /* ****************************事件********************************/

    public change: (page_index, page_size, num_total) => void;
    private handle = (e) => { this.clickAction(e) };
    private sizehandle = (e) => { this.cellAction(0, parseInt(this._config.size.dom.value)); };

    private clickAction(e) {
        if (this._config.option.stopPropagation)
            e.stopPropagation();

        let target = e.target || e.srcElement;
        let ptarget: Element = target;

        while (ptarget != this._config.option.dom) {

            if (ptarget.parentElement == this._config.option.dom) {

                let at = ptarget.getAttribute("at");
                switch (at) {
                    case "first": {
                        if (this.index == 0) return;
                        this.cellAction(0, this.size);                        
                    }break;
                    case "prev": {
                        if (this.index == 0) return;
                        this.cellAction(this.index - 1, this.size);
                    } break;
                    case "cell": {
                        let n = parseInt(ptarget.innerHTML) - 1;
                        if (n == this.index) return;
                        this.cellAction(n, this.size);
                    } break;
                    case "next": {
                        if (this.index == this._config.page.pages - 1) return;
                        this.cellAction(this.index + 1, this.size);
                    } break;
                    case "last": {
                        if (this.index == this._config.page.pages - 1) return;
                        this.cellAction(this._config.page.pages - 1, this.size);
                    } break;                   
                }

                break;
            }

            ptarget = ptarget.parentElement;
        }

    }

    private cellAction(index: number, size: number) {
        let cs = this._config.condition;
        let condition = new Object();
        try {

            for (let i = 0; i < cs.length; i++) {
                let v = i == 0 ? this._config.page.total : i == 1 ? index : size;

                let csi = cs[i];
                let notdot = csi.search(/\./) == -1;
                if (notdot) {
                    condition[csi] = v;
                } else {
                    let arr = csi.split(".");
                    let obj = condition;
                    let j = 0;
                    while (j < arr.length) {
                        if (j == arr.length - 1) {
                            obj[arr[j]] = v;
                            break;
                        }
                        if (obj[arr[j]] === void 0) {
                            let o = {};
                            obj[arr[j]] = o;
                            obj = o;
                        } else {
                            obj = obj[arr[j]];
                        }
                        j++
                    }
                }
            }
            
            let pp = this.setSetting(condition);
            if (typeof (this.change) === "function") {
                this.change(pp.index, pp.size, pp.total);
                
            }
            if (this._config.option.refresh)
                    this.run(condition);

        } catch (e) {
            console.warn(e);
        }
    }

    /**
     * 克隆对象
     * @param obj
     */
    public clone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(this.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = this.clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }

}
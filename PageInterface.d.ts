/**page 所有可配置 配置 */
interface PageConfig {


    /**整个对象的配置*/
    option?: PageConfigOption;

    page?: PageParam;

    /**this.run()参数对象必须的属性名 */
    condition?: Array<string>;

    /** 下拉框配置*/
    size?: PageConfigSize;

    /**分页详情配置*/
    summary?: PageConfigSummary;

    /**各个按钮的配置 */
    buttons?: PageConfigButtons;
}

/**记录分页当前状态的值*/
interface PageParam {

    /**当前page_index(同_this.index) */
    index: number,

    /**当前page_size(同_this.size) */
    size: number,

    /**数据总数 */
    total: number,

    /**总页数 */
    pages: number,

    /**当前页记录起始位置 */
    from: number,

    /**当前页记录结束位置 */
    to: number
}

 /**整个对象的配置*/
interface PageConfigOption {

    dom?: HTMLUListElement;

    /**是否显示分页 */
    show?: boolean;

    /**当总数量小于设置的page_size时,是否自动隐藏 */
    auto_hidden?: boolean;

    /**分页操作后,是否自动刷新 */
    refresh?: boolean;

    /**分页的样式 class */
    class_name?: string;

    /**是否打印配置信息 */
    log?: boolean;

    /**暂时无用 */
    stopPropagation?: boolean;
}

/** 下拉框配置*/
interface PageConfigSize {

    dom?: HTMLSelectElement;

    /**是否显示 */
    show?: boolean;

    /**下拉框的数量和值 */
    items?: Array<number>;

    /**下拉框的样式 */
    class_name?: string;

    /**下拉框被添加的位置(如果=="",下拉框是添加到_this.dom对象中)(必须是有效的选择器,否则报错) */
    element?: Element | string;

    attr?: any;
}

/**分页详情配置 */
interface PageConfigSummary {

    dom?: HTMLSpanElement;

    /**是否显示 */
    show?: boolean;

    /**当pages <=1 时将不显示 */
    auto_hidden?: boolean;

    /**样式 */
    class_name?: string;

    /**summary 被添加的位置
     * 如果=="",下拉框是添加到_this.dom对象中
     * 必须是有效的选择器,否则报错
     * */
    element?: any;

    /**分页详情的文本,一个回掉函数(参数值为.page)*/
    text?: (page?: PageParam) => string;
}

/**各个按钮的配置 */
interface PageConfigButtons {

    /**页码显示的文本,个数控制 */
    number?: PageConfigButtonsNumber;

    /**上一页
     * auto_hidden (如果为true,this.index==0时自动隐藏)
     * */
    prev?: PageConfigButtonsButton;

    /**下一页
     * auto_hidden (如果值为true,this.index=最后一页时自动隐藏)
     * */
    next?: PageConfigButtonsButton;

    /**第一页
     * auto_hidden 如果值为true, .number.start等于1时,自动隐藏
     * */
    first?: PageConfigButtonsButton;

    /**最后页
     * auto_hidden 如果值为true, .number.end等于最后一页时,自动隐藏
     * */
    last?: PageConfigButtonsButton;

    /**页码 */
    num?: PageConfigButtonsButton;
}

/**页码显示的文本,个数控制 */
interface PageConfigButtonsNumber {

    /**页码起始数字
     * 默认 1
     */
    start?: number;

    /**页码结束数字(只读属性,配置无效) */
    end?: number;

    /**每次显示页码的个数
     * 默认 10
     * */
    max?: number;
}

/**按钮相关配置 */
interface PageConfigButtonsButton {

    dom?: HTMLAnchorElement;

    /**文字 */
    text?: string;

    /**是否显示 */
    show?: boolean;

    /**是否自动隐藏 */
    auto_hidden?: boolean;

    /**样式 */
    class_name?: PageConfigClassName;

    attr?: any;
    
}

interface PageConfigClassName {

    /**样式名称 */
    name?: string;

    /**被选中时添加的样式 */
    on?: string;

    /**不可点击时的样式 */
    off?: string;
}


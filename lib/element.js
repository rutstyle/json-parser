/**
 * 节点元素
 */
function Element() {
    /**
     * 节点类型
     */
    this.type = "";

    /**
     * 索引开始位置
     */
    this.begin = 0;

    /**
     * 索引结束位置
     */
    this.end = 0;

    /**
     * 键名
     */
    this.key = "";

    /**
     * 子节点数组
     */
    this.children = [];
};

module.exports = Element;
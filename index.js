/**
 * json-parser
 * Copyright(c) 2019 rutstyle@163.com
 * MIT Licensed
 * 
 * 实现JSON.parse()功能
 * 规则：能够解析数值、null、字符串，不能解析对象、函数、undefined、数组
 */

const Element = require('./lib/element');

/**
 * JSON解析器
 */
function JsonParser() {
}

/**
 * 解析值
 * @param {*} value 
 */
function parseValue(value) {
    let stringSearch = /^\s*\"(.*)\"\s*$/g.exec(value); // 尝试按字符串解析value
    let numberSearch = /^\s*(\d+(\.\d+)?)\s*$/g.exec(value); // 尝试按数值解析value
    let nullSearch = /^\s*(null)\s*$/g.exec(value); // 尝试按null解析value
    if (stringSearch) {
        value = stringSearch[1];
    }
    else if (numberSearch) {
        value = Number(numberSearch[1]);
    }
    else if (nullSearch) {
        value = null;
    }
    return value;
}

/**
 * 解析数值
 * @param {string} fields 
 * @param {Array} result 
 */
function parseArray(fields, result) {
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        result.push(parseValue(field));
    }
}

/**
 * 解析键值对
 * @param {string} fields 
 * @param {Array} result 
 */
function parseKeyValuePairs(fields, result) {
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        let keySearch = /\s*\"(.*)\"\s*:(.*)/g.exec(field);
        if (keySearch) {
            let key = keySearch[1];
            let value = keySearch[2];
            result[key] = parseValue(value);
        }
    }
}

/**
 * 解析层
 * @param {string} json 
 * @param {object} element 
 */
function parseLevel(json, element) {
    let result;
    if (element.type === '[') { // 将element解析成数组
        result = [];
        let searchIndex = element.begin; // 初始化搜索开始index
        let len = element.children.length; // 获取子元素个数
        if (len === 0) { // 解析叶子节点
            let content = json.substring(element.begin + 1, element.end);
            let fields = content.split(',');
            parseArray(fields, result);
        }
        else {
            for (let i = 0; i < len; i++) {
                const child = element.children[i];
                // 获取key所在的字符串，从child.begin往前搜索
                let content = json.substring(searchIndex + 1, child.begin);
                if (!/^[^,]*,[^,]*$/g.test(content)) {
                    let fields = content.split(',');
                    fields.pop(); // 弹出分隔符
                    parseArray(fields, result);
                }
                result.push(parseLevel(json, child));
                // 更新搜索位置到元素末尾
                searchIndex = child.end;
            }
        }
    }
    else if (element.type === '{') { // 将element解析成对象
        result = {};
        // 遍历children, 依次解析对象
        let searchIndex = element.begin; // 初始化搜索开始index
        let len = element.children.length; // 获取子元素个数
        if (len === 0) { // 解析叶子节点
            let content = json.substring(element.begin + 1, element.end);
            let fields = content.split(',');
            parseKeyValuePairs(fields, result);
        }
        else {
            for (let i = 0; i < len; i++) {
                const child = element.children[i];
                // 获取key所在的字符串，从child.begin往前搜索
                let content = json.substring(searchIndex + 1, child.begin);
                let fields = content.split(',');
                parseKeyValuePairs(fields, result);
                let keyWrap = fields.pop();
                let keySearch = /^\s*\"(.*)\"\s*:\s*$/g.exec(keyWrap);
                if (keySearch) {
                    let key = keySearch[1]; // 取正则匹配分组为key
                    // 为解析结果对象新增属性key
                    result[key] = parseLevel(json, child);
                }
                // 更新搜索位置到元素末尾
                searchIndex = child.end;
            }
        }
    }

    // 返回解析结果对象
    return result;
}

JsonParser.prototype.parse = function (json) {
    // 数值类型原样输出
    if (typeof (json) === 'number' || json === null) {
        return json;
    }

    // 判断是否传入对象、函数、undefined、数组
    if (typeof (json) === "object" || json instanceof Object || json === undefined) {
        throw new SyntaxError('Unexpected input');
    }

    json = json.trim(); // 移除前后空格
    let elementStack = [];
    let segmentStack = [];

    for (let i = 0, len = json.length; i < len; i++) {
        const char = json[i];
        if ('{['.indexOf(char) >= 0) {
            let element = new Element();
            element.type = char;
            element.begin = i;
            if (elementStack.length > 0) {
                let parentElement = elementStack[elementStack.length - 1];
                parentElement.children.push(element);
            }
            elementStack.push(element);
        }
        if (']'.indexOf(char) >= 0) {
            let element = elementStack.pop();
            if (element.type === '[') {
                element.end = i;
                segmentStack.push(element);
            }
            else {
                throw new SyntaxError('Unexpected input');
            }
        }
        if ('}'.indexOf(char) >= 0) {
            let element = elementStack.pop();
            if (element.type === '{') {
                element.end = i;
                segmentStack.push(element);
            }
            else {
                throw new SyntaxError('Unexpected input');
            }
        }
    }

    // 拆分结果判断
    if (elementStack.length > 0 || segmentStack.length === 0) {
        throw new SyntaxError('Unexpected input');
    }
    let rootElement = segmentStack[segmentStack.length - 1];
    if (rootElement.begin !== 0 || rootElement.end !== json.length - 1) {
        throw new SyntaxError('Unexpected input');
    }

    // 从根节点开始解析
    let result = parseLevel(json, rootElement);
    // 返回结果 
    return result;
}

exports = module.exports = new JsonParser();
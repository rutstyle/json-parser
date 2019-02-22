import * as JsonParser from "../index.js"

describe('测试参数类型', function () {

    it('测试输入数值原样返回', () => {
        let result = JsonParser.parse(5);
        expect(result).toBe(5);
    });

    it('测试输入null不抛出异常', () => {
        var foo = function () {
            JsonParser.parse(null);
        };
        expect(foo).not.toThrow();
    });

    it('测试输入对象抛出异常', () => {
        var foo = function () {
            JsonParser.parse(Object.create(null));
        };
        expect(foo).toThrow();
    });

    it('测试输入函数抛出异常', () => {
        var foo = function () {
            JsonParser.parse(new Function());
        };
        expect(foo).toThrow();
    });

    it('测试输入undefined抛出异常', () => {
        var foo = function () {
            JsonParser.parse(undefined);
        };
        expect(foo).toThrow();
    });

    it('测试输入undefined抛出异常', () => {
        var foo = function () {
            JsonParser.parse([]);
        };
        expect(foo).toThrow();
    });
});

describe('测试解析字符串', function () {

    it('测试解析字符串符合不匹配报错', () => {
        var foo = function () {
            JsonParser.parse('{"name":"zhang"]');
        };
        expect(foo).toThrow();
    });

    it('测试正确解析字符串-对象-含有一个属性', () => {
        let json = '{"name": "zhang"}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-对象-含有嵌套一个属性', () => {
        let json = '{"name":{"en": "zhang"}}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-对象-含有两个个属性', () => {
        let json = '{"name": "zhang", "age": "13"}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-对象-含有两个个属性(包含数字)', () => {
        let json = '{"name": "zhang", "age": 13}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-对象-嵌套属性', () => {
        let json = '{"name": "zhang", "child": {"name": "xiao zhang"}}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-数组', () => {
        let json = '[1, 3, 5]';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-对象-嵌套属性', () => {
        let json = '{"name": "zhang", "child": {"name": "xiao zhang", "score": [1, 3, 5]}}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

    it('测试正确解析字符串-综合', () => {
        let json = '{"employees":[{"firstName":"Bill","lastName":"Gates"},{"firstName":"George","lastName":"Bush"},{"firstName":"Thomas","lastName":"Carter"},{"firstName":"Thomas","lastName":{"name":"Carter"},"score":[1,2,3,null,{"name":"Carter"}]}]}';
        let result = JsonParser.parse(json);
        expect(JSON.stringify(result)).toBe(JSON.stringify(JSON.parse(json)));
    });

});
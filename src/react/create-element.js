import Component from './component.js'

/**
 * React.createElement()
 * transform-react-jsx 是 jsx 转换成 js 的babel 插件
 * 他有一个 pramgma 项，来定义转换 jsx 的方法名称
 * 这里我定义这个函数为 createElement
 */
function createElement(tag, attrs = {}, ...children) {
    return {
        tag,
        attrs,
        children,
        // key: attrs.key || null
    }
};

export default createElement;
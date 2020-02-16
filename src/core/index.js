/**
 * from:https://github.com/hujiulong/simple-react/blob/chapter-1/src/index.js
 */
import { render, renderComponent } from './render';

const React = {
    createElement,
    render: (vnode, container) => {
        // 为了每次执行时清空
        container.innerHTML = '';
        return render(vnode, container);
    }
};

/**
 * React.createElement()
 * transform-react-jsx 是 jsx 转换成 js 的babel 插件
 * 他有一个 pramgma 项，来定义转换 jsx 的方法名称
 * 这里我定义这个函数为 createElement
 */
function createElement(tag, attrs, ...children) {
    return {
        tag,
        attrs,
        children
    }
};

/**
 * React.Component
 * 组件的 Component 类
 */
export class ReactComponent {
    constructor(props = {}) {
        // 初始化 state 和 props
        this.state = {};
        this.props = props;
    }
    // setState 触发视图渲染
    setState(newData) {
        Object.assign(this.state, newData)
        renderComponent(this);
    }
}

export default React
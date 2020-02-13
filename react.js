/**
 * from:https://github.com/hujiulong/simple-react/blob/chapter-1/src/index.js
 */
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
 * React.render()
 * render方法的作用是将虚拟DOM渲染成真实的DOM
 */
function render(vnode, container) {
    return container.appendChild(_render(vnode));
}
function _render(vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
    if (typeof vnode === 'number' || vnode instanceof Date) vnode = String(vnode);
    // 如果是纯文本
    if (typeof vnode === 'string') {
        let textNode = document.createTextNode(vnode);
        return textNode;
    }
    // 如果 vnode 是组件时的处理,组件的tag是一个构造函数
    if (typeof vnode.tag === 'function') {
        const component = createComponent(vnode.tag, vnode.attrs);
        setComponentProps(component, vnode.attrs);
        return component.base;
    }
    const dom = document.createElement(vnode.tag);
    // 挂载属性
    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach(key => {
            const value = vnode.attrs[key];
            setAttribute(dom, key, value);
        });
    }
    // 递归子元素
    vnode.children && vnode.children.forEach(child => render(child, dom));    // 递归渲染子节点
    return dom;
}

/**
 * 给dom渲染属性
 */
function setAttribute(dom, name, value) {
    // className => class
    if (name === 'className') name = 'class'

    // 事件 onXXX
    if (/on\w+/.test(name)) {
        name = name.toLowerCase();
        dom[name] = value || '';
    }
    // style 
    else if (name === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            for (let name in value) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
            }
        }
    }
    // 其他
    else {
        if (name in dom) {
            dom[name] = value || '';
        }

        if (value) {
            dom.setAttribute(name, value);
        } else {
            dom.removeAttribute(name);
        }
    }
}

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

function createComponent(component, props) {
    let inst;
    // 如果是类定义组件，则直接返回实例,否则 new 一个组件实例
    if (component.prototype && component.prototype.render) {
        inst = new component(props);
        // 如果是函数定义组件，则将其扩展为类定义组件
    } else {
        inst = new ReactComponent(props);
        inst.constructor = component;
        inst.render = function () {
            return this.constructor(props);
        }
    }
    return inst;
}

/**
 * 用来更新 props
 * 生命周期：componentWillMount、componentWillReceiveProps
 */
function setComponentProps(component, props) {
    if (!component.base) {
        if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props);
    }
    // component.props = props;
    renderComponent(component);
}

/**
 * 渲染组件
 * 先 render() 拿到vnode 再 _render() 拿到 dom
 * 生命周期：componentWillUpdate，componentDidUpdate，componentDidMount
 */
function renderComponent(component) {
    let base;
    const renderer = component.render(); // 拿到 vnode
    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate();
    }
    base = _render(renderer); // 拿到 dom 对象
    if (component.base) {
        if (component.componentDidUpdate) component.componentDidUpdate();
    } else if (component.componentDidMount) {
        component.componentDidMount();
    }
    if (component.base && component.base.parentNode) {
        component.base.parentNode.replaceChild(base, component.base);
    }
    component.base = base;// 保存组件的 dom 对象
    base._component = component;// dom 对象对应的组件
}

export default React
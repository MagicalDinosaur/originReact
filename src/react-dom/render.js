
import { diff } from './diff'

/**
 * 
 * vNode有三种结构：
 * 1.原生DOM节点的vnode
 * {
 *     tag: 'div',
 *     attrs: {
 *         className: 'container'
 *     },
 *     children: []
 * }
 * 
 * 2.文本节点的vnode
 * "hello,world"
 * 
 * 3.组件的vnode
 * {
 *     tag: ComponentConstrucotr,
 *     attrs: {
 *         className: 'container'
 *     },
 *     children: []
 * }
 */
function _render(vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
    if (typeof vnode === 'number' || vnode instanceof Date) vnode = String(vnode);
    // 如果是纯文本
    if (typeof vnode === 'string') {
        let textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
    }
    // 如果 vnode 是组件时的处理,组件的tag是一个构造函数
    if (typeof vnode.tag === 'function') {
        // const component = createComponent(vnode.tag, vnode.attrs);
        // setComponentProps(component, vnode.attrs);
        // return component.base;
        const component = vnode;
        if (component._container) {
            if (component.componentWillUpdate) {
                component.componentWillUpdate();
            }
        } else if (component.componentWillMount) {
            component.componentWillMount();
        }
        component._container = container;   // 保存父容器信息，用于更新
        vnode = component.render();
    }
    const dom = document.createElement(vnode.tag);
    // 挂载属性
    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach(key => {
            const value = vnode.attrs[key];
            if (key === 'className') key = 'class';
            // 如果是事件监听函数，则直接附加到dom上
            if (typeof value === 'function') {
                dom[key.toLowerCase()] = value;
            } else {
                dom.setAttribute(key, vnode.attrs[key]);
            }
        });
    }
    // 递归子元素
    vnode.children && vnode.children.forEach(child => _render(child, dom));    // 递归渲染子节点
    return container.appendChild(dom);
}

/**
 * React.render()
 * render方法的作用是将虚拟DOM渲染成真实的DOM
 */
function render(vnode, container, dom) {
    console.log(container, vnode, container);
    return diff(dom, vnode, container);
}

export default render
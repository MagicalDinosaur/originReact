// import { setAttribute, setComponentProps, createComponent } from '../render'
import { setAttribute } from './dom'

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode);
    if (container && ret.parentNode !== container) {
        container.appendChild(ret);
    }
    return ret;
}

/**
 * 
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 * @returns {HTMLElement} 更新后的DOM
 */
export function diffNode(dom, vnode) {
    let newDom = dom;
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
    if (typeof vnode === 'number') vnode = String(vnode);

    // vnode 是文本的情况
    if (typeof vnode === 'string') {
        // 如果 dom 也是文本
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                dom.textContent = vnode;
            }
        }
        // 如果 dom 不是文本，说明前后不一致，直接进行替换
        else {
            newDom = document.createTextNode(vnode);
            if (dom && dom.parentNode) {
                dom.parentNode.replaceChild(parentNode);
            }
        }
        return newDom;
    }

    // vnode 是组件的情况
    if (typeof vnode.tag === 'function') {
        return diffComponent(dom, vnode);
    }

    // 如果原来的 dom 不存在 或者两者标签节点类型不一样时
    if (!dom || !isSameNodeType(dom, vnode)) {
        newDom = document.createElement(vnode.tag);
        if (dom) {
            [...dom.childNodes].map(newDom.appendChild);    // 将原来的子节点移到新节点下

            if (dom.parentNode) {
                dom.parentNode.replaceChild(newDom, dom);    // 移除掉原来的DOM对象
            }
        }
    }

    // 进行 child 的对比
    if (vnode.children && vnode.children.length > 0 || (newDom.childNodes && newDom.childNodes.length > 0)) {
        diffChildren(newDom, vnode.children);
    }

    // 进行属性的对比
    diffAttributes(newDom, vnode);

    return newDom;
}

/**
 * 
 * @param {HTMLElement} dom 真实DOM
 * @param {Array} vchildren 虚拟 dom 的 children
 */
function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    const children = [];// 存放没有key标记的 old child
    const keyed = {}; // 进行标记 key: child 

    // 将有key的节点和没有key的节点分开
    if (domChildren.length > 0) {
        for (let i = 0; i < domChildren.length; i++) {
            const child = domChildren[i];
            const key = child.key;
            if (key) {
                keyed[key] = child;
            } else {
                children.push(child);
            }
        }
    }

    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length;
        for (let i = 0; i < vchildren.length; i++) {
            const vchild = vchildren[i];
            const key = vchild.key;
            let child; // 输出的child

            // 如果当前child有key去匹配
            if (key) {
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            }
            // 如果没有key标记，则优先找类型相同的节点
            else if (min < childrenLen) {
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c && isSameNodeType(c, vchild)) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            // 对比DOM
            child = diff(child, vchild);

            // 更新DOM
            const f = domChildren[i];
            if (child && child !== dom && child !== f) {
                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child);
                }
                // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
                else if (child === f.nextSibling) {
                    removeNode(f);
                }
                // 将更新后的节点移动到正确的位置
                else {
                    // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    dom.insertBefore(child, f);
                }
            }

        }
    }

}

/**
 * 组件对比
 * @param {HTMLElement} dom 真实DOM
 * @param {Array} vchildren 虚拟 dom 的 children
 */
function diffComponent(dom, vnode) {
    let c = dom && dom._component;
    let oldDom = dom;
    // 如果组件类型没有变化，则重新set props
    if (c && c.constructor === vnode.tag) {
        setComponentProps(c, vnode.attrs);
        dom = c.base;
    }
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    else {
        if (c) {
            unmountComponent(c);
            oldDom = null;
        }
        c = createComponent(vnode.tag, vnode.attrs);
        setComponentProps(c, vnode.attrs);
        dom = c.base;
        if (oldDom && dom !== oldDom) {
            oldDom._component = null;
            removeNode(oldDom);
        }
    }
    return dom
}

/**
 * 对节点进行属性进行diff判断
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 */
function diffAttributes(dom, vnode) {
    let oldAttrs = {};
    const newAttrs = vnode.attrs;

    for (let i = 0; i < dom.attributes.length; i++) {
        const attr = dom.attributes[i];
        oldAttrs[attr.name] = attr.value;
    }

    for (let name in oldAttrs) {
        // 如果原来的属性不在新的里面了，则将属性值设置为 undefined，将其移除掉
        if (!(name in newAttrs)) {
            setAttribute(dom, name, undefined);
        }
    }

    // 更新 dom 的所有值变化的属性
    for (let name in newAttrs) {
        if (oldAttrs[name] !== newAttrs[name]) {
            setAttribute(dom, name, newAttrs[name]);
        }
    }
}

/**
 * 用来更新 props
 * 生命周期：componentWillMount、componentWillReceiveProps
 */
export function setComponentProps(component, props) {
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
 * setState的时候会调用
 * 先 render() 拿到vnode 再 _render() 拿到 dom
 * 生命周期：componentWillUpdate，componentDidUpdate，componentDidMount
 */
export function renderComponent(component) {

    let base;

    const renderer = component.render(); // 拿到 vnode

    if (component.base && component.componentWillUpdate) {
        component.componentWillUpdate();
    }

    base = diff(component.base, renderer);

    // component.base = base;
    // base._component = component;

    if (component.base) {
        if (component.componentDidUpdate) component.componentDidUpdate();
    } else if (component.componentDidMount) {
        component.base = base;
        component.componentDidMount();
    }

    component.base = base;// 保存组件的 dom 对象
    base._component = component;// dom 对象对应的组件
}

/**
 * 实例化组件
 */
export function createComponent(component, props) {
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
 * NodeType 对比
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 */
function isSameNodeType(dom, vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return dom.nodeType === 3;
    }
    if (typeof vnode.tag === 'string') {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    }
    return dom && dom._component && dom._component.constructor === vnode.tag;
}

function unmountComponent(component) {
    if (component.componentWillUnmount) component.componentWillUnmount();
    removeNode(component.base);
}

function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
    }
}

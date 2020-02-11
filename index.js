/**
 * from:https://github.com/hujiulong/simple-react/blob/chapter-1/src/index.js
 */

const React = {
    h,
    render: (vnode, container) => {
        // 为了每次执行时清空
        container.innerHTML = '';
        return render(vnode, container);
    }
};

/**
 * transform-react-jsx 是 jsx 转换成 js 的babel 插件
 * 他有一个 pramgma 项，来定义转换 jsx 的方法名称
 * 这里我定义这个函数为 h
 */
function h(tag, attrs, ...children) {
    return {
        tag,
        attrs,
        children
    }
};

/**
 * render方法的作用是将虚拟DOM渲染成真实的DOM
 */
function render(vnode, container) {
    // 当vnode为字符串时，渲染结果是一段文本
    if (typeof vnode === 'string' || vnode instanceof Date) {
        const textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
    }
    // 创建标签
    const dom = document.createElement(vnode.tag);
    // 属性渲染
    if (vnode.attrs) {
        for (const [name, value] of Object.entries(vnode.attrs)) {
            setAttribute(dom, name, value)
        }
    }
    // 递归子元素
    vnode.children && vnode.children.forEach(child => render(child, dom));
    // 挂载
    return container.appendChild(dom);
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

function trick() {
    const element = (
        <div>
            <h1 className="title" data-item="1">Hello World!</h1>
            <h6 style="color:red;">{new Date()}</h6>
        </div>
    )
    React.render(element, document.getElementById('root'))
}

setInterval(trick, 1000);


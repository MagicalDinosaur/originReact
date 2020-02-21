/**
 * 给dom渲染属性
 */
export function setAttribute(dom, name, value) {
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
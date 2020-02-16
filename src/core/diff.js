/**
 * 
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 * @returns {HTMLElement} 更新后的DOM
 */


function diff(dom, vnode) {

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
    }
    // 如果原来的 dom 不存在 或者标签的类型不一样时
    else if (!dom || dom.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
        newDom = document.createElement(vnode.tag);
    }
}
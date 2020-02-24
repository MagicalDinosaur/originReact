import { renderComponent } from '../react-dom/diff'

const setStateQueue = []; // 队列来保存setSate数据
const renderQueue = [];


export function enqueueSetState(stateChange, component) {

    // 如果setStateQueue的长度是0，也就是在上次flush执行之后第一次往队列里添加
    if (setStateQueue.length === 0) {
        defer(flush);
    }

    // 将 stateChange push 到 setState 队列
    setStateQueue.push({
        stateChange,
        component
    });

    // 如果render队列当前没有此component push 进去
    if (!renderQueue.some(item => item === component)) {
        renderQueue.push(component);
    }
}

function flush() {
    // 遍历 setState操作
    while (setStateQueue.length) {
        const { stateChange, component } = setStateQueue.shift();
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        }
        // 如果stateChange是一个方法
        // 例如：this.setState((state, props) => ({ counter: state.counter + props.increment }));
        if (typeof stateChange === 'function') {
            Object.assign(component.state, stateChange(component.prevState, component.props));
        } else {
            // 如果stateChange是一个对象，则直接合并到setState中
            Object.assign(component.state, stateChange);
        }
        component.prevState = component.state;
    }
    //setState合并以后，进行渲染
    while (renderQueue.length) {
        const component = renderQueue.shift();
        renderComponent(component);
    }
}

// 让 flush 在所有同步代码结束后执行
function defer(fn) {
    return Promise.resolve().then(fn);
}
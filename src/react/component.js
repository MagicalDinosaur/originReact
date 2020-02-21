import { renderComponent } from '../react-dom/diff'
/**
 * React.Component
 * 组件的 Component 类
 */
export class Component {
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

export default Component;
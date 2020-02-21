// import { renderComponent } from '../react-dom/diff'
import { enqueueSetState } from './set-state-queue'
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
    // 合并多次请求
    setState(newData) {
        enqueueSetState(newData, this);
    }
}

export default Component;
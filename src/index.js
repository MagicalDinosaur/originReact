import React from './react'
import ReactDOM from './react-dom'
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            num: 0
        }
    }
    componentDidMount() {
        console.log('666')

        for (let i = 0; i < 3; i++) {
            this.setState({ num: this.state.num + 1 });
            // 下面这种形式可以避免异步更新
            // this.setState((state, props) => ({ num: state.num + 1 }));
        }
    }
    render() {
        return (
            <div className="App">
                <h1>{this.state.num}</h1>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

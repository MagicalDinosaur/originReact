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
        for (let i = 0; i < 10; i++) {
            this.setState({ num: this.state.num + 1 });
            console.log(this.state.num);    // 会输出什么？
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

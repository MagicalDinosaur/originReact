import React, { ReactComponent } from './core'

class Welcome extends ReactComponent {
    render() {
        return <h4>Hello, {this.props.name}</h4>;
    }
}

function trick() {
    const element = (
        <div>
            <Welcome name="666"></Welcome>
            <h1 className="title" data-item="1">Hello World!</h1>
            <h6 style="color:red;">{new Date()}</h6>
        </div>
    )
    React.render(element, document.getElementById('root'))
}

setInterval(trick, 1000);
// trick()


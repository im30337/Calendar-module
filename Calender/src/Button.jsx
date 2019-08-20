import React from 'react'

export default class Button extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div style={{ display: 'flex' }}>
                <button onClick={this.props.callback} className="switch-button">
                    切換{this.props.mode}顯示
                </button>
            </div>
        )
    }
}

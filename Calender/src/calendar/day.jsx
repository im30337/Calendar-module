import React from 'react'

export default class Day extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.getDaysData = this.getDaysData.bind(this)
    }

    componentDidMount() {}

    getDaysData(date) {
        if (this.props.data.length > 0) {
            let activities = [],
                acvitity
            this.props.data.forEach(e => {
                if (e.date == date) {
                    acvitity = e
                    activities.push(e)
                }
            })
            activities.forEach(e => {
                acvitity = acvitity.price < e.price ? acvitity : e
            })
            return acvitity
        }
    }

    onClick() {
        console.log(this.props.date)
    }

    render() {
        let data = this.getDaysData(this.props.date)
        let day = this.props.day === 0 ? ' ' : this.props.day
        let status = this.props.index == 0 ? '' : data == undefined ? '' : data.status
        let availableVancancy = this.props.index == 0 ? '' : data == undefined ? '' : '可賣: ' + data.availableVancancy
        let totalVacnacy = this.props.index == 0 ? '' : data == undefined ? '' : '團位: ' + data.totalVacnacy
        let price = this.props.index == 0 ? '' : data == undefined ? '' : '$' + data.price
        let dayClassName =
            typeof this.props.day === 'string' ? 'week-day' : this.props.day > 0 ? 'day' : 'day-disable';
        return (
            <div onClick={this.onClick.bind(this)} className={dayClassName}>
                <span className="day-postion">{day}</span>
                <span className="status">{status}</span>
                <span className="sell">{availableVancancy}</span>
                <span className="group">{totalVacnacy}</span>
                <span className="price">{price}</span>
            </div>
        )
    }
}

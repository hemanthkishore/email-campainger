import React, { Component } from 'react';

import { Button } from 'antd';

import { unsubscribeUser } from '../utils/apis'

class Unsubscribe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unsubscribe: false,
        }
    }

    unsubscribe = () => {
        const id = this.props.match.params.id;
        const urlParams = new URLSearchParams(this.props.location.search);
        const userId = urlParams.get('userId');
        unsubscribeUser(id, userId).then((response) => {
            console.log(response, "response");
            this.setState({ unsubscribe: true });
        }).catch(error => {
            console.log(error, "error");
        })
    }

    render() {
        console.log("Inside")
        return (
            <>
                {
                    this.state.unsubscribe &&
                    <p>You have been successfully unsubscribed</p>
                }
                {
                    !this.state.unsubscribe &&
                    <div style={{ textAlign: "center" }}>
                        <p>Do you want to unsubscribe from further emails</p>
                        <Button onClick={this.unsubscribe}>Unsubscribe</Button>
                    </div>
                }
            </>
        )
    }
}

export default Unsubscribe;
import React, { Component } from 'react';
import { List, Row, Col } from 'antd';

import { getUsersForCampaign } from '../utils/apis';

class ListUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {},
            loading: false
        }
    }

    componentDidMount() {
        const { _id, name } = this.props.campaignData;
        this.setState({ loading: true })
        getUsersForCampaign(_id, name, 1).then(response => {
            console.log(response.data[0], "respone");
            if (response.data && response.data.length > 0) {
                console.log("Inside")
                this.setState({ users: response.data[0], loading: false });
            }
        });
    }

    render() {
        console.log(this.state);
        if (this.state.loading) {
            return (
                <p>Data is loading</p>
            )
        }
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.state.users.userData}
                header={
                    <Row style={{ width: "100%" }}>
                        <Col span={8}>
                            <strong>Name</strong>
                        </Col>
                        <Col span={8}>
                            <strong>Email</strong>
                        </Col>
                        <Col span={8}>
                            <strong>Unsubscribed</strong>
                        </Col>
                    </Row>
                }
                renderItem={item => (
                    <List.Item>
                        <Row style={{ width: "100%" }}>
                            <Col span={8}>
                                {item.username}
                            </Col>
                            <Col span={8}>
                                {item.email}
                            </Col>
                            <Col span={8}>
                                {item.unsubscribe.toString()}
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        )
    }
}

export default ListUsers;
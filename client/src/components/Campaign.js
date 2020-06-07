import React, { Component } from 'react';

import { List, Row, Col, Button, Modal, Form, Input, DatePicker, Switch } from 'antd';
import { getCampaignData, addScheduleToCampaign } from '../utils/apis';
import ListUsers from './ListUsers';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 4 },
};

const getISTTime = (date) => {
    let d = new Date(date);
    let time = d.getTime() + (5.5 * 60 * 60 * 1000)
    return new Date(time).toJSON();
}

class Campaign extends Component {

    constructor(props) {
        super(props);
        console.log("Inisde", props);
        this.state = {
            loading: false,
            campaignData: {},
            sendersLis: [],
            addSchedule: false,
            listUsers: false
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.setState({ loading: true });
        getCampaignData(id).then(response => {
            console.log(response, "Response");
            if (response && response.data) {
                this.setState({ campaignData: response.data, loading: false });
            }
        });
    }

    addSchedule = () => {
        this.setState({ addSchedule: true });
    }

    displayUsers = (change) => {
        this.setState({ listUsers: change });
    }

    handleCancel = e => {
        console.log(e);
        this.setState({ addSchedule: false })
    };

    onFinish = values => {
        console.log('Success:', values);
        this.setState({ addSchedule: false, loading: true });
        const data = {
            "scheduledDate": values.date,
            "emailBody": values.body,
            "emailSubject": values.subject,
            "emailParams": {
                "param1": "Value1",
                "param2": "Value2"
            }
        }
        const id = this.props.match.params.id;
        addScheduleToCampaign(id, data).then(response => {
            getCampaignData(id).then(response => {
                if (response && response.data) {
                    this.setState({ campaignData: response.data, loading: false });
                }
            })
        }).catch(() => {
            this.setState({ loading: false });
        });
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    campaingsList = () => {
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.state.campaignData.campaignData}
                header={
                    <Row style={{ width: "100%" }}>
                        <Col span={6}>
                            <strong>Date</strong>
                        </Col>
                        <Col span={6}>
                            <strong>Body</strong>
                        </Col>
                        <Col span={6}>
                            <strong>Subject</strong>
                        </Col>
                        <Col span={6}>
                            <strong>status</strong>
                        </Col>
                    </Row>
                }
                renderItem={item => (
                    <List.Item>
                        <Row style={{ width: "100%" }}>
                            <Col span={6}>
                                {getISTTime(item.scheduledDate)}
                            </Col>
                            <Col span={6}>
                                {item.emailBody}
                            </Col>
                            <Col span={6}>
                                {item.emailSubject}
                            </Col>
                            <Col span={6}>
                                {item.status || "Not Completed"}
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        );
    }

    render() {
        const { campaignData, listUsers } = this.state;
        if (this.state.loading) {
            return (
                <p>Data is loading</p>
            )
        }

        return (
            <>
                {
                    campaignData.name &&
                    <div style={{ textAlign: 'center' }}>
                        <h2>{campaignData.name}</h2>
                        <p>{campaignData.description}</p>
                        <p>Totoal Users: <strong>{campaignData.userCount}</strong></p>
                        <Button onClick={this.addSchedule}>Add Schedule</Button>
                        <Switch style={{ marginLeft: "10px" }} onClick={this.displayUsers} />
                        <span style={{ marginLeft: "10px" }}> List Users </span>
                        <div style={{marginTop: "20px"}}>
                            {
                                !listUsers && this.campaingsList()
                            }
                            {
                                listUsers && <ListUsers campaignData={this.state.campaignData}/>
                            }
                        </div>
                    </div>
                }
                {
                    !campaignData.name &&
                    <h2>There is no data</h2>
                }

                <Modal
                    title="Schedule Campaign"
                    visible={this.state.addSchedule}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            name="date" label="date"
                            rules={[{ type: 'object', required: true, message: 'Please select time!' }]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item
                            label="body"
                            name="body"
                            rules={[{ required: true, message: 'Please input your campaign name' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="subject"
                            name="subject"
                            rules={[{ required: true, message: 'Please input your campaign name' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" style={{ float: "left" }}>
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}

export default Campaign;
import React, { Component } from 'react';

import papaparse from 'papaparse';
import { Form, Input, Button, Tooltip, Upload, message } from 'antd';
import { createCampaign } from '../utils/apis';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};
const tailLayout = {
    wrapperCol: { offset: 6 },
};

class CreateCampaign extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    onFinish = values => {
        console.log('Success:', values);
        const data = {
            "name": values.name,
            "description": values.description,
            "receiverData": this.state.data
        };
        createCampaign(data).then(response => {
            console.log(response);
            this.props.history.push(`/campaigns/${response.data._id}`);
        })

    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    normFile = uploadData => {
        const { file } = uploadData;
        papaparse.parse(file, {
            header: true,
            complete: (results) => {
                const fields = ["username", "email"];
                if (JSON.stringify(fields) !== JSON.stringify(results.meta.fields)) {
                    message.error('Columns dont match');
                } else {
                    this.setState({ data: results.data });
                }
            },
            error: (err) => {
                console.log(err);
            },
        });
    };

    render() {
        return (
            <div>
                <h2 style={{ textAlign: "center" }}>Create a Email Campaign</h2>
                <Form
                    {...layout}
                    style={{ paddingTop: "24px" }}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your campaign name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description for campaign' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Data">
                        <Form.Item name="data" valuePropName="fileList" noStyle>
                            <Upload
                                accept=".csv"
                                name="file"
                                showUploadList={false}
                                customRequest={this.normFile}
                                disabled={this.state.data.length > 0}
                            >
                                <Tooltip title="Upload data in username,email format">
                                    {this.state.data.length > 0 && <p>Uploaded</p>}
                                    {this.state.data.length === 0 && <Button>Upload</Button>}
                                </Tooltip>
                            </Upload>
                        </Form.Item>

                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" style={{ float: "left" }}>
                            Create
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default CreateCampaign;
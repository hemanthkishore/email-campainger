import React, { Component } from 'react';
import { List } from 'antd';

import { campaignsList } from '../utils/apis';
import { Link } from 'react-router-dom';

class Campaigns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            campaigns: []
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        campaignsList().then(response => {
            console.log(response.data, "Respi");
            if (response && response.data) {
                this.setState({ campaigns: response.data, loading: false });
            }
        }).catch(error=>{
            console.log(error)
            this.setState({ loading: false });
        });
    }

    render() {

        if (this.state.loading) {
            return (
                <p>Loading Data</p>
            )
        }

        return (
            <div>
                {
                    this.state.campaigns.length === 0 &&
                    <p>There are no Campaigns</p>
                }
                {
                    this.state.campaigns.length > 0 &&
                    <div>
                        <h3>List of Campaigns</h3>
                        <List
                            itemLayout="horizontal"
                            dataSource={this.state.campaigns}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Link to={`/campaigns/${item._id}`}>View</Link>]}
                                >{item.name}</List.Item>
                            )}
                        />
                    </div>

                }
            </div>
        );
    }
}

export default Campaigns;
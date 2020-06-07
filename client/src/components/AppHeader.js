import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu } from 'antd';
const Header = Layout.Header;

class AppHeader extends Component {
    render() {
        let menuItems = [
            <Menu.Item key="/campaigns">
                <Link to="/campaigns">Create</Link>
            </Menu.Item>
        ];

        return (
            <Header className="app-header">
                <div>
                    <div className="app-title" >
                        <Link to="/">Email Campaigner</Link>
                    </div>
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '64px' }} >
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}


export default withRouter(AppHeader);
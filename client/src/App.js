import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import AppHeader from './components/AppHeader';
import Campaigns from './components/Campaigns';
import CreateCampaign from './components/CreateCampaign';
import Campaign from './components/Campaign';
import unsubscribe from './components/Unsubscribe';

import { Layout } from 'antd';
const { Content } = Layout;

class App extends Component {


  render() {
    return (
      <Layout>
        <AppHeader />
        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Campaigns}></Route>
              <Route exact path="/campaigns" component={CreateCampaign}></Route>
              <Route exact path="/campaigns/:id" component={Campaign}></Route>
              <Route exact path="/campaigns/:id/unsubscribe"  component={unsubscribe}></Route>
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);

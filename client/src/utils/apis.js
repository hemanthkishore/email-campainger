import axios from 'axios';

export function createCampaign(data) {
    return axios.post('/campaigns', data);
}

export function campaignsList() {
    return axios.get('/campaigns');
}

export function getCampaignData(id) {
    return axios.get(`/campaigns/${id}`);
}

export function addScheduleToCampaign(id, data) {
    return axios.post(`/campaigns/${id}/schedule`, data);
}

export function unsubscribeUser(id, userId) {
    return axios.post(`/campaigns/${id}/unsubscribe?userId=${userId}`);
}
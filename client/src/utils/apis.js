import axios from 'axios';

export function createCampaign(data) {
    return axios.post('api/campaigns', data);
}

export function campaignsList() {
    return axios.get('api/campaigns');
}

export function getCampaignData(id) {
    return axios.get(`api/campaigns/${id}`);
}

export function addScheduleToCampaign(id, data) {
    return axios.post(`api/campaigns/${id}/schedule`, data);
}

export function unsubscribeUser(id, userId) {
    return axios.post(`api/campaigns/${id}/unsubscribe?userId=${userId}`);
}
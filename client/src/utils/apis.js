import axios from 'axios';

const url = process.env.NODE_ENV === 'production' ? 'https://rocky-taiga-73939.herokuapp.com' : 'http://localhost:5000';
console.log(url);

export function createCampaign(data) {
    return axios.post(`${url}/api/campaigns`, data);
}

export function campaignsList() {
    return axios.get(`${url}/api/campaigns`);
}

export function getCampaignData(id) {
    return axios.get(`${url}/api/campaigns/${id}`);
}

export function addScheduleToCampaign(id, data) {
    return axios.post(`${url}/api/campaigns/${id}/schedule`, data);
}

export function unsubscribeUser(id, userId) {
    return axios.post(`${url}/api/campaigns/${id}/unsubscribe?userId=${userId}`);
}
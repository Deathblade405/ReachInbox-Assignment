import axios from 'axios';
import { authHeader } from './auth';

const API_BASE_URL = 'https://hiring.reachinbox.xyz/api/v1/onebox';

export const fetchEmails = () => {
    return axios.get(`${API_BASE_URL}/list`, { headers: authHeader() });
};

export const deleteEmail = (threadId) => {
    return axios.delete(`${API_BASE_URL}/messages/${threadId}`, { headers: authHeader() });
};

export const sendReply = (threadId, replyData) => {
    console.log('Sending reply with data:', replyData);

    return axios.post(`${API_BASE_URL}/reply/${threadId}`, replyData, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(),
        },
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Failed to send reply: ${response.statusText}`);
        }
        return response.data; // Ensure the response data contains the new reply information
    }).catch(error => {
        console.error('Failed to send reply. Error details:', {
            message: error.message,
            response: error.response ? error.response.data : 'No response data',
        });
        throw error;
    });
};

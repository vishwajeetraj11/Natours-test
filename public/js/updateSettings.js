/* eslint-disable */

import axios from 'axios';

import { showAlert } from './alerts';
// type either password or data
export const updateSettings = async ( data, type) => {
    try {
        const url = type === 'password' ? '/api/v1/users//updatePassword' : '/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if( res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} Updated Successfully`);
        }
    }catch(error) {
        showAlert('error', error.response.data.message);
    }
};
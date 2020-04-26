/* eslint-disable */
import '@babel/polyfill'; 
import { showAlert } from './alerts';
import axios from 'axios';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email, 
        password,
        passwordConfirm
      }
    });

    if(res.data.status === 'success') {
        showAlert('success', 'Account Created successfully!');
        window.setTimeout(() => {
            // to send the user to another page
            location.assign('/');
        }, 1500);
    }
  } catch (err) {
    showAlert('error' ,err.response.data.message);
  }
};

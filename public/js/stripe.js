// eslint-disable-file

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_bR9tDzN7Yt05QOXMndRsHkbG00zdhjLECt');

export const bookTour = async tourId => {
  try {
    // 1. Get checkout session from endpoint from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);
    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

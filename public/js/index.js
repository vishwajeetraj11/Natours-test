/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox.js';
import { signup } from './signup.js';
import { login, logout } from './login';
import { bookTour } from './stripe';
import { updateSettings } from './updateSettings';


// Dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');
const bookBtn = document.getElementById('book-tour');
// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if(signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutButton) logOutButton.addEventListener('click', logout);

if (userDataForm) 
userDataForm.addEventListener('submit', e => {
  e.preventDefault();

  const form = new FormData();
  form.append('name', document.getElementById('name').value)
  form.append('email', document.getElementById('email').value)
  form.append('photo', document.getElementById('photo').files[0])
  updateSettings(form, 'data');
});
if (userPasswordForm) 
userPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  document.querySelector('.btn--save--password').textContent = 'Updating...';

  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

  document.querySelector('.btn--save--password').textContent = 'Save Password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});

if (bookBtn) 
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    
    bookTour(tourId);
  });
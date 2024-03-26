import Cookies from 'js-cookie';

// Function to set a cookie
export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options);
};

// Function to remove a cookie
export const removeCookie = (name) => {
  Cookies.remove(name);
};

// Function to get a cookie value by name
export const getCookie = (name) => {
  return Cookies.get(name);
};

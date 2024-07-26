import { message } from "antd";

const isBrowser = typeof window !== "undefined"; // Check if running in the browser

export const getToken = () => {
  return isBrowser ? localStorage.getItem("token") : null;
};

export const clearToken = () => {
  isBrowser && localStorage.removeItem("token");
};

export const deauthUser = () => {
	message.loading("Please wait...", 1).then(async () => {
	try {
        clearToken();
        localStorage.removeItem('relawanApk_token');
        localStorage.removeItem('relawanApk_user');
        localStorage.removeItem('typeUser');
        localStorage.removeItem('relawanApk_id');
        localStorage.removeItem('relawanApk_userData');
        window.location.replace('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
	})
}

export const isAuthenticated = () => {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem("relawanApk_token");
    return !!token;
  } else {
    // Handle the case where localStorage is not available
    return false;
  }  
};
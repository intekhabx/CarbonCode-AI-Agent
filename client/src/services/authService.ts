import api from "./apiService";
import tokenStoreService from "./tokenStoreService";


const authService = {

  signupUserWithEmailAndPassword: async ({name, email, password}: {name: string, email: string, password: string}) => {
    const {data} = await api.post("/api/auth/signup", {name, email, password});
    return data;
  },

  signinUserWithEmailAndPassword: async ({email, password}: {email: string, password: string}) => {
    const {data} = await api.post("/api/auth/signin", {email, password});
    // console.log(data);
    tokenStoreService.setAccessToken(data.data.accessToken);
    return data.data.user;
  },

  getLoggedInUserInfo: async () => {
    const {data} = await api.get("/api/auth/profile");
    // console.log(data)
    return data.data.user;
  },
  
  signoutUser: async () => {
    const {data} = await api.post("/api/auth/signout");
    return data;
  },

  renewAccessTokenAndRefreshToken: async () => {
    const {data} = await api.post("/api/auth/renew/token");
    // console.log(data);
    const accessToken = data?.data?.accessToken;
    tokenStoreService.setAccessToken(accessToken);
    return accessToken;
  },

}


export default authService;

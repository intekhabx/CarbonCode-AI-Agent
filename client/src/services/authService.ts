import api from "./apiService";


const authService = {

  signupUserWithEmailAndPassword: async ({name, email, password}: {name: string, email: string, password: string}) => {
    const {data} = await api.post("/api/auth/signup", {name, email, password});
    return data;
  },

  signinUserWithEmailAndPassword: async ({email, password}: {email: string, password: string}) => {
    const {data} = await api.post("/api/auth/signin", {email, password});
    return data;
  },

  getLoggedInUserInfo: async () => {
    const {data} = await api.get("/api/auth/profile");
    return data;
  },
  
  signoutUser: async () => {
    const {data} = await api.post("/api/auth/signout");
    return data;
  },

}


export default authService;

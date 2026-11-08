
let accessToken: string | null = null;

const tokenStoreService = {
  
  setAccessToken: (token: string) => {
    accessToken = token;
  },

  getAccessToken: () => {
    return accessToken;
  },

  removeAccessToken: () => {
    accessToken = null;
  }

}

export default tokenStoreService;

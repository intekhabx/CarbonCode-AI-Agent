import { create } from "zustand";
import authService from "../services/authService";
import toast from "react-hot-toast";


type UserType = {
  name: string;
  email: string;
}


type AuthStoreType = {
  user: UserType | null;
  updateUser: ({name, email}: UserType) => void;

  signupUserWithEmailAndPassword: ({name, email, password}: {name: string, email: string, password: string}) => Promise<void>;
  signinUserWithEmailAndPassword: ({email, password}: {email: string, password: string}) => Promise<void>;
}


export const useAuthStore = create<AuthStoreType>((set) => ({
  user: null,
  updateUser:  (value) => set(() => ({user: value})),

  signupUserWithEmailAndPassword: async ({name, email, password}) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      await authService.signupUserWithEmailAndPassword({name, email, password});
      toast.success("Your Account Created Successfully");
    } 
    catch (error: any) {
      console.log(error, error?.message);
      toast.error("Something went wrong");
      throw error;
    }
  },

  signinUserWithEmailAndPassword: async ({email, password}) => {
    try {
      const data = await authService.signinUserWithEmailAndPassword({email, password});
      set({user: data});
      toast.success("You are LoggedIn Successfully");
    } 
    catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      throw error;
    }
  },

}));

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import authService from "../services/authService"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import tokenStoreService from "../services/tokenStoreService";

// signup hook
export const useSignup = ({name, email, password}: {name: string, email: string, password: string}) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => 
      await authService.signupUserWithEmailAndPassword({name, email, password}),

    onSuccess: () => {
      // console.log("signup success")
      toast.success("Your Account Created Successfully");
      navigate("/signin");
    },

    onError: (error: any) => {
      console.log(error, error?.response);
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  });

  return mutation;
}


// signin hook
export const useSignin = ({email, password}: {email: string, password: string}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => 
      await authService.signinUserWithEmailAndPassword({email, password}),

    onSuccess: async (data) => {
      // Avoid an older in-flight profile request overwriting the newly signed-in user.
      await queryClient.cancelQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], data);
      toast.success("You are logged in");
      navigate("/");
    },

    onError: (error: any) => {
      console.log(error, error?.response);
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  });

  return mutation;
}


// signout hook
export const useSignout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => await authService.signoutUser(),
    
    onSuccess: async () => {
      // remove accesstoken and all cache data from react-query
      tokenStoreService.removeAccessToken();
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "user" && q.queryKey[0] !== "renew" }); //user ko null set krna hai aur renew ko rhne dena hai baki sab ko clear krdo
      // Set user to null instead of clear(), so App re-renders and the /signin guard sees no user
      queryClient.setQueryData(["user"], null);
      toast.success("Logged out successfully");
      navigate("/signin", { replace: true });
    },

    onError: (error: any) => {
      console.log(error, error?.response);
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  });

  return mutation;
}


// getLoggedInUserInfo hook
export const useUserProfile = () => {
  const {data: user, isPending, fetchStatus} = useQuery({
    queryFn: authService.getLoggedInUserInfo,
    queryKey: ["user"],
    retry: false,
    // Avoid refetching stale data or retrying failed profile calls when other components mount.
    staleTime: Infinity,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Don't request a protected profile when refresh failed and no access token exists.
    enabled: Boolean(tokenStoreService.getAccessToken()),
  })

  return {
    user,
    isPending,
    isLoading: isPending && fetchStatus === "fetching",
  };
}


// renew token hook //ye useMutation se hota kyuki ye post api call h but phir v isko useQuery se hi kiye hai
export const useRenewToken = () => {
  const {isPending} =  useQuery({
    queryKey: ["renew"],
    queryFn: authService.renewAccessTokenAndRefreshToken,

    staleTime: Infinity,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    isPending,
  }
};

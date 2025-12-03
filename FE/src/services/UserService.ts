import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",

});
export const loginUser = async (username: string, password: string) => {
   console.log("Logging in with", { username, password });

   try {

      const response = await axiosClient.post("/login", { username, password });
      return response.data;
   } catch (error: any) {
      console.error("Login failed:", error.message);
   }
};
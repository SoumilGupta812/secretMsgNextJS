import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";

export async function usernameValidator(username: string) {
  try {
    const res = await axios.get(
      `/api/check-username-unique?username=${username}`,
    );
    return {
      message: res.data.message,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      message: axiosError.response?.data.message,
    };
  }
}

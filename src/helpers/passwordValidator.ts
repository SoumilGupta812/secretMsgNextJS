import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
export async function passwordValidator(password: string) {
  try {
    const res = await axios.post("/api/check-password", {
      password,
    });
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

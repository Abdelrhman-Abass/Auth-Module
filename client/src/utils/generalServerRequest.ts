import { AxiosInstance } from "./axiosInstance";

export const getServerRequest = async (url: string) => {
  try {
    const response = await AxiosInstance.get(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Server responded with an error",
      };
    } else if (error.request) {
      return {
        success: false,
        status: null,
        message: "No response received from server. Please check your connection.",
      };
    } else {
      return {
        success: false,
        status: null,
        message: "An unexpected error occurred.",
      };
    }
  }
};

export const postServerRequest = async (url: string, data?: any) => {
  try {
    const response = await AxiosInstance.post(url, data && data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Server responded with an error",
      };
    } else if (error.request) {
      return {
        success: false,
        status: null,
        message: "No response received from server. Please check your connection.",
      };
    } else {
      return {
        success: false,
        status: null,
        message: "An unexpected error occurred.",
      };
    }
  }
};

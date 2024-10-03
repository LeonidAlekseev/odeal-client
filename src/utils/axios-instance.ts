"use client";

import { AUTH_TOKEN_KEY } from "@/utils/constants";
import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

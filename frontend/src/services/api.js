const API_BASE_URL = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");

const buildHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const parseResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    const message = data?.errors?.map?.((e) => e.msg).join(" | ") || data?.message || "Une erreur est survenue";
    throw new Error(message);
  }
  return data;
};

export const apiGet = async (path) => parseResponse(await fetch(`${API_BASE_URL}${path}`, { headers: buildHeaders(false) }));
export const apiDelete = async (path) => parseResponse(await fetch(`${API_BASE_URL}${path}`, { method: "DELETE", headers: buildHeaders(false) }));
export const apiPost = async (path, payload, isFormData = false) =>
  parseResponse(
    await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: isFormData ? buildHeaders(false) : buildHeaders(true),
      body: isFormData ? payload : JSON.stringify(payload),
    })
  );
export const apiPut = async (path, payload, isFormData = false) =>
  parseResponse(
    await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: isFormData ? buildHeaders(false) : buildHeaders(true),
      body: isFormData ? payload : JSON.stringify(payload),
    })
  );

export const getImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;
  return `http://localhost:5000/${value}`;
};

export default API_BASE_URL;

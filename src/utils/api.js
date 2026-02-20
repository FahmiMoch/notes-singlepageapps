const BASE_URL = "https://notes-api.dicoding.dev/v1";

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid JSON response");
    }

    if (!res.ok || data.status !== "success") {
      throw new Error(`${res.status}: ${data.message || "Request failed"}`);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Network Error");
  }
}

export async function register({ name, email, password }) {
  const { message } = await safeFetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return message;
}

export async function login({ email, password }) {
  const { data } = await safeFetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export function putAccessToken(token) {
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getUserLogged() {
  const token = getAccessToken();
  if (!token) throw new Error("Unauthorized: no access token");

  const { data } = await safeFetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

const authHeader = () => {
  const token = getAccessToken();
  if (!token) throw new Error("Unauthorized: no access token");
  return { Authorization: `Bearer ${token}` };
};

async function noteRequest(path = "", method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json", ...authHeader() },
  };
  if (body) options.body = JSON.stringify(body);

  const { data, message } = await safeFetch(
    `${BASE_URL}/notes${path}`,
    options,
  );
  return data ?? message;
}

export const getActiveNotes = () => noteRequest();
export const getArchivedNotes = () => noteRequest("/archived");
export const getNote = (id) => noteRequest(`/${id}`);
export const addNote = ({ title, body }) =>
  noteRequest("", "POST", { title, body });
export const deleteNote = (id) => noteRequest(`/${id}`, "DELETE");
export const archiveNote = (id) => noteRequest(`/${id}/archive`, "POST");
export const unarchiveNote = (id) => noteRequest(`/${id}/unarchive`, "POST");

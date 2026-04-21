const API_BASE_URL = "http://127.0.0.1:8000/api";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "lms_current_user";

export function setTokens(access, refresh) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export async function signup(username, email, password, password2, role) {
  const response = await fetch(`${API_BASE_URL}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      password2,
      role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      data,
    };
  }

  setTokens(data.access, data.refresh);
  setCurrentUser(data.user);

  return {
    success: true,
    user: data.user,
  };
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      data,
    };
  }

  setTokens(data.access, data.refresh);
  setCurrentUser(data.user);

  return {
    success: true,
    user: data.user,
  };
}

export async function logout() {
  const access = getAccessToken();
  const refresh = getRefreshToken();

  try {
    if (access && refresh) {
      await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    clearTokens();
    clearCurrentUser();
  }
}

export async function fetchCurrentUser() {
  const access = getAccessToken();

  if (!access) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!response.ok) {
      clearTokens();
      clearCurrentUser();
      return null;
    }

    const user = await response.json();
    setCurrentUser(user);
    return user;
  } catch (error) {
    clearTokens();
    clearCurrentUser();
    return null;
  }
}
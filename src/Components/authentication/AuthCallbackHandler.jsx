import { useEffect } from "react";

export default function AuthCallbackHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const access = params.get("access");
    const refresh = params.get("refresh");
    const voyageur = params.get("voyageur");

    if (access && refresh) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      if (voyageur) {
        localStorage.setItem("voyageur", voyageur);
      }

      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return null;
}
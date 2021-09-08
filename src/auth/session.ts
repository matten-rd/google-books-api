import { useEffect, useState } from "react";
import { GoogleLoginResponse } from "react-google-login";

export function userIsLoggedIn(): boolean {
  if (sessionStorage.getItem("currentUser") == null) {
    return false;
  } else {
    return true;
  }
}

export function useLoggedInStatus() {
  const [user, setUser] = useState<GoogleLoginResponse["profileObj"] | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(userIsLoggedIn());

  useEffect(() => {
    if (isLoggedIn) {
      const authUser: GoogleLoginResponse["profileObj"] = JSON.parse(
        sessionStorage.getItem("currentUser")!
      );
      setUser(authUser);
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  let tuple: [
    GoogleLoginResponse["profileObj"] | null,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = [user, setIsLoggedIn];

  return tuple;
}


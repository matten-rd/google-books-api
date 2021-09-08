import { Button, useToast } from "@chakra-ui/react";
import React from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { GoogleIcon } from "../theme/customComps/GoogleLogo";

const clientId =
  "586011032978-80qne6ubuk1plh0j9o0v9lk92ilcauil.apps.googleusercontent.com";

interface Props {
  setIsLoggedIn: () => void;
}

function Login({ setIsLoggedIn }: Props) {
  const toast = useToast();
  const onSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ("profileObj" in response) {
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify(response?.profileObj)
      );
      sessionStorage.setItem(
        "authToken",
        "Bearer " + response?.tokenObj.access_token
      );
      toast({
        title: "Du har loggat in!",
        status: "success",
        variant: "subtle",
        duration: 2000,
        isClosable: true,
      });
      setIsLoggedIn();
    }
  };

  const onFailure = (response: any) => {
    console.log("Login failed: ", response);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Logga in"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        scope="profile email https://www.googleapis.com/auth/books"
        render={(renderProps) => (
          <LoginButton
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          />
        )}
      />
    </div>
  );
}

interface ILoginButton {
  onClick: () => void;
  disabled: boolean | undefined;
}

function LoginButton({ onClick, disabled }: ILoginButton) {
  return (
    <Button onClick={onClick} disable={disabled}>
      <GoogleIcon mr="2" boxSize="5" />
      Logga in
    </Button>
  );
}

export default Login;

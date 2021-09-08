import { Button, Icon, useToast } from "@chakra-ui/react";
import { LogoutIcon } from "@heroicons/react/outline";
import React from "react";
import { GoogleLogout } from "react-google-login";

const clientId =
  "586011032978-80qne6ubuk1plh0j9o0v9lk92ilcauil.apps.googleusercontent.com";

interface Props {
  setIsLoggedIn: (arg: boolean) => void;
}

function Logout({ setIsLoggedIn }: Props) {
  const toast = useToast();
  const onSuccess = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    toast({
      title: "Du har loggat ut!",
      status: "info",
      variant: "subtle",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logga ut"
        onLogoutSuccess={onSuccess}
        render={(renderProps) => (
          <LogoutButton
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          />
        )}
      />
    </div>
  );
}

interface ILogoutButton {
  onClick: () => void;
  disabled: boolean | undefined;
}

function LogoutButton({ onClick, disabled }: ILogoutButton) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      disable={disabled}
      variant="unstyled"
      alignItems="center"
      w="full"
    >
      <Icon as={LogoutIcon} mr="2" boxSize="5" />
      Logga ut
    </Button>
  );
}

export default Logout;

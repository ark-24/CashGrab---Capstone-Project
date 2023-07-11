import { useEffect, useRef, useState } from "react";
import { useLogin } from "@pankod/refine-core";
import { Container, Box } from "@pankod/refine-mui";

import { CredentialResponse } from "../interfaces/google";
import { CustomButton } from "components";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import RegisterDialog from "./register";
import SigninDialog from "./signin";
import { logo } from "assets";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []); // you can also add your client id as dependency here

    return <div ref={divRef} />;
  };

  function handleRegisterOpen(): void {
    setRegisterOpen(true);
  }

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  function handleSigninOpen(): void {
    setSigninOpen(true);
  }

  const handleSigninClose = () => {
    setSigninOpen(false);
  };

  return (
    <Box
      component="div"
      sx={{
        background: "white", //`radial-gradient(50% 50% at 50% 50%, #ecc414 0%, #D2042D 100%)`,
        backgroundSize: "cover",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={logo}
              alt="Payment Peers Logo"
              style={{ width: "200px", height: "auto" }} // Adjust the width as needed
            />
          </div>
          {/* <Box mt={4}>
            <GoogleButton />
          </Box> */}
          <Box mt={4}>
            <CustomButton
              title={"Register"}
              backgroundColor="#D2042D"
              color="#F3EC0E"
              icon={<AppRegistrationIcon />}
              handleClick={handleRegisterOpen}
            />
          </Box>
          <Box mt={4}>
            <CustomButton
              title={"Sign in"}
              backgroundColor="#D2042D"
              color="#F3EC0E"
              icon={<HowToRegIcon />}
              handleClick={handleSigninOpen}
              // handleClick={() => {
              //   handleDeleteItem();
              // }}
            />
          </Box>
        </Box>
      </Container>
      <RegisterDialog isOpen={registerOpen} onClose={handleRegisterClose} />
      <SigninDialog isOpen={signinOpen} onClose={handleSigninClose} />
    </Box>
  );
};
export default Login;

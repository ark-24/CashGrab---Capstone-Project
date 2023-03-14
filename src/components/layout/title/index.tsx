import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button } from "@pankod/refine-mui";
import { logo } from "assets";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={logo} alt="PaymentPeers" width="70px" height="50px" style = {{
            marginTop : "100000 px",
          }} />
        ) : (
            <img src={logo} alt="PaymentPeers" width="140px" height="90px" style={{marginTop : "100 px",}}  />
        )}
      </Link>
    </Button>
  );
};

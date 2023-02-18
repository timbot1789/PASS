import { useContext } from "react";
import { SessionContext } from "../../App";
import { SOLID_IDENTITY_PROVIDER } from "../../utils/";

const Login = () => {
  const { session, handleLogin } = useContext(SessionContext);

  return (
    <section id="login" className="panel">
      <div className="row">
        <label id="labelLogin" htmlFor="btnLogin">
          Click the following login button to log into your pod at [
          <a href={SOLID_IDENTITY_PROVIDER} target="_blank">
            {SOLID_IDENTITY_PROVIDER}
          </a>
          ]:{" "}
        </label>
        <button onClick={() => handleLogin()}>
          {session.info.isLoggedIn ? "Logout" : "Login"}
        </button>
        {session.info.isLoggedIn ? (
          <p className="labelStatus" role="alert">
            Your session is logged in with the WebID [
            <a href={session.info.webId} target="_blank">
              {session.info.webId}
            </a>
            ].
          </p>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </section>
  );
};

export default Login;

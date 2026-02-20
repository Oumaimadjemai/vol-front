
import AuthCallbackHandler from "./Components/authentication/AuthCallbackHandler";
import Navbar from "./Components/Menu/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
    <AuthCallbackHandler />
      <Navbar/>
      <AppRoutes />
    </>
  );
}

export default App;

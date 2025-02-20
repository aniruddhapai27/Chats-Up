import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import { ToastContainer } from "react-toastify";
import Register from "./Components/Register";
import Home from "./Components/Home";
import { VerifyUser } from "./utils/VerifyUser";
function App() {
  return (
    <div className="p-2 w-screen h-screen flex items-center justify-center">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route index path="/login" element={<Login />} />
        <Route element={<VerifyUser />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

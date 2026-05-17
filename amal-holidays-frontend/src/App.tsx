import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
//import Sandbox from "./pages/Sandbox";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
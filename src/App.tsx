import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import "./App.css"
import Auth from "./pages/Auth/Auth"

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  </BrowserRouter>
)

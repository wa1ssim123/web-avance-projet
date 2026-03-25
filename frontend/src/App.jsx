import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Subjects from "./pages/Subjects";
import SubjectForm from "./pages/SubjectForm";
import SubjectDetails from "./pages/SubjectDetails";
import Departments from "./pages/Departments";
import DepartmentForm from "./pages/DepartmentForm";
import DepartmentDetails from "./pages/DepartmentDetails";
import Laboratories from "./pages/Laboratories";
import Users from "./pages/Users";
import Equipments from "./pages/Equipments";
import Roles from "./pages/Roles";
import "./styles/entities.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/subjects/add" element={<ProtectedRoute><SubjectForm /></ProtectedRoute>} />
        <Route path="/subjects/:id" element={<ProtectedRoute><SubjectDetails /></ProtectedRoute>} />
        <Route path="/subjects/edit/:id" element={<ProtectedRoute><SubjectForm /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
        <Route path="/departments/add" element={<ProtectedRoute><DepartmentForm /></ProtectedRoute>} />
        <Route path="/departments/:id" element={<ProtectedRoute><DepartmentDetails /></ProtectedRoute>} />
        <Route path="/departments/edit/:id" element={<ProtectedRoute><DepartmentForm /></ProtectedRoute>} />
        <Route path="/laboratories" element={<ProtectedRoute><Laboratories /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/equipments" element={<ProtectedRoute><Equipments /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

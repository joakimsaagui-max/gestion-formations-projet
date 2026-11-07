import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Formations from './pages/Formations';
import Inscriptions from './pages/Inscriptions';

export default function App() {
  return (
    <div className="layout">
      <nav className="navbar">
        <h1>Gestion Formations</h1>
        <NavLink to="/" end>Tableau de bord</NavLink>
        <NavLink to="/students">Étudiants</NavLink>
        <NavLink to="/formations">Formations</NavLink>
        <NavLink to="/inscriptions">Inscriptions</NavLink>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/inscriptions" element={<Inscriptions />} />
        </Routes>
      </main>
    </div>
  );
}
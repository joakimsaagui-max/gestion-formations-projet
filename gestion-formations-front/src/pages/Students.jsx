import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formations, setFormations] = useState([]);
  const [search, setSearch] = useState('');
  const [formationId, setFormationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/formations')
      .then((res) => setFormations(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get('/students', {
          params: { q: search, formation_id: formationId },
        });
        setStudents(res.data);
        setError('');
      } catch {
        setError("Impossible de charger les étudiants. Vérifie que l'API et MySQL tournent.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, formationId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant ?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFormationId('');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Étudiants</h2>
        <Link to="/students/new" className="btn">+ Ajouter</Link>
      </div>

      <div className="filters">
        <input
          className="search"
          type="text"
          placeholder="Rechercher (nom, prénom, email)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={formationId}
          onChange={(e) => setFormationId(e.target.value)}
        >
          <option value="">Toutes les formations</option>
          {formations.map((f) => (
            <option key={f.id} value={f.id}>{f.titre}</option>
          ))}
        </select>
        <button className="btn btn-grey" onClick={resetFilters}>Réinitialiser</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Chargement...</p>}

      {!loading && !error && (
        <>
          <p className="result-count">{students.length} étudiant(s) trouvé(s)</p>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan="6">Aucun étudiant trouvé.</td>
                </tr>
              )}
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.nom}</td>
                  <td>{s.prenom}</td>
                  <td>{s.email}</td>
                  <td>{s.telephone || '-'}</td>
                  <td className="actions">
                    <Link to={`/students/${s.id}/edit`} className="btn btn-warning">Modifier</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
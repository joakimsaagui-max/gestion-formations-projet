import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUTS = { en_cours: 'En cours', validee: 'Validée', annulee: 'Annulée' };
const today = () => new Date().toISOString().slice(0, 10);

export default function Inscriptions() {
  const [inscriptions, setInscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [formations, setFormations] = useState([]);
  const [form, setForm] = useState({
    student_id: '',
    formation_id: '',
    date_inscription: today(),
    statut: 'en_cours',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/formations')])
      .then(([s, f]) => {
        setStudents(s.data);
        setFormations(f.data);
      })
      .catch(() => setError('Impossible de charger les listes.'));
  }, []);

  useEffect(() => {
    api
      .get('/inscriptions')
      .then((res) => setInscriptions(res.data))
      .catch(() => setError('Impossible de charger les inscriptions.'));
  }, [refresh]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await api.post('/inscriptions', form);
      setForm({ ...form, student_id: '', formation_id: '' });
      setRefresh((r) => r + 1);
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else alert("Erreur lors de l'enregistrement.");
    }
  };

  const changeStatut = async (id, statut) => {
    try {
      await api.put(`/inscriptions/${id}`, { statut });
      setRefresh((r) => r + 1);
    } catch {
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette inscription ?')) return;
    try {
      await api.delete(`/inscriptions/${id}`);
      setRefresh((r) => r + 1);
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Inscriptions</h2>
      </div>

      <form className="form form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="student_id">Étudiant</label>
          <select id="student_id" name="student_id" value={form.student_id} onChange={handleChange}>
            <option value="">-- Choisir --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.nom} {s.prenom}</option>
            ))}
          </select>
          {errors.student_id && <small className="field-error">{errors.student_id[0]}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="formation_id">Formation</label>
          <select id="formation_id" name="formation_id" value={form.formation_id} onChange={handleChange}>
            <option value="">-- Choisir --</option>
            {formations.map((f) => (
              <option key={f.id} value={f.id}>{f.titre}</option>
            ))}
          </select>
          {errors.formation_id && <small className="field-error">{errors.formation_id[0]}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="date_inscription">Date d'inscription</label>
          <input
            id="date_inscription"
            name="date_inscription"
            type="date"
            value={form.date_inscription}
            onChange={handleChange}
          />
          {errors.date_inscription && <small className="field-error">{errors.date_inscription[0]}</small>}
        </div>

        <div className="form-actions">
          <button className="btn" type="submit">Inscrire</button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Étudiant</th>
            <th>Formation</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inscriptions.length === 0 && (
            <tr>
              <td colSpan="6">Aucune inscription.</td>
            </tr>
          )}
          {inscriptions.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.student?.nom} {i.student?.prenom}</td>
              <td>{i.formation?.titre}</td>
              <td>{i.date_inscription?.slice(0, 10)}</td>
              <td>
                <select
                  className="status-select"
                  value={i.statut}
                  onChange={(e) => changeStatut(i.id, e.target.value)}
                >
                  {Object.entries(STATUTS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(i.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
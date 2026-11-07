import { useEffect, useState } from 'react';
import api from '../services/api';

const empty = {
  titre: '',
  description: '',
  duree: '',
  prix: '',
  date_debut: '',
  date_fin: '',
};

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/formations', { params: { q: search } });
        setFormations(res.data);
        setError('');
      } catch {
        setError('Impossible de charger les formations.');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, refresh]);

  const openNew = () => {
    setForm(empty);
    setEditId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (f) => {
    setForm({
      titre: f.titre ?? '',
      description: f.description ?? '',
      duree: f.duree ?? '',
      prix: f.prix ?? '',
      date_debut: f.date_debut ? f.date_debut.slice(0, 10) : '',
      date_fin: f.date_fin ? f.date_fin.slice(0, 10) : '',
    });
    setEditId(f.id);
    setErrors({});
    setShowForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editId) {
        await api.put(`/formations/${editId}`, form);
      } else {
        await api.post('/formations', form);
      }
      setShowForm(false);
      setRefresh((r) => r + 1);
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette formation ?')) return;
    try {
      await api.delete(`/formations/${id}`);
      setRefresh((r) => r + 1);
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const field = (name, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} />
      {errors[name] && <small className="field-error">{errors[name][0]}</small>}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>Formations</h2>
        <div className="header-tools">
          <input
            className="search"
            type="text"
            placeholder="Rechercher par titre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" onClick={openNew}>+ Ajouter</button>
        </div>
      </div>

      {showForm && (
        <form className="form form-grid" onSubmit={handleSubmit}>
          {field('titre', 'Titre')}
          {field('duree', 'Durée (heures)', 'number')}
          {field('prix', 'Prix', 'number')}
          {field('date_debut', 'Date de début', 'date')}
          {field('date_fin', 'Date de fin', 'date')}
          {field('description', 'Description')}
          <div className="form-actions">
            <button className="btn" type="submit">
              {editId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
            <button className="btn btn-grey" type="button" onClick={() => setShowForm(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Titre</th>
            <th>Durée</th>
            <th>Prix</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Inscrits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formations.length === 0 && (
            <tr>
              <td colSpan="8">Aucune formation trouvée.</td>
            </tr>
          )}
          {formations.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.titre}</td>
              <td>{f.duree} h</td>
              <td>{Number(f.prix).toLocaleString('fr-FR')}</td>
              <td>{f.date_debut?.slice(0, 10)}</td>
              <td>{f.date_fin?.slice(0, 10)}</td>
              <td>{f.inscriptions_count ?? 0}</td>
              <td className="actions">
                <button className="btn btn-warning" onClick={() => openEdit(f)}>Modifier</button>
                <button className="btn btn-danger" onClick={() => handleDelete(f.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
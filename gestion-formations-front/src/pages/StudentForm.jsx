import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const empty = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  date_naissance: '',
  adresse: '',
};

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/students/${id}`)
      .then((res) => {
        const s = res.data;
        setForm({
          nom: s.nom ?? '',
          prenom: s.prenom ?? '',
          email: s.email ?? '',
          telephone: s.telephone ?? '',
          date_naissance: s.date_naissance ? s.date_naissance.slice(0, 10) : '',
          adresse: s.adresse ?? '',
        });
      })
      .catch(() => navigate('/students'));
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (id) {
        await api.put(`/students/${id}`, form);
      } else {
        await api.post('/students', form);
      }
      navigate('/students');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } finally {
      setSaving(false);
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
      <h2>{id ? "Modifier l'étudiant" : 'Ajouter un étudiant'}</h2>
      <form className="form" onSubmit={handleSubmit}>
        {field('nom', 'Nom')}
        {field('prenom', 'Prénom')}
        {field('email', 'Email', 'email')}
        {field('telephone', 'Téléphone')}
        {field('date_naissance', 'Date de naissance', 'date')}
        {field('adresse', 'Adresse')}
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link to="/students" className="btn btn-grey">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
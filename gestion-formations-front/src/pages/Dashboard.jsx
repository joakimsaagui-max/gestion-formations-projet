import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUTS = {
  en_cours: { label: 'En cours', color: '#3b82f6' },
  validee: { label: 'Validées', color: '#22c55e' },
  annulee: { label: 'Annulées', color: '#ef4444' },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError("Impossible de charger les statistiques. Vérifie que l'API et MySQL tournent."));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Chargement...</p>;

  const parStatut = stats.inscriptions_par_statut || {};
  const maxTop = Math.max(1, ...stats.top_formations.map((f) => f.inscriptions_count));

  return (
    <div>
      <h2>Tableau de bord</h2>

      <div className="cards">
        <div className="card">
          <span className="card-number">{stats.total_students}</span>
          <span className="card-label">Étudiants</span>
        </div>
        <div className="card">
          <span className="card-number">{stats.total_formations}</span>
          <span className="card-label">Formations</span>
        </div>
        <div className="card">
          <span className="card-number">{stats.total_inscriptions}</span>
          <span className="card-label">Inscriptions</span>
        </div>
      </div>

      <div className="panels">
        <div className="panel">
          <h3>Inscriptions par statut</h3>
          {Object.entries(STATUTS).map(([key, { label, color }]) => {
            const value = parStatut[key] || 0;
            const percent = stats.total_inscriptions ? (value / stats.total_inscriptions) * 100 : 0;
            return (
              <div className="bar-row" key={key}>
                <span className="bar-label">{label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${percent}%`, background: color }} />
                </div>
                <span className="bar-value">{value}</span>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <h3>Formations les plus suivies</h3>
          {stats.top_formations.length === 0 && <p>Aucune formation.</p>}
          {stats.top_formations.map((f) => (
            <div className="bar-row" key={f.id}>
              <span className="bar-label">{f.titre}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(f.inscriptions_count / maxTop) * 100}%`, background: '#8b5cf6' }}
                />
              </div>
              <span className="bar-value">{f.inscriptions_count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
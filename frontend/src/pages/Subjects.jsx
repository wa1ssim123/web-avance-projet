import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getImageUrl } from "../services/api";
import { subjectService } from "../services/entityService";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAll();
      setSubjects(data?.data?.subjects || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => subjects.filter((s) => `${s.nom} ${s.code}`.toLowerCase().includes(search.toLowerCase())), [subjects, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    try {
      await subjectService.remove(id);
      setMessage("Matière supprimée.");
      loadData();
    } catch (e) { setError(e.message); }
  };

  return <AppLayout title="Matières">
    <section className="toolbar">
      <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." />
      <Link to="/subjects/add" className="primary-btn">Ajouter</Link>
    </section>
    {message && <p className="success-text">{message}</p>}
    {error && <p className="error-text">{error}</p>}
    {loading ? <section className="state-box">Chargement...</section> : filtered.length === 0 ? <section className="state-box">Aucune matière trouvée.</section> :
      <section className="card-grid">
        {filtered.map((subject) => <article className="entity-card" key={subject.id}>
          <div className="card-image-wrap">{subject.image ? <img className="card-image" src={getImageUrl(subject.image)} alt={subject.nom} /> : <div className="image-fallback">Aucune image</div>}</div>
          <div className="card-body">
            <h3>{subject.nom}</h3>
            <p className="entity-badge">{subject.code}</p>
            <p className="card-description">{subject.description || "Aucune description"}</p>
            <p className="muted-text">Département: {subject.Department?.nom || "—"}</p>
            <p className="muted-text">Laboratoire: {subject.Laboratory?.nom || "—"}</p>
          </div>
          <div className="card-actions">
            <Link className="ghost-btn" to={`/subjects/${subject.id}`}>Voir</Link>
            <Link className="ghost-btn" to={`/subjects/edit/${subject.id}`}>Modifier</Link>
            <button className="danger-btn" onClick={() => handleDelete(subject.id)}>Supprimer</button>
          </div>
        </article>)}
      </section>}
  </AppLayout>;
}

export default Subjects;

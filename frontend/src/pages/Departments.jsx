import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getImageUrl } from "../services/api";
import { departmentService } from "../services/entityService";

function Departments() {
  const [items, setItems] = useState([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  const load = async () => { try { setLoading(true); const res = await departmentService.getAll(); setItems(res?.data?.departments || []); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => items.filter((i) => `${i.nom} ${i.domaine}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const del = async (id) => { if (!window.confirm("Supprimer ce département ?")) return; try { await departmentService.remove(id); setMessage("Département supprimé."); load(); } catch (e) { setError(e.message); } };
  return <AppLayout title="Départements"><section className="toolbar"><input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." /><Link className="primary-btn" to="/departments/add">Ajouter</Link></section>{message && <p className="success-text">{message}</p>}{error && <p className="error-text">{error}</p>}{loading ? <section className="state-box">Chargement...</section> : filtered.length === 0 ? <section className="state-box">Aucun département.</section> : <section className="card-grid">{filtered.map((item) => <article className="entity-card" key={item.id}><div className="card-image-wrap">{item.image ? <img className="card-image" src={getImageUrl(item.image)} alt={item.nom} /> : <div className="image-fallback">Aucune image</div>}</div><div className="card-body"><h3>{item.nom}</h3><p className="entity-badge">{item.domaine}</p><p className="card-description">{item.histoire || "Aucune histoire"}</p></div><div className="card-actions"><Link className="ghost-btn" to={`/departments/${item.id}`}>Voir</Link><Link className="ghost-btn" to={`/departments/edit/${item.id}`}>Modifier</Link><button className="danger-btn" onClick={() => del(item.id)}>Supprimer</button></div></article>)}</section>}</AppLayout>;
}

export default Departments;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getImageUrl } from "../services/api";
import { departmentService } from "../services/entityService";

export default function DepartmentDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { departmentService.getById(id).then((r) => setItem(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  return <AppLayout title="Détail département">{loading ? <section className="state-box">Chargement...</section> : error ? <section className="state-box error-text">{error}</section> : <section className="details-card"><div className="details-image-wrap">{item.image ? <img className="details-image" src={getImageUrl(item.image)} alt={item.nom} /> : <div className="image-fallback large">Aucune image</div>}</div><div className="details-content"><h2>{item.nom}</h2><p><strong>Domaine :</strong> {item.domaine}</p><p><strong>Histoire :</strong> {item.histoire || "—"}</p><div className="form-actions"><Link to="/departments" className="ghost-btn">Retour</Link><Link to={`/departments/edit/${item.id}`} className="primary-btn">Modifier</Link></div></div></section>}</AppLayout>;
}

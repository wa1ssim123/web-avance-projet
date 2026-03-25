import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getImageUrl } from "../services/api";
import { subjectService } from "../services/entityService";

function SubjectDetails() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { subjectService.getById(id).then((r) => setSubject(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  return <AppLayout title="Détail matière">{loading ? <section className="state-box">Chargement...</section> : error ? <section className="state-box error-text">{error}</section> :
    <section className="details-card">
      <div className="details-image-wrap">{subject.image ? <img className="details-image" src={getImageUrl(subject.image)} alt={subject.nom} /> : <div className="image-fallback large">Aucune image</div>}</div>
      <div className="details-content">
        <h2>{subject.nom}</h2>
        <p><strong>Code :</strong> {subject.code}</p>
        <p><strong>Description :</strong> {subject.description || "—"}</p>
        <p><strong>Statut :</strong> {subject.statut}</p>
        <p><strong>Département :</strong> {subject.Department?.nom || "—"}</p>
        <p><strong>Laboratoire :</strong> {subject.Laboratory?.nom || "—"}</p>
        <div className="form-actions"><Link to="/subjects" className="ghost-btn">Retour</Link><Link to={`/subjects/edit/${subject.id}`} className="primary-btn">Modifier</Link></div>
      </div>
    </section>}
  </AppLayout>;
}

export default SubjectDetails;

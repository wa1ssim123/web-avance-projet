import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { departmentService, laboratoryService, subjectService } from "../services/entityService";

function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ nom: "", code: "", description: "", statut: "requis", DepartmentId: "", LaboratoryId: "" });
  const [departments, setDepartments] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [depRes, labRes] = await Promise.all([departmentService.getAll(), laboratoryService.getAll()]);
        setDepartments(depRes?.data?.departments || []);
        setLaboratories(labRes?.data?.laboratories || []);
        if (isEdit) {
          const res = await subjectService.getById(id);
          const item = res.data;
          setForm({ nom: item.nom || "", code: item.code || "", description: item.description || "", statut: item.statut || "requis", DepartmentId: item.DepartmentId ? String(item.DepartmentId) : "", LaboratoryId: item.LaboratoryId ? String(item.LaboratoryId) : "" });
        }
      } catch (e) { setServerError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [id, isEdit]);

  const validate = () => {
    const next = {};
    if (!form.nom.trim()) next.nom = "Nom obligatoire";
    if (!form.code.trim()) next.code = "Code obligatoire";
    if (!form.DepartmentId) next.DepartmentId = "Choisir un département";
    if (!form.LaboratoryId) next.LaboratoryId = "Choisir un laboratoire";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      setSaving(true);
      const payload = { ...form, DepartmentId: Number(form.DepartmentId), LaboratoryId: Number(form.LaboratoryId) };
      if (isEdit) await subjectService.update(id, payload);
      else await subjectService.create(payload);
      navigate("/subjects");
    } catch (e) { setServerError(e.message); }
    finally { setSaving(false); }
  };

  return <AppLayout title={isEdit ? "Modifier matière" : "Ajouter matière"}>
    {loading ? <section className="state-box">Chargement...</section> : <section className="form-card"><form className="entity-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div><label>Nom</label><input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />{errors.nom && <p className="error-text">{errors.nom}</p>}</div>
        <div><label>Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />{errors.code && <p className="error-text">{errors.code}</p>}</div>
        <div className="full-width"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><label>Statut</label><select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}><option value="requis">requis</option><option value="optionnel">optionnel</option></select></div>
        <div><label>Département</label><select value={form.DepartmentId} onChange={(e) => setForm({ ...form, DepartmentId: e.target.value })}><option value="">-- Choisir --</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}</select>{errors.DepartmentId && <p className="error-text">{errors.DepartmentId}</p>}</div>
        <div><label>Laboratoire</label><select value={form.LaboratoryId} onChange={(e) => setForm({ ...form, LaboratoryId: e.target.value })}><option value="">-- Choisir --</option>{laboratories.map((l) => <option key={l.id} value={l.id}>{l.nom}</option>)}</select>{errors.LaboratoryId && <p className="error-text">{errors.LaboratoryId}</p>}</div>
      </div>
      {serverError && <p className="error-text">{serverError}</p>}
      <div className="form-actions"><Link to="/subjects" className="ghost-btn">Retour</Link><button className="primary-btn" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</button></div>
    </form></section>}
  </AppLayout>;
}

export default SubjectForm;

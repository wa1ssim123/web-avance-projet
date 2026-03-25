import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { roleService } from "../services/entityService";

function Roles() {
  const emptyForm = { titre: "", description: "" };
  const [items, setItems] = useState([]); const [form, setForm] = useState(emptyForm); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  const load = async () => { try { setLoading(true); const res = await roleService.getAll(); setItems(res?.data || []); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); if (!form.titre.trim()) return setError("Titre obligatoire."); try { setSaving(true); await roleService.create(form); setMessage("Rôle ajouté."); setForm(emptyForm); load(); } catch (e) { setError(e.message); } finally { setSaving(false); } };
  const remove = async (id) => { if (!window.confirm("Supprimer ce rôle ?")) return; try { await roleService.remove(id); setMessage("Rôle supprimé."); load(); } catch (e) { setError(e.message); } };
  return <AppLayout title="Rôles"><section className="form-card"><form className="entity-form" onSubmit={submit}><div className="form-grid"><div><label>Titre</label><input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div><div><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div></div>{message && <p className="success-text">{message}</p>}{error && <p className="error-text">{error}</p>}<div className="form-actions"><button className="primary-btn" disabled={saving}>{saving ? "Enregistrement..." : "Ajouter"}</button></div></form></section>{loading ? <section className="state-box">Chargement...</section> : <section className="card-grid" style={{ marginTop: 20 }}>{items.map((it) => <article className="entity-card" key={it.id}><div className="card-body"><h3>{it.titre}</h3><p className="card-description">{it.description || "Aucune description"}</p></div><div className="card-actions"><button className="danger-btn" onClick={() => remove(it.id)}>Supprimer</button></div></article>)}</section>}</AppLayout>;
}

export default Roles;

"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Layers, Plus, Edit2, Trash2, ChevronRight, Folder } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  icon?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/categories", newCat);
      toast.success("Category added");
      setNewCat({ name: '', slug: '', icon: '' });
      setIsAdding(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This might affect products in this category.")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Categories</h1>
          <p style={{ color: 'var(--text-muted)' }}>Organize your marketplace hierarchy</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn btn-primary">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isAdding && (
        <div className="card" style={{ marginBottom: '24px', border: '2px solid var(--primary)' }}>
          <form onSubmit={addCategory} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Name</label>
              <input 
                type="text" 
                className="input" 
                value={newCat.name} 
                onChange={e => setNewCat({...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Slug</label>
              <input type="text" className="input" value={newCat.slug} onChange={e => setNewCat({...newCat, slug: e.target.value})} required />
            </div>
            <div style={{ flex: 0.5 }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Icon (Emoji)</label>
              <input type="text" className="input" value={newCat.icon} onChange={e => setNewCat({...newCat, icon: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              transition: 'all 0.2s'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'rgba(99, 102, 241, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {cat.icon || <Folder size={20} color="var(--primary)" />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, fontSize: '15px' }}>{cat.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{cat.slug}</p>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-icon-sm"><Edit2 size={14} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="btn btn-icon-sm" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

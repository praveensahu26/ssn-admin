import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DataTable, { type ColumnConfig, type ActionConfig } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/spinner';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { inputClass, labelClass } from '@/lib/formStyles';
import { categoryServices, type Category } from '@/services/categoryServices';

const EditIcon: React.FC<{ className?: string }> = ({ className }) => <Pencil className={className} />;
const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => <Trash2 className={className} />;

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryServices.list();
      setCategories(response.data?.categories ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description || '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const payload = { name: form.name, description: form.description || null };
      if (editingId) {
        await categoryServices.update(editingId, payload);
      } else {
        await categoryServices.create(payload);
      }
      setIsFormOpen(false);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryServices.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete category');
    }
  };

  const columns: ColumnConfig<Category>[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description', render: (row) => row.description || '—' },
  ];

  const actions: ActionConfig<Category>[] = [
    { icon: EditIcon, onClick: openEditForm, tooltip: 'Edit' },
    { icon: DeleteIcon, onClick: (row) => handleDelete(row.id), tooltip: 'Delete' },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-poppins text-md-custom font-medium text-text-secondary">Categories</h1>
          <SubmitButton leftIcon={<Plus className="h-4 w-4" />} onClick={openCreateForm}>
            Create Category
          </SubmitButton>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm-custom font-medium text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-[#DCE5EF] bg-white">
            <Spinner size={30} />
          </div>
        ) : (
          <DataTable
            title="Categories"
            data={categories}
            columns={columns}
            actions={actions}
            searchKeys={['name']}
            searchPlaceholder="Search categories"
          />
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="w-full max-w-[420px] rounded-xl border border-[#DCE5EF] bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-base-custom font-medium text-text-primary">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                type="button"
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE5EF]"
                onClick={() => setIsFormOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <label className="flex flex-col">
                <span className={labelClass}>Name</span>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className={labelClass}>Description</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>

              <SubmitButton type="submit" isLoading={isSaving} fullWidth>
                {editingId ? 'Save Changes' : 'Create Category'}
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default CategoriesPage;

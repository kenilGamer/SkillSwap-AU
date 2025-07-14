"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/Button";
import userStore from '@/store/user.store';
import { useSnapshot } from 'valtio';
import { Badge } from '@/components/shadcn/ui/badge';
import { FiBookOpen, FiEdit2, FiTrash2, FiX, FiPlus, FiCopy, FiMoreVertical } from 'react-icons/fi';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/shadcn/ui/popover';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/shadcn/ui/dialog';

const POPULAR_TAGS = ["js", "css", "react", "nodejs", "api", "#project", "typescript", "mongodb", "frontend", "backend"];

interface Resource {
  _id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  owner: { name: string; image?: string; _id?: string };
  createdAt: string;
  updatedAt: string;
}

export default function ResourcesPage() {
  const snap = useSnapshot(userStore);
  const currentUserId = snap.user?._id || '';

  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    tags: [] as string[],
    tagInput: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    link: "",
    tags: [] as string[],
    tagInput: "",
  });
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const didFetch = useRef(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    const res = await fetch("/api/forum/resources", { cache: "no-store" });
    const data = await res.json();
    setResources(data);
    setLoading(false);
  }

  function addTag(tag: string, isEdit = false) {
    tag = tag.trim();
    if (!tag) return;
    if (isEdit) {
      if (editForm.tags.includes(tag)) return;
      setEditForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: "" }));
    } else {
      if (form.tags.includes(tag)) return;
      setForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: "" }));
    }
  }

  function removeTag(tag: string, isEdit = false) {
    if (isEdit) {
      setEditForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
    } else {
      setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
    }
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>, isEdit = false) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = isEdit ? editForm.tagInput : form.tagInput;
      if (value) addTag(value, isEdit);
    }
    if (e.key === "Backspace") {
      const value = isEdit ? editForm.tagInput : form.tagInput;
      if (!value) {
        if (isEdit && editForm.tags.length > 0) {
          setEditForm(f => ({ ...f, tags: f.tags.slice(0, -1) }));
        } else if (!isEdit && form.tags.length > 0) {
          setForm(f => ({ ...f, tags: f.tags.slice(0, -1) }));
        }
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/forum/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: form.tags }),
    });
    if (res.ok) {
      const newResource = await res.json();
      setForm({ title: "", description: "", link: "", tags: [], tagInput: "" });
      setResources(prev => [newResource, ...prev]);
    }
    setSubmitting(false);
  }

  function startEdit(resource: Resource) {
    setEditingId(resource._id);
    setEditForm({
      title: resource.title,
      description: resource.description,
      link: resource.link,
      tags: resource.tags,
      tagInput: "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ title: "", description: "", link: "", tags: [], tagInput: "" });
  }

  async function handleEditSave(id: string) {
    setSubmitting(true);
    const res = await fetch("/api/forum/resources", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm, tags: editForm.tags }),
    });
    if (res.ok) {
      const updatedResource = await res.json();
      setResources(prev => prev.map(r => r._id === id ? updatedResource : r));
      setEditingId(null);
      setEditForm({ title: "", description: "", link: "", tags: [], tagInput: "" });
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    setSubmitting(true);
    const res = await fetch("/api/forum/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setResources(prev => prev.filter(r => r._id !== id));
    }
    setSubmitting(false);
  }

  function handleCopy(link: string, id: string) {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  // Filtered resources by search
  const filteredResources = useMemo(() => {
    if (!search) return resources;
    return resources.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }, [resources, search]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 relative">
      {/* Floating Share Resource Button (responsive) */}
      <div>
        {/* Desktop pill button top right */}
        <div className="hidden md:block fixed right-8 top-8 z-30">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-6 py-3 font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all" aria-label="Share Resource">
                <FiPlus className="inline mr-2 -ml-1 text-lg" /> Share Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>Share a New Resource</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-700">Title</label>
                    <input
                      className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300"
                      placeholder="Resource Title"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-700">Link</label>
                    <input
                      className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300"
                      placeholder="https://..."
                      value={form.link}
                      onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-700">Description</label>
                  <textarea
                    className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300"
                    placeholder="What is this resource about? Why is it useful?"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-700">Tags</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {form.tags.map((tag, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-700 font-medium flex items-center gap-1 animate-fade-in">
                        {tag}
                        <button type="button" className="ml-1" aria-label={`Remove tag ${tag}`} onClick={() => removeTag(tag)}>
                          <FiX className="text-blue-400 text-xs" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      className="flex-1 min-w-[120px] border-none focus:ring-0 outline-none p-1"
                      type="text"
                      placeholder="Add tag and press Enter"
                      value={form.tagInput}
                      onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                      onKeyDown={e => handleTagInputKeyDown(e)}
                      maxLength={20}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {POPULAR_TAGS.filter(pt => !form.tags.includes(pt)).map((pt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-100 hover:bg-blue-100 transition"
                        onClick={() => addTag(pt)}
                      >
                        <FiPlus className="inline mr-1 text-xs" />{pt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="px-8 py-2 rounded-full font-semibold text-md">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" loading={submitting} className="px-8 py-2 rounded-full font-semibold text-md">
                    {submitting ? "Sharing..." : "Share Resource"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Mobile FAB bottom right */}
        <div className="md:hidden fixed right-5 bottom-5 z-30">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center text-3xl" aria-label="Share Resource">
                <FiPlus />
                <span className="sr-only">Share Resource</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>Share a New Resource</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-700">Title</label>
                    <input
                      className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300"
                      placeholder="Resource Title"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-700">Link</label>
                    <input
                      className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300"
                      placeholder="https://..."
                      value={form.link}
                      onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-700">Description</label>
                  <textarea
                    className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300"
                    placeholder="What is this resource about? Why is it useful?"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-700">Tags</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {form.tags.map((tag, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-700 font-medium flex items-center gap-1 animate-fade-in">
                        {tag}
                        <button type="button" className="ml-1" aria-label={`Remove tag ${tag}`} onClick={() => removeTag(tag)}>
                          <FiX className="text-blue-400 text-xs" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      className="flex-1 min-w-[120px] border-none focus:ring-0 outline-none p-1"
                      type="text"
                      placeholder="Add tag and press Enter"
                      value={form.tagInput}
                      onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                      onKeyDown={e => handleTagInputKeyDown(e)}
                      maxLength={20}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {POPULAR_TAGS.filter(pt => !form.tags.includes(pt)).map((pt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-100 hover:bg-blue-100 transition"
                        onClick={() => addTag(pt)}
                      >
                        <FiPlus className="inline mr-1 text-xs" />{pt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="px-8 py-2 rounded-full font-semibold text-md">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" loading={submitting} className="px-8 py-2 rounded-full font-semibold text-md">
                    {submitting ? "Sharing..." : "Share Resource"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-blue-100 rounded-full p-4 mb-3">
          <FiBookOpen className="text-blue-600 text-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Resource Sharing</h1>
        <p className="text-lg text-slate-600 max-w-2xl">Share your favorite tutorials, articles, and learning resources with the community. Help others grow and discover new knowledge!</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          className="w-full max-w-md border border-blue-200 rounded-full px-5 py-3 text-lg focus:ring-2 focus:ring-blue-300 shadow-sm transition-all"
          type="search"
          placeholder="Search resources by title, description, or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Shared Resources Section */}
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Shared Resources</h2>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-blue-500 animate-pulse">Loading resources...</span>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          {/* SVG illustration for empty state */}
          <svg width="120" height="120" fill="none" viewBox="0 0 120 120" className="mb-4">
            <rect width="120" height="120" rx="24" fill="#e0e7ff"/>
            <path d="M40 80h40M40 60h40M40 40h40" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="60" cy="100" r="6" fill="#6366f1"/>
          </svg>
          <div className="text-slate-500 text-lg">No resources shared yet. Be the first to contribute!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((r) => (
            <div
              key={r._id}
              className={`relative bg-white rounded-2xl shadow-md p-6 flex flex-col h-full border border-blue-50 transition-all hover:shadow-xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group duration-200 animate-fade-in`}
              style={{ minHeight: 220 }}
            >
              <div className="flex items-center mb-3">
                {/* Tooltip on avatar */}
                <div
                  className="w-9 h-9 rounded-full mr-3 border-2 border-blue-100 overflow-hidden cursor-pointer"
                  title={r.owner?.name || "Unknown"}
                >
                  {r.owner?.image ? (
                    <img src={r.owner.image} alt={r.owner.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-200 text-lg font-bold text-blue-700">
                      {r.owner?.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-blue-700">{r.owner?.name || "Unknown"}</span>
                  <span className="ml-2 text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                {/* Popover for actions */}
                {r.owner && r.owner._id === currentUserId && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-blue-50 transition" aria-label="More actions">
                        <FiMoreVertical className="text-blue-400 text-lg" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-2 flex flex-col gap-1">
                      <Button onClick={() => startEdit(r)} type="button" size="sm" className="flex items-center gap-2 w-full justify-start px-2 py-1"><FiEdit2 /> Edit</Button>
                      <Button onClick={() => handleDelete(r._id)} type="button" variant="destructive" size="sm" className="flex items-center gap-2 w-full justify-start px-2 py-1"><FiTrash2 /> Delete</Button>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              {editingId === r._id ? (
                <div className="space-y-3 animate-fade-in">
                  <input
                    className="w-full border border-blue-200 p-2 rounded"
                    value={editForm.title}
                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  />
                  <textarea
                    className="w-full border border-blue-200 p-2 rounded"
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  />
                  <input
                    className="w-full border border-blue-200 p-2 rounded"
                    value={editForm.link}
                    onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))}
                  />
                  {/* Edit tags as pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {editForm.tags.map((tag, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-700 font-medium flex items-center gap-1 animate-fade-in">
                        {tag}
                        <button type="button" className="ml-1" aria-label={`Remove tag ${tag}`} onClick={() => removeTag(tag, true)}>
                          <FiX className="text-blue-400 text-xs" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      className="flex-1 min-w-[120px] border-none focus:ring-0 outline-none p-1"
                      type="text"
                      placeholder="Add tag and press Enter"
                      value={editForm.tagInput}
                      onChange={e => setEditForm(f => ({ ...f, tagInput: e.target.value }))}
                      onKeyDown={e => handleTagInputKeyDown(e, true)}
                      maxLength={20}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {POPULAR_TAGS.filter(pt => !editForm.tags.includes(pt)).map((pt, i) => (
                      <button
                        key={i}
                        type="button"
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-100 hover:bg-blue-100 transition"
                        onClick={() => addTag(pt, true)}
                      >
                        <FiPlus className="inline mr-1 text-xs" />{pt}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleEditSave(r._id)} loading={submitting} className="px-6">Save</Button>
                    <Button onClick={cancelEdit} type="button" variant="secondary" className="px-6">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-blue-600 mb-1 break-words">{r.title}</h3>
                  <p className="mb-2 text-gray-700 break-words">{r.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all font-medium hover:text-blue-700 transition-all">
                      {r.link}
                    </a>
                    <button
                      className="ml-1 p-1 rounded hover:bg-blue-50 transition"
                      aria-label="Copy link"
                      onClick={() => handleCopy(r.link, r._id)}
                    >
                      <FiCopy className={`text-blue-400 text-base ${copiedId === r._id ? 'animate-pulse' : ''}`} />
                    </button>
                    {copiedId === r._id && <span className="text-xs text-green-600 ml-1 animate-fade-in">Copied!</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.tags.map((tag, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-700 font-medium animate-fade-in">{tag}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
} 
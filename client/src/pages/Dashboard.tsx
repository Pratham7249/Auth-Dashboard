import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Edit2, Star, StickyNote, Search, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axios';
import type { Note } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const noteSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
});

type NoteFormData = z.infer<typeof noteSchema>;

const Dashboard: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema),
    });

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes');
            setNotes(data);
        } catch (error) {
            toast.error('Failed to fetch notes');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const onSubmit = async (data: NoteFormData) => {
        try {
            if (editingNote) {
                const { data: updatedNote } = await api.put(`/notes/${editingNote._id}`, data);
                setNotes(notes.map(n => n._id === editingNote._id ? updatedNote : n));
                toast.success('Note updated');
            } else {
                const { data: newNote } = await api.post('/notes', data);
                setNotes([newNote, ...notes]);
                toast.success('Note created');
            }
            closeModal();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const deleteNote = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
            toast.success('Note deleted');
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    const toggleFavorite = async (note: Note) => {
        try {
            const { data: updatedNote } = await api.put(`/notes/${note._id}`, {
                ...note,
                isFavorite: !note.isFavorite
            });
            setNotes(notes.map(n => n._id === note._id ? updatedNote : n));
            toast.success(updatedNote.isFavorite ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) {
            toast.error('Failed to update favorite status');
        }
    };

    const copyToClipboard = (note: Note) => {
        navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
        setCopiedId(note._id);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openModal = (note?: Note) => {
        if (note) {
            setEditingNote(note);
            setValue('title', note.title);
            setValue('content', note.content);
        } else {
            setEditingNote(null);
            reset({ title: '', content: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        reset();
    };

    if (isLoading) return <div className="p-8 text-center">Loading notes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Notes</h2>
                    <p className="text-slate-500">Manage your ideas and tasks</p>
                </div>
                <Button onClick={() => openModal()} className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Note</span>
                </Button>
            </div>

            <div className="mb-8 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400" size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <StickyNote size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">
                        {searchTerm ? 'No matching notes found' : 'No notes yet'}
                    </h3>
                    <p className="text-slate-500 mb-4">
                        {searchTerm ? 'Try a different search term' : 'Create your first note to get started'}
                    </p>
                    {!searchTerm && <Button onClick={() => openModal()}>Create Note</Button>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div key={note._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                                        {note.title}
                                    </h3>
                                    <button
                                        onClick={() => toggleFavorite(note)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={16}
                                            className={note.isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-300"}
                                        />
                                    </button>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => copyToClipboard(note)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Copy Content"
                                    >
                                        {copiedId === note._id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                    <button
                                        onClick={() => openModal(note)}
                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteNote(note._id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-slate-600 line-clamp-4 text-sm whitespace-pre-wrap mb-4 flex-grow">
                                {note.content}
                            </p>

                            <div className="pt-4 border-t border-slate-100 space-y-1.5">
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span className="font-medium">Created:</span>
                                    <span>{new Date(note.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Updated:</span>
                                    <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-amber-600/70 pt-1">
                                    <span className="bg-amber-50 px-2 py-0.5 rounded-full">
                                        {note.content.split(/\s+/).filter(Boolean).length} words
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingNote ? 'Edit Note' : 'Create Note'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Title"
                        {...register('title')}
                        error={errors.title?.message}
                    />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                        <textarea
                            {...register('content')}
                            rows={5}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.content ? 'border-red-500' : 'border-slate-300'
                                }`}
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingNote ? 'Save Changes' : 'Create Note'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// Icon import helper since I missed importing StickyNote above


export default Dashboard;

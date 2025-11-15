import React, { useState, useRef } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TrixEditor from "@/components/TrixEditor";
import Swal from "sweetalert2";
import { X, Upload } from "lucide-react";

export default function TodoForm({ todo = null, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: todo?.title || "",
        description: todo?.description || "",
        cover: null,
    });
    const [preview, setPreview] = useState(todo?.cover || null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                cover: file,
            }));

            // Show preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            cover: null,
        }));
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = todo ? "put" : "post";
            const url = todo ? `/todos/${todo.id}` : "/todos";

            // Helper function to make the fetch request
            const makeRequest = async () => {
                const data = new FormData();
                data.append("title", formData.title);
                data.append("description", formData.description);
                if (formData.cover instanceof File) {
                    data.append("cover", formData.cover);
                }

                // For PUT requests with FormData, append _method field
                if (method === "put") {
                    data.append("_method", "PUT");
                }

                // Get fresh CSRF token from meta tag each time
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (csrfToken) {
                    data.append("_token", csrfToken);
                }

                const headers = {
                    "X-Requested-With": "XMLHttpRequest",
                };
                if (csrfToken) {
                    headers['X-CSRF-TOKEN'] = csrfToken;
                }

                const response = await fetch(url, {
                    method: "POST",
                    body: data,
                    headers,
                    credentials: 'include',
                });

                return response;
            };

            // Make the initial request
            let response = await makeRequest();

            // If we get 419 (CSRF mismatch), refresh the page's CSRF token by fetching the home page, then retry
            if (response.status === 419) {
                try {
                    // Fetch home page to refresh CSRF token in the session
                    await fetch('/', { credentials: 'include' });
                    // Retry the request with refreshed CSRF token
                    response = await makeRequest();
                } catch (e) {
                    // If refresh fails, use original 419 response
                }
            }

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: result.message,
                    confirmButtonText: "OK",
                });
                onSuccess?.(result.todo);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: result.message || "Terjadi kesalahan",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.message || "Terjadi kesalahan",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">
                {todo ? "Edit Todo" : "Buat Todo Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Judul <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Masukkan judul todo"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Catatan
                    </label>
                    <TrixEditor
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Tulis catatan untuk todo ini..."
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Gambar Cover
                    </label>

                    {preview ? (
                        <div className="relative inline-block">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full max-w-sm h-48 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                                Klik untuk upload gambar
                            </p>
                        </button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading
                            ? "Menyimpan..."
                            : todo
                            ? "Perbarui"
                            : "Buat"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </Card>
    );
}

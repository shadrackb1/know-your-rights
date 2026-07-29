const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file: File, folder?: string) {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  if (folder) form.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error((await res.json()).error?.message || 'Upload failed');
  return res.json() as Promise<{ public_id: string; secure_url: string }>;
}

export function getCloudinaryUrl(id: string, opts?: { w?: number; h?: number }) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${opts?.w || 800},h_${opts?.h || 600},q_auto,f_auto/${id}`;
}

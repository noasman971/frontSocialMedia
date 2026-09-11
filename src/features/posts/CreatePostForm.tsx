import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { createPost } from "./posts.api";

/*
  Pseudodo-code:
  
  [1] User type text (content) OR choose image file (imageFile).
  [2] if user click image -> make local preview with URL.createObjectURL(file).
  [3] When we submit (handleSubmit):
      [a] check if content or image is present (cant be both empty!).
      [b] set isSubmitting = true (disable buttons, show loading).
      [c] make new FormData() and append text + optional image file.
      [d] call api function createPost(formData) with token.
      [e] if error -> setErrorMessage(error).
      [f] if success -> clear input text and image preview.
      [g] call onPostCreated() callback ! (tell parent HomePage to reload feed).
*/

interface CreatePostFormProps {
  // Callback called when post is successfully created
  readonly onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  // [1] local state for user text and chosen file
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // [2] Image Selection: create object url for preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // [3] Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();

    // [a] Cant be both empty
    if (!trimmed && !imageFile) {
      return;
    }

    // [b] start submitting
    setIsSubmitting(true);
    setErrorMessage(null);

    // [c] build formData
    const formData = new FormData();
    formData.append("content", trimmed);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // [d] api call
    const res = await createPost(formData);

    setIsSubmitting(false);

    // [e] handle error
    if (!res.ok) {
      setErrorMessage(res.error);
      return;
    }

    // [f] reset form
    setContent("");
    handleRemoveImage();

    // [g] trigger parent callback
    onPostCreated();
  };

  return (
    <div className="bg-elevated border border-border rounded-xl p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Textarea for post content */}
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Quoi de neuf ?"
          disabled={isSubmitting}
          className="w-full bg-bg border border-border rounded-lg p-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-secondary transition resize-none"
        />

        {/* Selected image preview if there is any*/}
        {imagePreview && (
          <div className="relative rounded-lg overflow-hidden border border-border max-h-60 bg-bg flex items-center justify-center">
            <img
              src={imagePreview}
              alt="Aperçu de l'image"
              className="max-h-60 w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
              className="absolute top-2 right-2 bg-bg/80 hover:bg-bg text-text-primary p-1.5 rounded-full text-xs font-bold transition cursor-pointer"
              title="Supprimer l'image"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <p className="text-xs text-error font-medium">{errorMessage}</p>
        )}

        {/* Image picker & Submit button */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="hidden"
              id="post-image-input"
            />
            <label
              htmlFor="post-image-input"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{imageFile ? "Changer la photo" : "Ajouter une photo"}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !imageFile)}
            className="px-4 py-1.5 bg-btn-primary hover:bg-btn-primary-hover text-btn-text text-xs font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Publication..." : "Publier"}
          </button>
        </div>
      </form>
    </div>
  );
}

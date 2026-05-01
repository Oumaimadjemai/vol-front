// PassportUploader.jsx - Fixed version
import { useRef, useState, useEffect } from 'react';
import {
  FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle,
  FaTrash, FaExclamationTriangle, FaRedo
} from 'react-icons/fa';

export function PassportUploader({
  voyageurId,
  initialPreview = null,
  initialVerified = false,
  onVerified,
  onRemove,
}) {
  const [preview, setPreview] = useState(null);
  const [verified, setVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mrzErrors, setMrzErrors] = useState([]);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef(null);

  // Initialize from props
  useEffect(() => {
    if (!initialized && initialPreview) {
      setPreview(initialPreview);
      setVerified(initialVerified);
      setInitialized(true);
      // If there's an existing image that's not verified, show it in error state
      if (!initialVerified && initialPreview) {
        setError('Les données MRZ ne correspondent pas.');
      }
    }
  }, [initialPreview, initialVerified, initialized]);

  const reset = () => {
    setPreview(null);
    setVerified(false);
    setError('');
    setMrzErrors([]);
    setInitialized(true);
    onVerified?.(false);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  const toPreview = (file) =>
    new Promise((res) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.readAsDataURL(file);
    });

  const processFile = async (file) => {
    if (!file?.type?.startsWith('image/')) {
      setError('Format invalide. Utilisez JPEG ou PNG.');
      return;
    }

    setError('');
    setMrzErrors([]);
    setVerified(false);
    setInitialized(true);
    setPreview(await toPreview(file));

    if (!voyageurId) {
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append('passport_image', file);

      const { default: axiosInstance } = await import('../../../api/axiosInstance');
      await axiosInstance.patch(
        `/auth-service/auth/voyageurs/${voyageurId}/passport/`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setVerified(true);
      onVerified?.(true);
    } catch (err) {
      const data = err.response?.data;
      if (data?.mrz_validation) {
        const list = Array.isArray(data.mrz_validation)
          ? data.mrz_validation
          : [data.mrz_validation];
        setMrzErrors(list);
        setError('Les données MRZ ne correspondent pas.');
      } else if (data?.passport_image) {
        setError(
          typeof data.passport_image === 'string'
            ? data.passport_image
            : 'Impossible de lire le MRZ.'
        );
      } else {
        setError('Erreur lors de la vérification. Réessayez.');
      }
      setVerified(false);
      onVerified?.(false);
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => e.preventDefault();
  const onDragEnter = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const badge = verified
    ? <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">✓ Vérifié</span>
    : error && !preview
      ? null
      : <span className="ml-2 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Obligatoire</span>;

  // If there's an existing unverified image, show the error state with the image
  if (!uploading && !verified && preview && error) {
    return (
      <div className="mb-6">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          Photo du passeport * {badge}
        </label>
        <div className="border-2 border-red-400 bg-red-50 rounded-xl p-5 text-center">
          <FaTimesCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-700 mb-2">{error}</p>

          {mrzErrors.length > 0 && (
            <div className="text-left bg-white rounded-lg p-3 mb-3 border border-red-200 max-h-28 overflow-y-auto">
              {mrzErrors.map((e, i) => (
                <p key={i} className="text-xs text-red-600 leading-relaxed">• {e}</p>
              ))}
            </div>
          )}

          <img
            src={preview}
            alt="Passeport"
            className="max-h-32 mx-auto rounded-lg opacity-60 border border-red-200 mb-3"
          />

          <div className="flex justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              <FaRedo className="w-3 h-3" /> Réessayer
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
            >
              <FaTrash className="w-3 h-3" /> Supprimer
            </button>
          </div>

          {/* Hidden input for retry */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={(e) => processFile(e.target.files?.[0])}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        Photo du passeport * {badge}
      </label>

      {/* ══════════ IDLE / UPLOAD AREA ══════════ */}
      {!uploading && !verified && !preview && (
        <>
          <div
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
              transition-all duration-200 select-none
              ${dragging
                ? 'border-[#00C0E8] bg-[#E0F7FD] scale-[1.02]'
                : 'border-gray-300 bg-gray-50 hover:border-[#00C0E8] hover:bg-[#F0FBFE]'}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => processFile(e.target.files?.[0])}
            />
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
              ${dragging ? 'bg-[#00C0E8]/20' : 'bg-gray-100'}
              transition-all duration-200
            `}>
              <FaUpload className={`w-5 h-5 ${dragging ? 'text-[#00C0E8]' : 'text-gray-400'}`} />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {dragging ? 'Déposez ici...' : 'Cliquez ou glissez-déposez une photo'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG · PNG · JPG</p>
          </div>

          <div className="flex items-start gap-2 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <FaExclamationTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Passeport non vérifié — requis pour continuer.
            </p>
          </div>
        </>
      )}

      {/* ══════════ UPLOADING ══════════ */}
      {uploading && (
        <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-10 text-center">
          <FaSpinner className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-blue-700">Extraction MRZ en cours…</p>
          <p className="text-xs text-blue-400 mt-1">Analyse de l'image du passeport</p>
        </div>
      )}

      {/* ══════════ VERIFIED ══════════ */}
      {!uploading && verified && preview && (
        <div className="border-2 border-green-400 bg-green-50 rounded-xl p-5 text-center">
          <FaCheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-green-700 mb-1">Passeport vérifié !</p>
          <p className="text-xs text-green-500 mb-3">
            MRZ · Nom · Date de naissance · N° passeport
          </p>
          <img
            src={preview}
            alt="Passeport vérifié"
            className="max-h-44 mx-auto rounded-lg border-2 border-green-300 object-cover shadow-sm"
          />
          <button
            onClick={reset}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5
                       bg-red-100 text-red-700 rounded-lg text-xs font-medium
                       hover:bg-red-200 transition-colors"
          >
            <FaTrash className="w-3 h-3" /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
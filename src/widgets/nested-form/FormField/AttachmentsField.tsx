import { useEffect, useRef, useState } from 'react';
import { Icon, useGrist, decodeRefList } from '@lib';
import type { AttachmentMeta } from '@lib';

interface AttachmentsFieldProps {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  readOnly?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
}

/**
 * Attachments column: lists the files (click to download), lets the user add files
 * (button or drag-and-drop) and remove them from the cell.
 * Removing only unlinks the file from the cell; Grist cleans up unused attachments itself.
 */
export function AttachmentsField({ value, onChange, onBlur, readOnly }: AttachmentsFieldProps) {
  const { uploadAttachments, fetchAttachmentsMeta, getAttachmentUrl } = useGrist();
  const ids = decodeRefList(value);
  const idsKey = ids.join(',');
  const [meta, setMeta] = useState<Record<number, AttachmentMeta>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const missing = ids.filter((id) => !(id in meta));
    if (missing.length === 0) return;
    let cancelled = false;
    fetchAttachmentsMeta(missing)
      .then((fetched) => { if (!cancelled) setMeta((prev) => ({ ...prev, ...fetched })); })
      .catch((err) => console.warn('[AttachmentsField] Could not fetch attachment metadata:', err));
    return () => { cancelled = true; };
  }, [idsKey, fetchAttachmentsMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  const addFiles = async (files: File[]) => {
    if (files.length === 0 || readOnly) return;
    setUploading(true);
    setError(null);
    try {
      const newIds = await uploadAttachments(files);
      // Names are known already: no need to fetch them back.
      setMeta((prev) => {
        const next = { ...prev };
        newIds.forEach((id, i) => { next[id] = { fileName: files[i]?.name ?? '', fileSize: files[i]?.size ?? 0 }; });
        return next;
      });
      onChange(['L', ...ids, ...newIds]);
      onBlur?.();
    } catch (err) {
      console.warn('[AttachmentsField] Upload failed:', err);
      setError("L'envoi du fichier a échoué.");
    } finally {
      setUploading(false);
    }
  };

  const remove = (id: number) => {
    const rest = ids.filter((x) => x !== id);
    onChange(rest.length > 0 ? ['L', ...rest] : null);
    onBlur?.();
  };

  const download = (id: number) => {
    // Open the tab within the click so popup blockers let it through, then point it at the signed URL.
    const win = window.open('', '_blank');
    getAttachmentUrl(id)
      .then((url) => {
        if (win) win.location.href = url;
        else window.open(url, '_blank');
      })
      .catch((err) => {
        win?.close();
        console.warn('[AttachmentsField] Could not build download URL:', err);
        setError('Impossible de télécharger le fichier.');
      });
  };

  const dropProps = readOnly ? {} : {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
  };

  return (
    <div className={`attachments${dragOver ? ' attachments--drag-over' : ''}`} {...dropProps}>
      {ids.length === 0 && readOnly && <span className="meta-row__value-static">{'—'}</span>}
      {ids.map((id) => {
        const m = meta[id];
        return (
          <span key={id} className="attachments__chip" title={m ? `${m.fileName} (${formatSize(m.fileSize)})` : undefined}>
            <button type="button" className="attachments__name" onClick={() => download(id)}>
              <Icon name="attach_file" />
              <span className="attachments__label">{m?.fileName ?? 'Fichier'}</span>
            </button>
            {!readOnly && (
              <button type="button" className="attachments__remove" onClick={() => remove(id)} title="Retirer">
                <Icon name="close" />
              </button>
            )}
          </span>
        );
      })}
      {!readOnly && (
        <>
          <button
            type="button"
            className="attachments__add"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Icon name={uploading ? 'progress_activity' : 'upload'} className={uploading ? 'attachments__spinner' : undefined} />
            {uploading ? 'Envoi…' : 'Ajouter un fichier'}
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              addFiles(Array.from(e.target.files ?? []));
              e.target.value = '';
            }}
          />
        </>
      )}
      {error && <span className="attachments__error">{error}</span>}
    </div>
  );
}

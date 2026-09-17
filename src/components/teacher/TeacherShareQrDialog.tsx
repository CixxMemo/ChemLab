import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { isLoopbackOrigin } from '../../navigation/shareOrigin';

const QR_SIZE = 420; // Large enough to scan from a classroom display while fitting smaller screens.
const QR_QUIET_ZONE_MODULES = 4; // Standard white margin keeps the code scannable against either theme.

interface TeacherShareQrDialogProps {
  url: string;
  onClose: () => void;
}

export const TeacherShareQrDialog: React.FC<TeacherShareQrDialogProps> = ({ url, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Strict Mode replays effects; closing during cleanup would dispatch a stale
    // close event that immediately hides the newly opened dialog.
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  return <dialog ref={dialogRef} onClose={onClose} aria-label="Öğrenci bağlantısı karekodu"
    className="w-[min(92vw,34rem)] max-h-[92vh] overflow-y-auto rounded-xl border border-slate-600 bg-slate-900 p-5 text-slate-50 backdrop:bg-slate-950/90">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Öğrenci karekodu</h2>
      <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Karekodu kapat"
        className="touch-target inline-flex items-center justify-center rounded-lg border border-slate-700 hover:bg-slate-800">
        <X className="h-5 w-5" />
      </button>
    </div>
    <div className="mx-auto w-fit max-w-full rounded-lg bg-white p-2" role="img" aria-label="Öğrenci deney bağlantısı için taranabilir karekod">
      <QRCodeSVG value={url} size={QR_SIZE} level="M" marginSize={QR_QUIET_ZONE_MODULES} fgColor="#0B0F17" bgColor="#FFFFFF" className="h-auto max-h-[58vh] max-w-full" />
    </div>
    <p className="mt-4 text-center text-sm text-slate-300">Öğrenciler telefon kamerasıyla karekodu okutarak deneye geçebilir.</p>
    <p className="mt-2 break-all rounded-lg border border-slate-700 bg-slate-950 p-2 text-center font-mono text-xs text-slate-300">{url}</p>
    {isLoopbackOrigin(new URL(url).origin) && <p className="mt-3 text-center text-xs text-chem-alkaline">
      Bu adres yalnızca bu cihazda açılır. Telefonların erişebildiği bir ağ adresi girin.
    </p>}
  </dialog>;
};

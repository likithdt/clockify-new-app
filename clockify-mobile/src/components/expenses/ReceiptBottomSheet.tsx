import React, { useRef } from "react";
import { Image as ImageIcon, FileText, Camera } from "lucide-react";

interface ReceiptBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachReceipt: (receiptName: string) => void;
}

export const ReceiptBottomSheet: React.FC<ReceiptBottomSheetProps> = ({
  isOpen,
  onClose,
  onAttachReceipt,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachReceipt(file.name);
      onClose();
    }
  };

  const handleSampleSelect = (type: "gallery" | "pdf" | "camera") => {
    const samples = {
      gallery: "receipt_photo_0709.jpg",
      pdf: "expense_invoice_07092026.pdf",
      camera: "receipt_capture_camera.jpg",
    };
    onAttachReceipt(samples[type]);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet - matching Screenshot 8 */}
      <div className="relative w-full bg-white rounded-t-[32px] shadow-2xl pb-8 pt-3 px-6 z-10 animate-slideUp">
        {/* Handle Bar */}
        <div className="w-12 h-1 bg-[#cfd8dc] rounded-full mx-auto mb-6" />

        {/* Hidden Native File Inputs */}
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={pdfInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Action Items */}
        <div className="space-y-2">
          {/* Gallery */}
          <button
            type="button"
            onClick={() => {
              if (imageInputRef.current) {
                imageInputRef.current.click();
              } else {
                handleSampleSelect("gallery");
              }
            }}
            className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              <ImageIcon className="w-5 h-5 text-[#4b5563]" />
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              Gallery
            </span>
          </button>

          {/* Upload a PDF */}
          <button
            type="button"
            onClick={() => {
              if (pdfInputRef.current) {
                pdfInputRef.current.click();
              } else {
                handleSampleSelect("pdf");
              }
            }}
            className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563] relative">
              <FileText className="w-5 h-5 text-[#4b5563]" />
              <span className="absolute -bottom-1 -right-1 bg-[#ef4444] text-[8px] text-white px-0.5 rounded font-bold uppercase">
                pdf
              </span>
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              Upload a PDF
            </span>
          </button>

          {/* Take photo */}
          <button
            type="button"
            onClick={() => {
              if (cameraInputRef.current) {
                cameraInputRef.current.click();
              } else {
                handleSampleSelect("camera");
              }
            }}
            className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              <Camera className="w-5 h-5 text-[#4b5563]" />
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              Take photo
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

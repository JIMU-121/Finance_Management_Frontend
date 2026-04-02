import React, { useState, useEffect } from "react";
import { ModalShell } from "../ui/modal/ModalShell";
import { DocType } from "../../types/apiTypes";
import { uploadEmployeeDocument } from "../../features/employees/employeeDocumentApi";
import { getAllDocTypes } from "../../features/docTypes/docTypeApi";
import { showError, showSuccess } from "../../utils/toast";
import Spinner from "../ui/spinner/Spinner";

interface UploadDocumentModalProps {
  employeeId: number;
  employeeName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  employeeId,
  employeeName,
  onClose,
  onSuccess
}) => {
  const [docTypes, setDocTypes] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        setLoading(true);
        const res = await getAllDocTypes();
        setDocTypes((res?.data || res || []) as DocType[]);
      } catch (err) {
        console.error("Failed to load document types", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocTypes();
  }, []);

  const handleUpload = async (docTypeId: number, file: File) => {
    try {
      setUploadingId(docTypeId);
      await uploadEmployeeDocument(employeeId, docTypeId, file);
      showSuccess("Document uploaded successfully.");
      onSuccess?.();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <ModalShell
      title="Upload Documents"
      subtitle={`Uploading for ${employeeName}`}
      onClose={onClose}
      maxWidth="xl"
      footer={
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Close
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50 min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="md" label="Loading document types..." />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Document Type</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {docTypes.map((dt) => (
                <tr key={dt.id} className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">{dt.typeName}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <label className={`relative flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${uploadingId === dt.id
                          ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-800 dark:bg-gray-900"
                          : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
                        }`}>
                        {uploadingId === dt.id ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.svg"
                          disabled={uploadingId !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && dt.id) {
                              handleUpload(dt.id, file);
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
              {docTypes.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No document types available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </ModalShell>
  );
};

export default UploadDocumentModal;
import React from 'react';
import { FileSearch, UploadCloud, CheckCircle, ScanLine, Loader2, X, Activity, EyeOff } from 'lucide-react';

const DocumentArchive = React.memo(({
  lang,
  handleFileUpload,
  handleAutoFillScan,
  ocrFile,
  setOcrFile,
  isUploading,
  previewUrl,
  setPreviewUrl,
  fileType,
  setAdvancedDocs
}) => {
  return (
    <div className="mb-8 bg-gradient-to-br from-[#002b5e] to-[#004d40] p-1 rounded-sm shadow-xl">
      <div className="bg-white p-6 rounded-sm">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Upload Interface */}
          <div className="w-full lg:w-1/2 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <FileSearch size={22} className="text-[#002b5e]" />
              <h2 className="font-black text-[16px] text-gray-900 uppercase tracking-tight">
                {lang === 'hi' ? 'दस्तावेज़ विश्लेषण और संग्रह' : 'Document Analysis & Archive'}
              </h2>
            </div>

            <div className="relative group">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept=".pdf,image/*"
              />
              <div className={`border-2 border-dashed rounded-md p-8 text-center transition-all ${ocrFile ? 'border-green-500 bg-green-50/30' : 'border-gray-300 group-hover:border-[#002b5e] bg-gray-50'}`}>
                {ocrFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-100 p-3 rounded-full text-green-600 mb-2">
                      <CheckCircle size={32} />
                    </div>
                    <span className="font-black text-[14px] text-gray-900 truncate max-w-xs">{ocrFile.name}</span>
                    <span className="text-[10px] font-bold text-green-600 uppercase">File Attached Successfully</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full text-gray-400 mb-2">
                      <UploadCloud size={32} />
                    </div>
                    <span className="font-bold text-[14px] text-gray-700">{lang === 'hi' ? 'शिकायत की प्रति अपलोड करें' : 'Upload Complaint Copy'}</span>
                    <span className="text-[11px] text-gray-400">PDF, JPG, PNG (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAutoFillScan}
                disabled={!ocrFile || isUploading}
                className={`flex-1 py-3 px-4 rounded-sm font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${!ocrFile || isUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-600 text-white shadow-lg hover:bg-orange-700 active:scale-95'}`}
              >
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ScanLine size={18} />}
                {lang === 'hi' ? 'स्वचालित प्रविष्टि (Auto-Fill)' : 'Run Smart Extraction'}
              </button>

              {ocrFile && (
                <button
                  type="button"
                  onClick={() => { setOcrFile(null); setPreviewUrl(''); setAdvancedDocs(p => ({ ...p, complaintCopy: null })); }}
                  className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-sm hover:bg-red-100 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-sm">
              <div className="flex gap-3">
                <Activity size={16} className="text-blue-600 shrink-0 mt-1" />
                <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                  {lang === 'hi'
                    ? 'स्मार्ट एक्सट्रैक्शन दस्तावेज़ से प्रकरण संख्या, तिथि और विभाग को स्वचालित रूप से पहचानने का प्रयास करेगा।'
                    : 'Smart Extraction will attempt to automatically identify Case ID, Date, and Department from the uploaded document.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Document Preview */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-900 rounded-sm overflow-hidden shadow-inner h-[380px] flex items-center justify-center relative border-4 border-gray-800">
              {previewUrl ? (
                fileType === 'application/pdf' ? (
                  <iframe src={previewUrl} className="w-full h-full" title="PDF Preview"></iframe>
                ) : (
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                )
              ) : (
                <div className="text-center p-8">
                  <div className="text-gray-700 mb-4 flex justify-center">
                    <EyeOff size={48} />
                  </div>
                  <p className="text-gray-500 font-bold text-[13px] uppercase tracking-widest">{lang === 'hi' ? 'दस्तावेज़ का पूर्वावलोकन यहाँ दिखाई देगा' : 'Document preview will appear here'}</p>
                  <p className="text-gray-600 text-[11px] mt-2 italic">{lang === 'hi' ? 'कृपया अपलोड करने के बाद "स्मार्ट एक्सट्रैक्शन" चलाएं।' : 'Please run "Smart Extraction" after uploading.'}</p>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                Secure View
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DocumentArchive;

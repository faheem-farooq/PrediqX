import React, { type DragEvent, useState, useRef } from 'react';
import { FileText, X, FileSpreadsheet } from 'lucide-react';
import Button from '../ui/Button';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    helperText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onFileSelect,
    accept = ".csv",
    helperText = "Supported format: .csv (Max 10MB)"
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            validateAndSelectFile(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            validateAndSelectFile(file);
        }
    };

    const validateAndSelectFile = (file: File) => {
        if (accept && !file.name.endsWith(accept)) {
            alert(`Please upload a ${accept} file.`);
            return;
        }
        setSelectedFile(file);
        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (selectedFile) {
        return (
            <div className="border border-edge rounded-[2rem] p-10 bg-surface flex items-center justify-between shadow-2xl shadow-slate-100">
                <div className="flex items-center space-x-8">
                    <div className="p-5 bg-white rounded-3xl border border-edge text-slate-900 shadow-sm">
                        <FileText size={32} />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500 font-mono mt-1 uppercase tracking-widest font-bold">Volume: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                <button
                    onClick={clearFile}
                    className="p-4 text-slate-400 hover:text-red-500 rounded-full hover:bg-white transition-all duration-300"
                >
                    <X size={28} />
                </button>
            </div>
        )
    }

    return (
        <div
            className={`border-2 border-dashed rounded-[3rem] p-24 text-center transition-all cursor-pointer group relative overflow-hidden
        ${isDragOver
                    ? 'border-glow-blue bg-surface scale-[1.01]'
                    : 'border-edge hover:border-slate-300 hover:bg-surface/50'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileInputChange}
            />
            <div className="flex flex-col items-center justify-center space-y-8">
                <div className={`p-8 rounded-[2rem] transition-all duration-500 ${isDragOver ? 'bg-glow-blue/10 text-glow-blue' : 'bg-surface text-slate-300 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-sm'}`}>
                    <FileSpreadsheet size={56} />
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">
                        Assembly: Source Packet
                    </h3>
                    <p className="text-slate-500 mt-4 text-lg font-medium">
                        {helperText}
                    </p>
                </div>
                <Button size="lg" className="mt-8 pointer-events-none bg-black text-white rounded-full px-12 uppercase tracking-widest text-xs font-bold">
                    Ingress Dataset
                </Button>
            </div>
        </div>
    );
};

export default FileUploader;

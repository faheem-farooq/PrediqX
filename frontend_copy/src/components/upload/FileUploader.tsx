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
            <div className="border border-blue-800 rounded-xl p-6 bg-blue-900/20 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-900/50 rounded-lg text-blue-400">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="font-medium text-white">{selectedFile.name}</p>
                        <p className="text-sm text-slate-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                <button
                    onClick={clearFile}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-full hover:bg-slate-800 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        )
    }

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer group
        ${isDragOver
                    ? 'border-blue-500 bg-blue-900/20 scale-[1.02]'
                    : 'border-slate-700 hover:border-blue-500 hover:bg-slate-900'
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
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`p-5 rounded-full transition-colors ${isDragOver ? 'bg-blue-900/50 text-blue-400' : 'bg-slate-800 text-slate-400 group-hover:bg-blue-900/30 group-hover:text-blue-400'}`}>
                    <FileSpreadsheet size={36} />
                </div>
                <div>
                    <p className="text-xl font-semibold text-white">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-slate-400 mt-2">
                        {helperText}
                    </p>
                </div>
                <Button variant="outline" size="sm" className="mt-4 pointer-events-none border-slate-600 text-slate-300">
                    Select CSV File
                </Button>
            </div>
        </div>
    );
};

export default FileUploader;

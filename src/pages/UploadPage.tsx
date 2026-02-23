import React, { useState } from 'react';
import Navbar from '../layouts/Navbar';
import FileUploader from '../components/upload/FileUploader';
import DataPreview from '../components/upload/DataPreview';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { LineChart, BrainCircuit, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadCSV } from '../services/api';

const UploadPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setLoading(true);

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setHeaders(results.meta.fields || []);
                setData(results.data);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setLoading(false);
                alert('Error parsing CSV file');
            }
        });
    };

    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await uploadCSV(file);
            // Store file_id and filename for Dashboard to use
            localStorage.setItem("currentFileId", response.file_id);
            localStorage.setItem("currentFileName", response.filename);

            // Navigate to Dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload file. Please try again.");
            setIsUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setData([]);
        setHeaders([]);
    };

    const steps = [
        {
            icon: <BrainCircuit className="w-6 h-6 text-blue-600" />,
            title: "1. Upload Data",
            description: "Upload your business CSV file securely."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
            title: "2. Validation",
            description: "System validates structure and data range."
        },
        {
            icon: <LineChart className="w-6 h-6 text-violet-600" />,
            title: "3. ML Analysis",
            description: "AI models generate actionable insights."
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-32 relative font-sans text-slate-900">
            <Navbar />

            {/* Header Section - Editorial Style */}
            <section className="relative pt-48 pb-24 border-b border-edge">
                <div className="container mx-auto px-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-8 px-4 py-1.5 border border-edge rounded-full bg-surface">
                            Ingestion Protocol 01
                        </span>
                        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-10 tracking-tighter leading-none">
                            Knowledge <span className="text-glow-blue italic">Assembly</span>.
                        </h1>
                        <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Upload your proprietary datasets for deep-layer analysis and executive discovery.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section - Minimalist */}
            <section className="py-24 bg-surface/50">
                <div className="container mx-auto px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="p-5 bg-white rounded-[1.5rem] border border-edge shadow-sm text-slate-900">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{step.title}</h3>
                                    <p className="text-base text-slate-500 mt-2 font-medium leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upload Section */}
            <main className="container mx-auto px-10 py-32 max-w-5xl">
                {!file ? (
                    <div className="max-w-3xl mx-auto bg-white p-12 rounded-[3rem] border border-edge shadow-2xl shadow-slate-100 transition-all hover:shadow-slate-200">
                        <FileUploader
                            onFileSelect={handleFileSelect}
                            helperText="Standard CSV format required. Max 50MB per packet."
                        />
                    </div>
                ) : (
                    <>
                        {loading || isUploading ? (
                            <div className="text-center py-40 bg-surface/30 rounded-[3rem] border border-edge">
                                <div className="h-1.5 w-48 bg-slate-100 rounded-full mx-auto mb-10 overflow-hidden relative">
                                    <motion.div
                                        className="absolute top-0 left-0 h-full bg-glow-blue"
                                        animate={{ x: [-192, 192] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    {isUploading ? "Transmitting Data Layer..." : "Parsing Structures..."}
                                </h3>
                                <p className="text-slate-500 mt-3 font-medium">
                                    {isUploading ? "Secure transmission to analytical core in progress." : "Extracting core attributes and validating integrity."}
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="bg-surface p-8 rounded-[2rem] border border-edge mb-12 flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-edge flex items-center justify-center text-green-500">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Integrity Verified</h3>
                                            <p className="text-slate-500 font-medium">
                                                Packet <span className="text-slate-900 font-bold">{file.name}</span> ready for secondary analysis.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        Revoke Access
                                    </button>
                                </div>

                                <DataPreview
                                    headers={headers}
                                    data={data}
                                    fileName={file.name}
                                    onRemoveFile={handleRemoveFile}
                                />

                                <div className="mt-20 text-center">
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="bg-black text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                                    >
                                        {isUploading ? "Initializing..." : "Commit To Analysis"}
                                    </button>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-8">
                                        Data is processed under standard privacy protocols.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default UploadPage;

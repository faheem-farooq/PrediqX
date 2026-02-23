import React, { useState } from 'react';
import Navbar from '../layouts/Navbar';
import FileUploader from '../components/upload/FileUploader';
import DataPreview from '../components/upload/DataPreview';
import Papa from 'papaparse';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import TypewriterText from '../components/ui/TypewriterText';
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
        <div className="min-h-screen bg-slate-950 pb-20 relative font-sans text-slate-200">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
                <AnimatedBackground />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-300 uppercase bg-blue-900/30 rounded-full border border-blue-500/30 backdrop-blur-sm">
                            PrediqX Platform
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Prediq<span className="text-blue-500">X</span>
                        </h1>
                        <h2 className="text-xl md:text-2xl text-slate-300 mb-8 font-light max-w-2xl mx-auto">
                            Machine Learning–Driven Business Decision Support System
                        </h2>
                        <div className="h-16 flex items-center justify-center">
                            <TypewriterText
                                text="Welcome to PrediqX — upload your data and let intelligence guide your decisions."
                                className="text-lg md:text-xl text-blue-200 italic"
                                speed={40}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 -mt-16 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex items-start space-x-4"
                            >
                                <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{step.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upload Section */}
            <main className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl font-bold text-white">Start Your Analysis</h2>
                    <p className="text-slate-400 mt-2">
                        Supported datasets: Marketing, Sales, Financial, or Customer Data.
                    </p>
                </motion.div>

                {!file ? (
                    <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
                        <FileUploader
                            onFileSelect={handleFileSelect}
                            helperText="Only .csv files supported. Large datasets are automatically handled."
                        />
                    </div>
                ) : (
                    <>
                        {loading || isUploading ? (
                            <div className="text-center py-24 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
                                <h3 className="text-xl font-semibold text-white">
                                    {isUploading ? "Uploading to Server..." : "Processing Dataset..."}
                                </h3>
                                <p className="text-slate-400 mt-2">
                                    {isUploading ? "Sending data to secure backend environment." : "Validating structure and parsing rows."}
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-800 mb-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white">Success</h3>
                                        <span className="text-xs text-green-400 font-medium bg-green-900/30 border border-green-500/30 px-2 py-1 rounded-full">Validated</span>
                                    </div>
                                    <p className="text-slate-300">
                                        Your file <span className="font-medium text-white">{file.name}</span> has been successfully uploaded and parsed.
                                    </p>
                                </div>

                                <DataPreview
                                    headers={headers}
                                    data={data}
                                    fileName={file.name}
                                    onRemoveFile={handleRemoveFile}
                                />

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? "Analyzing..." : "Proceed to Analysis"}
                                    </button>
                                    <p className="text-xs text-slate-500 mt-4">
                                        Full dataset will be processed securely.
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

import React from 'react';
import Table from '../ui/Table';
import Card from '../ui/Card';
import Button from '../ui/Button'; // Assuming Button is in ../ui/Button
import { Trash2 } from 'lucide-react';

interface DataPreviewProps {
    headers: string[];
    data: any[];
    fileName: string;
    onRemoveFile: () => void;
}

const DataPreview: React.FC<DataPreviewProps> = ({ headers, data, fileName, onRemoveFile }) => {
    return (
        <Card className="mt-8 border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Data Preview</h3>
                    <p className="text-sm text-slate-500 mt-1">Showing first 5 rows of <span className="font-medium text-glow-blue">{fileName}</span></p>
                </div>
                <Button variant="ghost" size="sm" onClick={onRemoveFile} className="text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-full px-4">
                    <Trash2 size={16} className="mr-2" />
                    Remove Protocol
                </Button>
            </div>

            <Table
                headers={headers}
                data={data.slice(0, 5)}
            />

            <div className="mt-6 text-[10px] uppercase tracking-widest text-slate-600 text-center font-bold">
                {data.length > 5 ? `End of Sample Stream — ${data.length - 5} packets remaining` : 'Stream Finalized'}
            </div>
        </Card>
    );
};

export default DataPreview;

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
        <Card className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Data Preview</h3>
                    <p className="text-sm text-slate-500">Showing first 5 rows of <span className="font-medium text-slate-700">{fileName}</span></p>
                </div>
                <Button variant="ghost" size="sm" onClick={onRemoveFile} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={16} className="mr-2" />
                    Remove File
                </Button>
            </div>

            <Table
                headers={headers}
                data={data.slice(0, 5)}
            />

            <div className="mt-4 text-xs text-slate-400 text-center">
                {data.length > 5 ? `and ${data.length - 5} more rows...` : 'End of dataset'}
            </div>
        </Card>
    );
};

export default DataPreview;

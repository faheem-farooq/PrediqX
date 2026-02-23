import React from 'react';

interface TableProps {
    headers: string[];
    data: any[];
    caption?: string;
}

const Table: React.FC<TableProps> = ({ headers, data, caption }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                No data to display
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-edge bg-white">
            <table className="w-full text-left text-sm text-slate-500">
                {caption && <caption className="p-8 font-bold text-slate-900 text-left border-b border-edge bg-surface/30 tracking-tight text-lg">{caption}</caption>}
                <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-surface/50">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} scope="col" className="px-10 py-6 border-b border-edge">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-surface transition-colors duration-200">
                            {headers.map((header, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} className="px-10 py-6 text-slate-700 font-medium">
                                    {row[header] !== undefined ? String(row[header]) : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

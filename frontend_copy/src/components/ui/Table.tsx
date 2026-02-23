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
        <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
                {caption && <caption className="p-4 font-semibold text-white text-left bg-slate-900 border-b border-slate-800">{caption}</caption>}
                <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} scope="col" className="px-6 py-3 font-medium border-b border-slate-800 whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-900 transition-colors">
                            {headers.map((header, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} className="px-6 py-3 text-slate-300 whitespace-nowrap">
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

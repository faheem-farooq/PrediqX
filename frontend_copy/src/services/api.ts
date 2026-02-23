export const API_BASE_URL = "http://localhost:8000/api/v1";

export interface Recommendation {
    action: string;
    impact: "High" | "Medium" | "Low";
    effort: "Low" | "Medium" | "High";
    priority: "High" | "Medium" | "Low";
}

export interface ChecklistItem {
    item: string;
    status: boolean;
}

export interface ModelReadiness {
    status: string;
    checklist: ChecklistItem[];
}

export interface AnalystReport {
    data_quality_score: number;
    analysis_confidence_score: number;
    executive_summary: string;
    key_patterns: string[];
    risk_flags: string[];
    model_readiness: ModelReadiness;
    segment_insights: string[];
    recommended_actions: Recommendation[];
    data_quality_notes: string[];
}

export const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/data/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload file");
    }

    return response.json();
};

export const getEDA = async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/data/eda/${fileId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch EDA");
    }

    return response.json();
};

export const generateAnalystReport = async (fileId: string): Promise<AnalystReport> => {
    const response = await fetch(`${API_BASE_URL}/analyst/report`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: fileId }),
    });

    if (!response.ok) {
        throw new Error("Failed to generate analyst report");
    }

    return response.json();
};

export const askAnalyst = async (fileId: string, question: string): Promise<{ answer: string }> => {
    const response = await fetch(`${API_BASE_URL}/analyst/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: fileId, question }),
    });

    if (!response.ok) {
        throw new Error("Failed to get answer from analyst");
    }

    return response.json();
};

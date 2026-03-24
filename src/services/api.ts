export const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8000/api/v1' : '/api/v1');
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
        let errorMessage = "Failed to upload file";
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
            errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
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

// A/B Testing Types
export interface ABTestData {
    group_column: string;
    metric_column: string;
    group_a_label: string;
    group_b_label: string;
    group_a_size: number;
    group_b_size: number;
    group_a_mean: number;
    group_b_mean: number;
    test_type: string;
    statistic: number;
    p_value: number;
    significant: boolean;
    confidence: number;
    effect_size: number;
    warnings: string[];
}

export interface ABTestResponse {
    success: boolean;
    data: ABTestData;
    insight: string;
}

export interface SuggestedGroup {
    column: string;
    unique_values: string[];
    recommendation: string;
}

export interface SuggestedMetric {
    column: string;
    type: string;
    suggested_test: string;
}

export interface SuggestColumnsResponse {
    success: boolean;
    suggested_group_columns: SuggestedGroup[];
    suggested_metric_columns: SuggestedMetric[];
}

export const runABTest = async (
    fileId: string,
    groupColumn: string,
    metricColumn: string,
    testType: string = "auto"
): Promise<ABTestResponse> => {
    const response = await fetch(`${API_BASE_URL}/experiment/ab-test`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            file_id: fileId,
            group_column: groupColumn,
            metric_column: metricColumn,
            test_type: testType,
        }),
    });

    if (!response.ok) {
        let errorMessage = "Failed to run A/B test";
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
            errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

export const suggestABTestColumns = async (fileId: string): Promise<SuggestColumnsResponse> => {
    const response = await fetch(`${API_BASE_URL}/experiment/ab-test/suggest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: fileId }),
    });

    if (!response.ok) {
        throw new Error("Failed to suggest columns");
    }

    return response.json();
};

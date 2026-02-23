import pandas as pd
import numpy as np
from scipy import stats
import io
from typing import Dict, Any, List, Optional

import math

class DataProcessor:
    def _clean_nan_values(self, obj: Any) -> Any:
        """Recursive helper to replace NaN with 0.0, convert numpy types, and ensure dict keys are strings."""
        if isinstance(obj, bool):
            return obj
        if isinstance(obj, (float, np.float32, np.float64)):
            if math.isnan(obj) or math.isinf(obj):
                return 0.0
            return float(obj)
        elif isinstance(obj, (int, np.int32, np.int64)):
            return int(obj)
        elif isinstance(obj, dict):
            return {str(k): self._clean_nan_values(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._clean_nan_values(x) for x in obj]
        return obj

    def process_csv(self, file_content: bytes) -> Dict[str, Any]:
        """
        Reads CSV bytes, returns metadata and a preview.
        Auto-detects delimiter (comma, semicolon, tab, etc.)
        """
        try:
            # Ensure we decode bytes to string to inspect content, removing potential BOM
            content_str = file_content.decode('utf-8-sig')
            # Let pandas auto-detect delimiter using Python engine
            df = pd.read_csv(io.StringIO(content_str), skipinitialspace=True, sep=None, engine='python')
            
            # Clean column names
            df.columns = df.columns.astype(str).str.strip()

            return {
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": list(df.columns),
                "preview": df.head().to_dict(orient="records"),
                "missing_values": df.isnull().sum().to_dict(),
                "data_types": df.dtypes.astype(str).to_dict()
            }
        except Exception as e:
            raise ValueError(f"Error processing CSV: {str(e)}")

    def get_eda_summary(self, file_path: str) -> Dict[str, Any]:
        """
        Generates full EDA summary consistent with Part-1 requirements.
        Auto-detects delimiter (comma, semicolon, tab, etc.)
        """
        try:
            # Auto-detect delimiter using Python engine
            df = pd.read_csv(file_path, skipinitialspace=True, sep=None, engine='python')
            df.columns = df.columns.astype(str).str.strip()
            
            
            # 2. Feature Type Detection
            numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
            
            # Detect target column
            possible_targets = [c for c in df.columns if c.lower() in ['target', 'class', 'label', 'outcome', 'churn', 'y']]
            target_col = possible_targets[0] if possible_targets else None
            
            # Fallback: Last categorical column if <= 10 unique values
            if not target_col and categorical_cols:
                last_cat = categorical_cols[-1]
                if df[last_cat].nunique() <= 10:
                    target_col = last_cat
            
            # Calculate imbalance ratio if target exists
            imbalance_ratio = None
            if target_col and target_col in df.columns:
                value_counts = df[target_col].value_counts()
                if len(value_counts) > 0:
                    imbalance_ratio = round(value_counts.iloc[0] / len(df) * 100, 2)
            
            # 1. Dataset Overview
            overview = {
                "rows": len(df),
                "columns": len(df.columns),
                "numerical_features": len(numerical_cols),
                "categorical_features": len(categorical_cols),
                "missing_values": df.isnull().sum().to_dict(),
                "data_types": df.dtypes.astype(str).to_dict(),
                "target_column": target_col,
                "imbalance_ratio": imbalance_ratio
            }

            #3. Numerical Analysis
            numerical_analysis = []
            for col in numerical_cols:
                series = df[col].dropna()
                if not series.empty:
                    # Histogram
                    try:
                        counts, bin_edges = np.histogram(series, bins='auto')
                        histogram_bins = bin_edges.tolist()
                        histogram_counts = counts.tolist()
                    except Exception:
                        histogram_bins = []
                        histogram_counts = []
                    
                    # Skewness
                    try:
                        skewness = float(stats.skew(series))
                    except Exception:
                        skewness = 0.0
                    
                    # Outlier detection using IQR method
                    q1 = series.quantile(0.25)
                    q3 = series.quantile(0.75)
                    iqr = q3 - q1
                    lower_bound = q1 - 1.5 * iqr
                    upper_bound = q3 + 1.5 * iqr
                    outliers = series[(series < lower_bound) | (series > upper_bound)].tolist()
                    outlier_count = len(outliers)
                    
                    # Boxplot data
                    boxplot_data = {
                        "q1": float(q1),
                        "q3": float(q3),
                        "median": float(series.median()),
                        "whisker_low": float(max(series.min(), lower_bound)),
                        "whisker_high": float(min(series.max(), upper_bound)),
                        "outliers": [float(x) for x in outliers[:20]]  # Limit to 20 outliers for display
                    }
                    
                    analysis = {
                        "feature": col,
                        "mean": float(series.mean()) if not pd.isna(series.mean()) else 0.0,
                        "median": float(series.median()) if not pd.isna(series.median()) else 0.0,
                        "std_dev": float(series.std()) if not pd.isna(series.std()) else 0.0,
                        "min": float(series.min()) if not pd.isna(series.min()) else 0.0,
                        "max": float(series.max()) if not pd.isna(series.max()) else 0.0,
                        "skewness": skewness if not math.isnan(skewness) else 0.0,
                        "outlier_count": outlier_count,
                        "boxplot": boxplot_data,
                        "histogram_bins": histogram_bins,
                        "histogram_counts": histogram_counts
                    }
                    numerical_analysis.append(analysis)

            # 4. Categorical Analysis
            categorical_analysis = []
            for col in categorical_cols:
                total_count = len(df[col].dropna())
                value_counts_dict = df[col].value_counts().to_dict()
                
                # Calculate percentages
                value_percentages = {
                    str(k): round((v / total_count * 100), 2) if total_count > 0 else 0.0
                    for k, v in value_counts_dict.items()
                }
                
                # Find most frequent category
                most_frequent = max(value_counts_dict, key=value_counts_dict.get) if value_counts_dict else None
                
                if df[col].nunique() > 50:  # Skip high cardinality for charts, just give summary
                    analysis = {
                        "feature": col,
                        "unique_count": int(df[col].nunique()),
                        "value_counts": dict(list(value_counts_dict.items())[:10]),
                        "value_percentages": dict(list(value_percentages.items())[:10]),
                        "most_frequent": str(most_frequent) if most_frequent else None
                    }
                else:
                    analysis = {
                        "feature": col,
                        "unique_count": int(df[col].nunique()),
                        "value_counts": {str(k): int(v) for k, v in value_counts_dict.items()},
                        "value_percentages": value_percentages,
                        "most_frequent": str(most_frequent) if most_frequent else None
                    }
                categorical_analysis.append(analysis)

            # 5. Target Distribution
            target_distribution = None
            if target_col and target_col in df.columns:
                distribution_counts = df[target_col].value_counts().to_dict()
                total_count = len(df[target_col].dropna())
                
                # Calculate percentages
                distribution_percentages = {
                    str(k): round((v / total_count * 100), 2) if total_count > 0 else 0.0
                    for k, v in distribution_counts.items()
                }
                
                # Calculate imbalance ratio (highest class percentage)
                imbalance_ratio_target = max(distribution_percentages.values()) if distribution_percentages else 0
                is_imbalanced = imbalance_ratio_target > 65.0
                
                target_distribution = {
                   "target_column": target_col,
                   "distribution": {str(k): int(v) for k, v in distribution_counts.items()},
                   "percentages": distribution_percentages,
                   "imbalance_ratio": round(imbalance_ratio_target, 2),
                   "is_imbalanced": is_imbalanced
                }

            # 6. Correlation Analysis
            correlation_matrix = None
            if len(numerical_cols) >= 2:
                corr_df = df[numerical_cols].corr()
                # Replace NaN with None (null in JSON)
                matrix = corr_df.where(pd.notnull(corr_df), None).values.tolist()
                
                # Extract top 3 correlations (excluding diagonal)
                top_correlations = []
                for i in range(len(numerical_cols)):
                    for j in range(i + 1, len(numerical_cols)):
                        corr_value = corr_df.iloc[i, j]
                        if pd.notnull(corr_value):
                            top_correlations.append({
                                "feature1": numerical_cols[i],
                                "feature2": numerical_cols[j],
                                "correlation": round(float(corr_value), 3)
                            })
                
                # Sort by absolute correlation value and take top 3
                top_correlations = sorted(top_correlations, key=lambda x: abs(x["correlation"]), reverse=True)[:3]
                
                correlation_matrix = {
                    "features": numerical_cols,
                    "matrix": matrix,
                    "top_correlations": top_correlations
                }

            result = {
                "dataset_overview": overview,
                "numerical_analysis": numerical_analysis,
                "categorical_analysis": categorical_analysis,
                "correlation_matrix": correlation_matrix,
                "target_distribution": target_distribution
            }
            
            # Final pass to ensure no NaNs reach the API response
            return self._clean_nan_values(result)

        except Exception as e:
            raise ValueError(f"Error generating EDA: {str(e)}")

data_processor = DataProcessor()

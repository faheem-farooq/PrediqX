import pandas as pd
import numpy as np
from scipy import stats
from typing import Dict, Any, List, Optional, Tuple


class ABTestingService:
    """
    Service layer for A/B Testing.
    Accepts a pandas DataFrame, validates inputs, runs the appropriate
    statistical test, and returns structured results with guardrail warnings.
    """

    def run_test(
        self,
        df: pd.DataFrame,
        group_column: str,
        metric_column: str,
        test_type: str = "auto",
    ) -> Dict[str, Any]:
        """
        Execute an A/B test on the given DataFrame.

        Args:
            df: The full dataset as a pandas DataFrame.
            group_column: Column name that splits users into groups (must have exactly 2 unique values).
            metric_column: Column name for the metric to compare between groups.
            test_type: One of "auto", "t-test", or "chi-square".

        Returns:
            Dict with test statistics, significance, effect size, and warnings.
        """
        warnings: List[str] = []

        # --- Input Validation ---
        if group_column not in df.columns:
            raise ValueError(f"Group column '{group_column}' not found in dataset.")
        if metric_column not in df.columns:
            raise ValueError(f"Metric column '{metric_column}' not found in dataset.")

        # Drop rows where either column is null
        working_df = df[[group_column, metric_column]].dropna()

        if working_df.empty:
            raise ValueError("No valid data remaining after dropping null values.")

        # Ensure exactly 2 groups
        unique_groups = working_df[group_column].unique()
        if len(unique_groups) != 2:
            raise ValueError(
                f"Group column '{group_column}' must have exactly 2 unique values, "
                f"found {len(unique_groups)}: {list(unique_groups[:5])}"
            )

        group_a_label = str(unique_groups[0])
        group_b_label = str(unique_groups[1])
        group_a = working_df[working_df[group_column] == unique_groups[0]][metric_column]
        group_b = working_df[working_df[group_column] == unique_groups[1]][metric_column]

        # --- Guardrails ---
        if len(group_a) < 30:
            warnings.append(f"Small sample size: Group '{group_a_label}' has only {len(group_a)} observations (recommended ≥ 30).")
        if len(group_b) < 30:
            warnings.append(f"Small sample size: Group '{group_b_label}' has only {len(group_b)} observations (recommended ≥ 30).")

        total = len(group_a) + len(group_b)
        larger_group_pct = max(len(group_a), len(group_b)) / total * 100
        if larger_group_pct > 70:
            warnings.append(
                f"Group imbalance detected: {larger_group_pct:.1f}% / {100 - larger_group_pct:.1f}% split. "
                f"Results may be less reliable."
            )

        # --- Determine Test Type ---
        resolved_test_type = test_type
        if test_type == "auto":
            metric_unique = working_df[metric_column].nunique()
            if metric_unique <= 2:
                resolved_test_type = "chi-square"
            else:
                resolved_test_type = "t-test"

        # --- Run Statistical Test ---
        if resolved_test_type == "t-test":
            result = self._run_ttest(group_a, group_b, group_a_label, group_b_label, warnings)
        elif resolved_test_type == "chi-square":
            result = self._run_chi_square(
                working_df, group_column, metric_column,
                group_a_label, group_b_label, warnings
            )
        else:
            raise ValueError(f"Invalid test_type '{test_type}'. Must be 'auto', 't-test', or 'chi-square'.")

        result["test_type"] = resolved_test_type
        result["group_column"] = group_column
        result["metric_column"] = metric_column
        result["group_a_label"] = group_a_label
        result["group_b_label"] = group_b_label
        result["group_a_size"] = int(len(group_a))
        result["group_b_size"] = int(len(group_b))
        result["warnings"] = warnings

        return result

    def _run_ttest(
        self,
        group_a: pd.Series,
        group_b: pd.Series,
        label_a: str,
        label_b: str,
        warnings: List[str],
    ) -> Dict[str, Any]:
        """Independent two-sample t-test for continuous metrics."""
        a_mean = float(group_a.mean())
        b_mean = float(group_b.mean())
        a_std = float(group_a.std())
        b_std = float(group_b.std())

        # Zero variance check
        if a_std == 0 and b_std == 0:
            warnings.append("Zero variance in both groups. Statistical test may not be meaningful.")
            return {
                "group_a_mean": a_mean,
                "group_b_mean": b_mean,
                "statistic": 0.0,
                "p_value": 1.0,
                "significant": False,
                "confidence": 0.0,
                "effect_size": 0.0,
            }

        statistic, p_value = stats.ttest_ind(group_a, group_b, equal_var=False)

        # Cohen's d for effect size
        pooled_std = np.sqrt(
            ((len(group_a) - 1) * a_std**2 + (len(group_b) - 1) * b_std**2)
            / (len(group_a) + len(group_b) - 2)
        )
        effect_size = abs(a_mean - b_mean) / pooled_std if pooled_std > 0 else 0.0

        return {
            "group_a_mean": round(a_mean, 4),
            "group_b_mean": round(b_mean, 4),
            "statistic": round(float(statistic), 4),
            "p_value": round(float(p_value), 6),
            "significant": bool(p_value < 0.05),
            "confidence": round(float(1 - p_value), 6),
            "effect_size": round(float(effect_size), 4),
        }

    def _run_chi_square(
        self,
        df: pd.DataFrame,
        group_column: str,
        metric_column: str,
        label_a: str,
        label_b: str,
        warnings: List[str],
    ) -> Dict[str, Any]:
        """Chi-square test for binary/categorical metrics."""
        contingency = pd.crosstab(df[group_column], df[metric_column])

        if contingency.shape[0] < 2 or contingency.shape[1] < 2:
            warnings.append("Contingency table has insufficient dimensions for chi-square test.")
            group_a_data = df[df[group_column] == label_a][metric_column]
            group_b_data = df[df[group_column] == label_b][metric_column]
            return {
                "group_a_mean": round(float(group_a_data.mean()), 4),
                "group_b_mean": round(float(group_b_data.mean()), 4),
                "statistic": 0.0,
                "p_value": 1.0,
                "significant": False,
                "confidence": 0.0,
                "effect_size": 0.0,
            }

        chi2, p_value, dof, expected = stats.chi2_contingency(contingency)

        # Cramér's V for effect size
        n = contingency.sum().sum()
        min_dim = min(contingency.shape[0] - 1, contingency.shape[1] - 1)
        cramers_v = np.sqrt(chi2 / (n * min_dim)) if (n * min_dim) > 0 else 0.0

        # Calculate group means (proportion of positive class for binary metrics)
        group_a_data = df[df[group_column] == label_a][metric_column]
        group_b_data = df[df[group_column] == label_b][metric_column]

        return {
            "group_a_mean": round(float(group_a_data.mean()), 4),
            "group_b_mean": round(float(group_b_data.mean()), 4),
            "statistic": round(float(chi2), 4),
            "p_value": round(float(p_value), 6),
            "significant": bool(p_value < 0.05),
            "confidence": round(float(1 - p_value), 6),
            "effect_size": round(float(cramers_v), 4),
        }

    def suggest_columns(self, df: pd.DataFrame) -> Dict[str, List[Dict[str, Any]]]:
        """
        Suggest suitable group columns (categorical, low cardinality)
        and metric columns (numeric or binary) from the dataset.
        """
        suggested_groups: List[Dict[str, Any]] = []
        suggested_metrics: List[Dict[str, Any]] = []

        for col in df.columns:
            nunique = df[col].nunique()

            # Group columns: categorical or low-cardinality with exactly 2 values ideal
            if nunique == 2:
                suggested_groups.append({
                    "column": col,
                    "unique_values": [str(v) for v in df[col].dropna().unique().tolist()],
                    "recommendation": "ideal",
                })
            elif 2 < nunique <= 5 and df[col].dtype == "object":
                suggested_groups.append({
                    "column": col,
                    "unique_values": [str(v) for v in df[col].dropna().unique().tolist()],
                    "recommendation": "possible (filter to 2 groups needed)",
                })

            # Metric columns: numeric or binary
            if pd.api.types.is_numeric_dtype(df[col]):
                if nunique == 2:
                    suggested_metrics.append({
                        "column": col,
                        "type": "binary",
                        "suggested_test": "chi-square",
                    })
                elif nunique > 2:
                    suggested_metrics.append({
                        "column": col,
                        "type": "continuous",
                        "suggested_test": "t-test",
                    })

        return {
            "suggested_group_columns": suggested_groups,
            "suggested_metric_columns": suggested_metrics,
        }


ab_testing_service = ABTestingService()

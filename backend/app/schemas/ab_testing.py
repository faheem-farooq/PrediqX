from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class ABTestRequest(BaseModel):
    file_id: str
    group_column: str
    metric_column: str
    test_type: str = "auto"  # "auto", "t-test", or "chi-square"


class ABTestData(BaseModel):
    group_column: str
    metric_column: str
    group_a_label: str
    group_b_label: str
    group_a_size: int
    group_b_size: int
    group_a_mean: float
    group_b_mean: float
    test_type: str
    statistic: float
    p_value: float
    significant: bool
    confidence: float
    effect_size: float
    warnings: List[str]


class ABTestResponse(BaseModel):
    success: bool
    data: ABTestData
    insight: str


class SuggestColumnsRequest(BaseModel):
    file_id: str


class SuggestedGroup(BaseModel):
    column: str
    unique_values: List[str]
    recommendation: str


class SuggestedMetric(BaseModel):
    column: str
    type: str
    suggested_test: str


class SuggestColumnsResponse(BaseModel):
    success: bool
    suggested_group_columns: List[SuggestedGroup]
    suggested_metric_columns: List[SuggestedMetric]

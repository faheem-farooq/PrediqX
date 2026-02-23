from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Union

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    rows: int
    columns: int
    column_names: List[str]
    message: str

class BoxplotData(BaseModel):
    q1: float
    q3: float
    median: float
    whisker_low: float
    whisker_high: float
    outliers: List[float]

class NumericalFeature(BaseModel):
    feature: str
    mean: float
    median: float
    std_dev: float
    min: float
    max: float
    skewness: float
    outlier_count: int
    boxplot: BoxplotData
    histogram_bins: List[float]
    histogram_counts: List[int]

class CategoricalFeature(BaseModel):
    feature: str
    unique_count: int
    value_counts: Dict[str, int]
    value_percentages: Dict[str, float]
    most_frequent: Optional[str] = None

class TopCorrelation(BaseModel):
    feature1: str
    feature2: str
    correlation: float

class CorrelationData(BaseModel):
    features: List[str]
    matrix: List[List[Union[float, None]]]
    top_correlations: List[TopCorrelation]

class TargetDistribution(BaseModel):
    target_column: str
    distribution: Dict[str, int]
    percentages: Dict[str, float]
    imbalance_ratio: float
    is_imbalanced: bool

class EDAResponse(BaseModel):
    file_id: str
    dataset_overview: Dict[str, Any]  # rows, cols, missing_values, data_types, numerical_features, categorical_features, target_column, imbalance_ratio
    numerical_analysis: List[NumericalFeature]
    categorical_analysis: List[CategoricalFeature]
    correlation_matrix: Optional[CorrelationData] = None
    target_distribution: Optional[TargetDistribution] = None

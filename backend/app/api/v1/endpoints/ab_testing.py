from fastapi import APIRouter, HTTPException
from app.services.ab_testing_service import ab_testing_service
from app.services.llm_engine import llm_engine
from app.core.config import settings
from app.schemas.ab_testing import (
    ABTestRequest,
    ABTestResponse,
    SuggestColumnsRequest,
    SuggestColumnsResponse,
)
import pandas as pd
import os

router = APIRouter()


@router.post("/ab-test", response_model=ABTestResponse)
async def run_ab_test(request: ABTestRequest):
    """
    Run an A/B test on the uploaded dataset.
    Automatically selects the appropriate statistical test (t-test or chi-square)
    based on the metric type, or uses the explicitly specified test_type.
    """
    file_path = os.path.join(settings.UPLOAD_DIR, f"{request.file_id}.csv")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        df = pd.read_csv(file_path, skipinitialspace=True, sep=None, engine="python")
        df.columns = df.columns.astype(str).str.strip()

        # Run the statistical test
        test_results = ab_testing_service.run_test(
            df=df,
            group_column=request.group_column,
            metric_column=request.metric_column,
            test_type=request.test_type,
        )

        # Generate LLM insight
        insight = llm_engine.generate_ab_test_insight(test_results)

        return {
            "success": True,
            "data": test_results,
            "insight": insight,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running A/B test: {str(e)}")


@router.post("/ab-test/suggest", response_model=SuggestColumnsResponse)
async def suggest_columns(request: SuggestColumnsRequest):
    """
    Suggest suitable group and metric columns for A/B testing
    based on column types and cardinality.
    """
    file_path = os.path.join(settings.UPLOAD_DIR, f"{request.file_id}.csv")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        df = pd.read_csv(file_path, skipinitialspace=True, sep=None, engine="python")
        df.columns = df.columns.astype(str).str.strip()

        suggestions = ab_testing_service.suggest_columns(df)

        return {
            "success": True,
            **suggestions,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error suggesting columns: {str(e)}")

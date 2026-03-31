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
    If auto_mode is True, it automatically generates and evaluates multiple tests.
    """
    file_path = os.path.join(settings.UPLOAD_DIR, f"{request.file_id}.csv")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        df = pd.read_csv(file_path, skipinitialspace=True, sep=None, engine="python")
        df.columns = df.columns.astype(str).str.strip()

        if request.auto_mode:
            all_experiments = ab_testing_service.run_auto_experiments(df)
            if not all_experiments:
                 raise HTTPException(status_code=400, detail="Could not identify any valid A/B test combinations in this dataset.")
            
            # The service returns them ranked, so the first one is the best
            best_test = all_experiments[0]
            insight = llm_engine.generate_ab_test_insight(best_test)
            
            return {
                "success": True,
                "data": best_test,
                "insight": insight,
                "all_experiments": all_experiments,
                "best_test_index": 0
            }

        # Manual Mode
        if not request.group_column or not request.metric_column:
             raise HTTPException(status_code=400, detail="Group and Metric columns are required for manual mode.")

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

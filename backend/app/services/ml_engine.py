import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, r2_score
from sklearn.preprocessing import LabelEncoder
import numpy as np

class MLEngine:
    def train_baseline(self, file_path: str, target_column: str, problem_type: str = "classification"):
        """
        Trains a baseline model (Logistic Regression or Random Forest).
        Returns metrics and feature importance.
        """
        try:
            df = pd.read_csv(file_path)
            
            # Simple Preprocessing
            df = df.dropna()
            
            # Encode categorical variables
            le_dict = {}
            for col in df.select_dtypes(include=['object']).columns:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col])
                le_dict[col] = le
            
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            model = None
            metrics = {}
            
            if problem_type == "classification":
                model = RandomForestClassifier(n_estimators=100, random_state=42)
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                metrics["accuracy"] = accuracy_score(y_test, y_pred)
            else:
                model = RandomForestRegressor(n_estimators=100, random_state=42)
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                metrics["r2_score"] = r2_score(y_test, y_pred)
            
            # Feature Importance
            feature_importance = dict(zip(X.columns, model.feature_importances_))
            
            return {
                "metrics": metrics,
                "feature_importance": feature_importance
            }
            
        except Exception as e:
            raise ValueError(f"Error in ML pipeline: {str(e)}")

ml_engine = MLEngine()

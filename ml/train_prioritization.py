import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Generate synthetic training data
np.random.seed(42)
n_samples = 1000

# Features: amount, overdue_days, customer_segment (0=standard, 1=premium), previous_defaults
amounts = np.random.exponential(scale=30000, size=n_samples)
overdue_days = np.random.randint(1, 150, size=n_samples)
customer_segments = np.random.choice([0, 1], size=n_samples, p=[0.7, 0.3])
previous_defaults = np.random.poisson(lam=0.5, size=n_samples)

# Create features dataframe
X = pd.DataFrame({
    'amount': amounts,
    'overdue_days': overdue_days,
    'customer_segment': customer_segments,
    'previous_defaults': previous_defaults
})

# Generate labels based on business rules
def assign_priority(row):
    if row['amount'] > 50000 or row['overdue_days'] > 90:
        return 'High'
    elif row['amount'] > 20000 or row['overdue_days'] > 60:
        return 'Medium'
    else:
        return 'Low'

y = X.apply(assign_priority, axis=1)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train_scaled, y_train)

# Evaluate
train_score = model.score(X_train_scaled, y_train)
test_score = model.score(X_test_scaled, y_test)

print(f"Case Prioritization Model")
print(f"Training Accuracy: {train_score:.3f}")
print(f"Testing Accuracy: {test_score:.3f}")

# Save model and scaler
joblib.dump(model, 'models/priority_model.pkl')
joblib.dump(scaler, 'models/priority_scaler.pkl')

print("\nModel saved to models/priority_model.pkl")
print("Scaler saved to models/priority_scaler.pkl")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

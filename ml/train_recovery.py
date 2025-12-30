import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Generate synthetic training data
np.random.seed(42)
n_samples = 1000

# Features: amount, overdue_days, customer_segment, previous_defaults, dca_performance
amounts = np.random.exponential(scale=30000, size=n_samples)
overdue_days = np.random.randint(1, 150, size=n_samples)
customer_segments = np.random.choice([0, 1], size=n_samples, p=[0.7, 0.3])
previous_defaults = np.random.poisson(lam=0.5, size=n_samples)
dca_performance = np.random.uniform(0.6, 0.9, size=n_samples)

# Create features dataframe
X = pd.DataFrame({
    'amount': amounts,
    'overdue_days': overdue_days,
    'customer_segment': customer_segments,
    'previous_defaults': previous_defaults,
    'dca_performance': dca_performance
})

# Generate recovery probability based on business logic
def calculate_recovery_prob(row):
    base_prob = 0.8
    
    # Adjust based on overdue days
    if row['overdue_days'] > 90:
        base_prob -= 0.3
    elif row['overdue_days'] > 60:
        base_prob -= 0.15
    elif row['overdue_days'] > 30:
        base_prob -= 0.05
    
    # Adjust based on amount
    if row['amount'] > 100000:
        base_prob -= 0.15
    elif row['amount'] > 50000:
        base_prob -= 0.08
    
    # Adjust based on customer segment
    if row['customer_segment'] == 1:  # Premium
        base_prob += 0.1
    
    # Adjust based on previous defaults
    base_prob -= row['previous_defaults'] * 0.05
    
    # Adjust based on DCA performance
    base_prob += (row['dca_performance'] - 0.75) * 0.2
    
    # Add some noise
    noise = np.random.normal(0, 0.05)
    
    return np.clip(base_prob + noise, 0.1, 0.95)

y = X.apply(calculate_recovery_prob, axis=1)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Gradient Boosting Regressor
model = GradientBoostingRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
model.fit(X_train_scaled, y_train)

# Evaluate
y_train_pred = model.predict(X_train_scaled)
y_test_pred = model.predict(X_test_scaled)

train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)

print(f"Recovery Probability Prediction Model")
print(f"Training RMSE: {train_rmse:.4f}")
print(f"Testing RMSE: {test_rmse:.4f}")
print(f"Training R²: {train_r2:.4f}")
print(f"Testing R²: {test_r2:.4f}")

# Save model and scaler
joblib.dump(model, 'models/recovery_model.pkl')
joblib.dump(scaler, 'models/recovery_scaler.pkl')

print("\nModel saved to models/recovery_model.pkl")
print("Scaler saved to models/recovery_scaler.pkl")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    # Arrange & Act
    response = client.get("/activities")
    
    # Assert
    assert response.status_code == 200
    assert "Chess Club" in response.json()

def test_signup_success():
    # Arrange
    email = "test_student@mergington.edu"
    activity = "Basketball Team"
    
    # Act
    response = client.post(f"/activities/{activity}/signup?email={email}")
    
    # Assert
    assert response.status_code == 200

def test_signup_duplicate():
    # Arrange
    email = "duplicate_student@mergington.edu"
    activity = "Swimming Club"
    client.post(f"/activities/{activity}/signup?email={email}")
    
    # Act
    response = client.post(f"/activities/{activity}/signup?email={email}")
    
    # Assert
    assert response.status_code == 400

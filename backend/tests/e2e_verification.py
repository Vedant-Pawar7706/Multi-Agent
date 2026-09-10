import httpx
import time

BASE_URL = "http://127.0.0.1:8000/api"

def run_e2e_check():
    print("[E2E] Starting End-to-End Verification Audit...")
    client = httpx.Client(timeout=30.0)

    # 1. Health check
    resp = client.get("http://127.0.0.1:8000/")
    assert resp.status_code == 200
    print(" [OK] 1. Backend Health Check Endpoint Passed.")

    # 2. Demo endpoint
    demo_resp = client.get(f"{BASE_URL}/demo/tokyo")
    assert demo_resp.status_code == 200
    demo_data = demo_resp.json()
    assert demo_data.get("is_demo") is True
    assert demo_data["itinerary"]["meta"]["destination"] == "Tokyo, Japan"
    print(" [OK] 2. Demo Dataset API Endpoint Passed.")

    # 3. User Registration & Auth
    email = f"traveler_{int(time.time())}@mytrip.app"
    reg_resp = client.post(f"{BASE_URL}/auth/register", json={
        "name": "Alex Mercer",
        "email": email,
        "password": "SecurePassword2026!"
    })
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(" [OK] 3. JWT Authentication & Registration Passed.")

    # 4. Create Trip
    trip_payload = {
        "destination": "Kyoto & Osaka, Japan",
        "start_date": "2026-10-01",
        "end_date": "2026-10-06",
        "duration_days": 5,
        "travelers": 2,
        "travel_type": "Couple",
        "travel_style": "Balanced",
        "interests": ["Culture", "Food", "Temples"],
        "budget": 120000.0,
        "currency": "INR"
    }
    trip_resp = client.post(f"{BASE_URL}/trips", json=trip_payload, headers=headers)
    assert trip_resp.status_code == 200
    trip = trip_resp.json()
    trip_id = trip["id"]
    print(f" [OK] 4. Trip Creation Endpoint Passed (Trip ID: {trip_id}).")

    # 5. Run Multi-Agent Orchestrator Pipeline (Non-blocking background launch)
    print(" [...] 5. Launching Multi-Agent Pipeline (Research -> Activity -> Budget -> Final Validator)...")
    plan_resp = client.post(f"{BASE_URL}/trips/{trip_id}/plan")
    assert plan_resp.status_code == 200
    plan_result = plan_resp.json()
    assert plan_result["status"] == "planning"

    # Poll status until completed
    completed = False
    for _ in range(15):
        time.sleep(1)
        trip_status_resp = client.get(f"{BASE_URL}/trips/{trip_id}")
        if trip_status_resp.json().get("status") == "completed":
            completed = True
            break
            
    assert completed is True
    guide_resp = client.get(f"{BASE_URL}/trips/{trip_id}/itinerary")
    assert guide_resp.status_code == 200
    guide = guide_resp.json()
    assert "itinerary" in guide
    assert "budget_breakdown" in guide
    print(" [OK] 5. Multi-Agent Pipeline Background Execution & Validation Passed.")

    # 6. Natural Language AI Command Bar Editing
    print(" [...] 6. Testing Natural Language AI Command Editing...")
    cmd_resp = client.post(f"{BASE_URL}/trips/{trip_id}/command", json={"command": "Make Day 2 less crowded and reduce budget"})
    assert cmd_resp.status_code == 200
    print(" [OK] 6. Natural Language AI Edit Endpoint Passed.")

    # 7. PDF Export Generation
    pdf_resp = client.get(f"{BASE_URL}/trips/{trip_id}/export/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 500
    print(" [OK] 7. ReportLab PDF Export Service Passed.")

    print("\n[SUCCESS] ALL E2E VERIFICATION CHECKS PASSED PERFECTLY!")

if __name__ == "__main__":
    run_e2e_check()

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.waste_records.models import WasteRecord


class WasteRecordsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_pipeline_simulate_endpoint(self):
        payload = {
            "detected_material": "PLASTIC",
            "moisture_pct": 5.0,
            "combustibility_index": 0.8,
            "recyclability_score": 0.75,
            "rdf_suitability_score": 0.6,
            "contamination_pct": 10.0,
        }
        response = self.client.post("/api/v1/pipeline/simulate/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)
        self.assertEqual(response.data["final_category"], "RECYCLE")

    def test_stats_summary_endpoint(self):
        # Trigger two simulations
        self.client.post("/api/v1/pipeline/simulate/", {
            "detected_material": "GLASS",
            "moisture_pct": 2.0,
            "combustibility_index": 0.0,
            "recyclability_score": 0.9,
            "rdf_suitability_score": 0.0,
            "contamination_pct": 5.0,
        }, format="json")

        response = self.client.get("/api/v1/stats/summary/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_processed"], 1)
        self.assertIn("by_category", response.data)
        self.assertIn("diversion_rate_pct", response.data)

    def test_records_list_endpoint(self):
        self.client.post("/api/v1/pipeline/simulate/", {
            "detected_material": "ORGANIC",
            "moisture_pct": 65.0,
            "combustibility_index": 0.1,
            "recyclability_score": 0.1,
            "rdf_suitability_score": 0.1,
            "contamination_pct": 10.0,
        }, format="json")

        response = self.client.get("/api/v1/records/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

from django.test import TestCase
from apps.decision_engine.models import DecisionConfig
from apps.decision_engine.rules import rule_based_decision
from apps.decision_engine.engine import decide_category, weighted_decision


class DecisionEngineTestCase(TestCase):
    def setUp(self):
        self.config = DecisionConfig.get_config()

    def test_glass_metal_override(self):
        features = {
            "detected_material": "GLASS",
            "detection_confidence": 0.9,
            "moisture_pct": 10.0,
            "combustibility_index": 0.0,
            "recyclability_score": 0.9,
            "rdf_suitability_score": 0.0,
            "contamination_pct": 5.0,
        }
        category, trace = rule_based_decision(features, config=self.config)
        self.assertEqual(category, "RECYCLE")
        self.assertIn("material_override_GLASS", trace["rules_fired"])

    def test_organic_high_moisture_bio(self):
        features = {
            "detected_material": "ORGANIC",
            "detection_confidence": 0.95,
            "moisture_pct": 65.0,
            "combustibility_index": 0.1,
            "recyclability_score": 0.1,
            "rdf_suitability_score": 0.1,
            "contamination_pct": 10.0,
        }
        category, trace = rule_based_decision(features, config=self.config)
        self.assertEqual(category, "BIO")

    def test_clean_plastic_recycle(self):
        features = {
            "detected_material": "PLASTIC",
            "detection_confidence": 0.92,
            "moisture_pct": 5.0,
            "combustibility_index": 0.7,
            "recyclability_score": 0.8,
            "rdf_suitability_score": 0.6,
            "contamination_pct": 10.0,
        }
        category, trace = rule_based_decision(features, config=self.config)
        self.assertEqual(category, "RECYCLE")

    def test_contaminated_plastic_rdf(self):
        features = {
            "detected_material": "PLASTIC",
            "detection_confidence": 0.88,
            "moisture_pct": 12.0,
            "combustibility_index": 0.75,
            "recyclability_score": 0.4,
            "rdf_suitability_score": 0.7,
            "contamination_pct": 45.0,
        }
        category, trace = rule_based_decision(features, config=self.config)
        self.assertEqual(category, "RDF")

    def test_hybrid_decision_engine(self):
        features = {
            "detected_material": "PAPER",
            "detection_confidence": 0.85,
            "moisture_pct": 8.0,
            "combustibility_index": 0.65,
            "recyclability_score": 0.75,
            "rdf_suitability_score": 0.5,
            "contamination_pct": 15.0,
        }
        category, trace, confidence = decide_category(features, mode="hybrid")
        self.assertEqual(category, "RECYCLE")
        self.assertGreaterEqual(confidence, 0.5)

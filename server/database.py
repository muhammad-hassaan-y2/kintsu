import os
import json
from typing import Dict, Any, List, Optional

DB_FILE_PATH = os.path.join(os.path.dirname(__file__), "data", "db.json")

class JsonDatabase:
    def __init__(self):
        self.data: Dict[str, List[Any]] = self._load_db()

    def _load_db(self) -> Dict[str, List[Any]]:
        try:
            if os.path.exists(DB_FILE_PATH):
                with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load db.json, using defaults: {e}")

        return {
            "users": [],
            "sessions": [],
            "stories": [],
            "books": [],
            "participants": [],
            "roleplayScenarios": [],
            "roleplayLogs": [],
            "progressEntries": []
        }

    def _save_db(self) -> None:
        try:
            os.makedirs(os.path.dirname(DB_FILE_PATH), exist_ok=True)
            with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error: Failed to save db.json: {e}")

    def get_collection(self, collection_name: str) -> List[Dict[str, Any]]:
        return self.data.get(collection_name, [])

    def find_by_id(self, collection_name: str, id_value: str) -> Optional[Dict[str, Any]]:
        items = self.get_collection(collection_name)
        for item in items:
            if item.get("id") == id_value or item.get("draftId") == id_value or item.get("scenarioId") == id_value or item.get("logId") == id_value:
                return item
        return None

    def insert(self, collection_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        if collection_name not in self.data:
            self.data[collection_name] = []
        self.data[collection_name].insert(0, item)
        self._save_db()
        return item

    def update(self, collection_name: str, id_value: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        items = self.get_collection(collection_name)
        for i, item in enumerate(items):
            if item.get("id") == id_value or item.get("draftId") == id_value or item.get("scenarioId") == id_value or item.get("logId") == id_value:
                updated_item = {**item, **update_data}
                self.data[collection_name][i] = updated_item
                self._save_db()
                return updated_item
        return None

    def delete(self, collection_name: str, id_value: str) -> bool:
        items = self.get_collection(collection_name)
        for i, item in enumerate(items):
            if item.get("id") == id_value or item.get("draftId") == id_value or item.get("scenarioId") == id_value or item.get("logId") == id_value:
                self.data[collection_name].pop(i)
                self._save_db()
                return True
        return False

db = JsonDatabase()

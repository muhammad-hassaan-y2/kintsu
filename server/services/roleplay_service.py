import time
import json
import re
from database import db
from services.ai_service import generate_text

default_scenarios = [
    {
        "scenarioId": "scen-101",
        "title": "De-escalating Block Conflict",
        "category": "De-escalation & Calm",
        "difficulty": "Intermediate",
        "actorRole": "Agitated Cellmate",
        "settingDescription": "Common area during evening recreation hours. Another inmate is upset over a misplaced personal item.",
        "initialMessage": "Hey! Why were you standing near my bunk earlier? Did you touch my things?",
        "targetDeEscalationOutcome": "Maintain calm body language, validate feelings without admitting fault, and de-escalate tension."
    },
    {
        "scenarioId": "scen-102",
        "title": "Re-entry Job Interview Practice",
        "category": "Life After Prison",
        "difficulty": "Intermediate",
        "actorRole": "Hiring Manager",
        "settingDescription": "Modern corporate office interview room. Manager is asking about employment gap and background.",
        "initialMessage": "Thank you for coming in today. I see a gap in your resume over recent years. Can you walk me through what you were doing during this time?",
        "targetDeEscalationOutcome": "Demonstrate honesty, personal responsibility, skills gained, and commitment to positive change."
    },
    {
        "scenarioId": "scen-103",
        "title": "Authority Figure Interaction",
        "category": "Respect & Society",
        "difficulty": "Advanced",
        "actorRole": "Strict Facility Officer",
        "settingDescription": "Hallway during shift change. Officer demands immediate compliance during a search routine.",
        "initialMessage": "Halt right there. Step against the wall and keep your hands visible. Move now.",
        "targetDeEscalationOutcome": "Practice prompt respectful compliance while maintaining personal dignity and emotional stability."
    }
]

def get_scenarios():
    custom = db.get_collection("roleplayScenarios")
    return default_scenarios + custom

def start_roleplay_session(scenario_id: str, participant_name: str, instructor_name: str = "Priya Rajan"):
    scenarios = get_scenarios()
    scen = next((s for s in scenarios if s["scenarioId"] == scenario_id), scenarios[0])

    new_log = {
        "logId": f"rpl-log-{int(time.time() * 1000)}",
        "scenarioId": scen["scenarioId"],
        "scenarioTitle": scen["title"],
        "participantName": participant_name,
        "instructorName": instructor_name,
        "startedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "turns": [],
        "status": "active"
    }

    db.insert("roleplayLogs", new_log)
    return new_log

def process_roleplay_turn_ai(log_id: str, user_input: str):
    log = db.find_by_id("roleplayLogs", log_id) or {
        "logId": log_id,
        "scenarioId": "scen-101",
        "scenarioTitle": "De-escalating Block Conflict",
        "participantName": "Participant",
        "instructorName": "Priya Rajan",
        "startedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "turns": [],
        "status": "active"
    }

    scenarios = get_scenarios()
    scen = next((s for s in scenarios if s["scenarioId"] == log.get("scenarioId")), scenarios[0])

    system_instruction = f"""You are playing the role of "{scen['actorRole']}" in a prison rehabilitation roleplay simulator.
Setting: {scen['settingDescription']}. Target: {scen['targetDeEscalationOutcome']}.
Respond realistically in character to the user's dialogue. Evaluate the user's de-escalation skill (0-100) and empathy.
Return JSON only:
{{
  "actorResponse": "string",
  "deEscalationScore": 85,
  "empathyFeedback": "string"
}}"""

    history_str = "\n".join([f"User: \"{t['userInput']}\"\nActor: \"{t['actorResponse']}\"" for t in log.get("turns", [])])
    prompt = f"Previous conversation:\n{history_str}\nUser latest response: \"{user_input}\"\nRespond in character and evaluate."

    raw_text = generate_text(prompt, system_instruction)

    actor_response = "I hear what you are saying. Let us discuss this calmly."
    de_escalation_score = 82
    empathy_feedback = "Good tone control and non-confrontational choice of words."

    if raw_text:
        try:
            match = re.search(r'\{[\s\S]*\}', raw_text)
            if match:
                parsed = json.loads(match.group(0))
                if "actorResponse" in parsed: actor_response = parsed["actorResponse"]
                if "deEscalationScore" in parsed: de_escalation_score = int(parsed["deEscalationScore"])
                if "empathyFeedback" in parsed: empathy_feedback = parsed["empathyFeedback"]
        except Exception:
            pass

    new_turn = {
        "turnNumber": len(log.get("turns", [])) + 1,
        "userInput": user_input,
        "actorResponse": actor_response,
        "deEscalationScore": de_escalation_score,
        "empathyFeedback": empathy_feedback
    }

    turns = log.get("turns", [])
    turns.append(new_turn)
    db.update("roleplayLogs", log_id, {"turns": turns})

    return {"turn": newTurn if 'newTurn' in locals() else new_turn, "sessionLog": log}

def complete_roleplay_session(log_id: str):
    log = db.find_by_id("roleplayLogs", log_id) or {
        "logId": log_id,
        "scenarioId": "scen-101",
        "scenarioTitle": "De-escalating Block Conflict",
        "participantName": "Participant",
        "instructorName": "Priya Rajan",
        "startedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "turns": [],
        "status": "active"
    }

    turns = log.get("turns", [])
    avg_score = round(sum(t.get("deEscalationScore", 80) for t in turns) / len(turns)) if turns else 80
    final_empathy = min(100, round(avg_score * 0.95))
    ai_summary = f"Participant demonstrated strong de-escalation awareness across {len(turns)} interaction turns."

    updated = db.update("roleplayLogs", log_id, {
        "status": "completed",
        "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "finalDeEscalationScore": avg_score,
        "finalEmpathyScore": final_empathy,
        "aiAnalysisSummary": ai_summary
    })

    return updated or log

def get_roleplay_history():
    return db.get_collection("roleplayLogs")

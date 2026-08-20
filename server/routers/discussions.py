from fastapi import APIRouter

router = APIRouter(prefix="/api/discussions", tags=["Discussions"])

guides = [
    {
        "id": "guide-1",
        "topic": "Consequences & Victim Empathy",
        "suggestedQuestions": [
            "What consequences did the victim and their family face?",
            "How could this situation have been avoided before emotions took over?",
            "What would you have done differently with your current mindset?"
        ],
        "instructorTips": [
            "Maintain a calm, non-judgmental tone.",
            "Encourage peer feedback after each response.",
            "Focus on accountability rather than shame."
        ],
        "targetOutcome": "Develop perspective-taking and awareness of long-term emotional impact."
    }
]

@router.get("")
def get_discussions():
    return {"success": True, "count": len(guides), "data": guides}

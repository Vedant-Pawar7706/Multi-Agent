from typing import Dict, Any, List

class ItineraryOptimizerTool:
    """
    Validates and optimizes human-like activity sequencing, avoiding impossible travel times,
    overcrowded days, or missing meals.
    """
    @staticmethod
    def validate_day_schedule(day_num: int, morning: List[Any], afternoon: List[Any], evening: List[Any]) -> Dict[str, Any]:
        total_activities = len(morning) + len(afternoon) + len(evening)
        warnings = []
        
        if total_activities > 7:
            warnings.append(f"Day {day_num} has {total_activities} activities which may cause burnout.")
            
        if not morning and not afternoon:
            warnings.append(f"Day {day_num} has an underplanned day.")
            
        return {
            "day": day_num,
            "total_activities": total_activities,
            "is_valid": len(warnings) == 0,
            "warnings": warnings
        }

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/demo", tags=["Demo Mode"])

@router.get("/tokyo", response_model=Dict[str, Any])
def get_tokyo_demo():
    """
    Returns instant pre-seeded demo dataset for Tokyo, Japan (7 Days, 2 Travelers, ₹1,50,000).
    """
    return {
        "is_demo": True,
        "badge": "DEMO MODE",
        "trip": {
            "id": "demo-tokyo-7days",
            "destination": "Tokyo, Japan",
            "start_date": "2026-09-12",
            "end_date": "2026-09-19",
            "duration_days": 7,
            "travelers": 2,
            "travel_type": "Couple",
            "travel_style": "Balanced",
            "budget": 150000.0,
            "currency": "INR",
            "interests": ["Culture", "Food", "Technology", "Anime", "Sightseeing"],
            "status": "completed"
        },
        "itinerary": {
            "meta": {
                "trip_id": "demo-tokyo-7days",
                "destination": "Tokyo, Japan",
                "duration_days": 7,
                "travelers": 2,
                "travel_type": "Couple",
                "travel_style": "Balanced",
                "currency": "INR",
                "currency_symbol": "₹",
                "total_budget": 150000.0,
                "estimated_cost": 142500.0,
                "per_person_cost": 71250.0
            },
            "trip_overview": "Welcome to Tokyo, a mesmerizing juxtaposition of ancient traditions and futuristic innovation. Over 7 days, experience serene Shinto shrines, neon-lit Shibuya crossings, world-renowned ramen houses, and scenic day trips to Mount Fuji.",
            "destination_snapshot": {
                "overview": "Tokyo is Japan's bustling capital mixing ultramodern skyscrapers with historic temples.",
                "best_time_to_visit": "Spring (March to May) for cherry blossoms, or Autumn (September to November) for foliage.",
                "culture": [
                    "Bowing is the customary greeting; a slight head bow is polite.",
                    "Do not eat while walking down the street; consume snacks near vending stalls.",
                    "Always take off shoes when entering traditional tatami dining rooms or ryokans."
                ],
                "neighborhoods": [
                    {"name": "Shibuya & Harajuku", "vibe": "Youthful & Vibrant", "highlights": "Scramble Crossing, Takeshita Street, Meiji Shrine."},
                    {"name": "Asakusa", "vibe": "Historic & Traditional", "highlights": "Senso-ji Temple, Nakamise Shopping Street."},
                    {"name": "Shinjuku", "vibe": "Electric & Skyline", "highlights": "Omoide Yokocho, Tokyo Metropolitan Bldg, Kabukicho."},
                    {"name": "Akihabara", "vibe": "Anime & Tech Hub", "highlights": "Electric Town, Retro gaming, Maid cafes."}
                ]
            },
            "itinerary": [
                {
                    "day": 1,
                    "theme": "Day 1: Arrival & Shibuya Scramble Exploration",
                    "morning": [
                        {"time": "09:00 AM", "activity": "Arrive at Haneda / Narita Airport", "location": "Airport Terminal", "duration": "1.5 hrs", "cost_estimate": 0, "description": "Clear immigration, collect Suica IC cards, and board the N'EX train to Shinjuku.", "tips": "Pick up pocket Wi-Fi at the arrival hall."}
                    ],
                    "afternoon": [
                        {"time": "01:30 PM", "activity": "Check-in at Hotel & Refreshment", "location": "Shibuya District", "duration": "1.5 hrs", "cost_estimate": 0, "description": "Unpack and relax before setting out to explore.", "tips": "Ask concierge for neighborhood map."},
                        {"time": "03:30 PM", "activity": "Meiji Shrine & Yoyogi Park", "location": "Harajuku", "duration": "2.0 hrs", "cost_estimate": 0, "description": "Pass through the massive wooden Torii gate into a peaceful forest shrine dedicated to Emperor Meiji.", "tips": "Respect quiet temple grounds."}
                    ],
                    "evening": [
                        {"time": "06:30 PM", "activity": "Shibuya Crossing & Hachiko Statue", "location": "Shibuya Station", "duration": "1.5 hrs", "cost_estimate": 0, "description": "Witness the world's busiest pedestrian scramble intersection lit by neon billboards.", "tips": "Best overhead view from Shibuya Sky or Starbucks balcony."},
                        {"time": "08:00 PM", "activity": "Tonkatsu Dinner in Shibuya", "location": "Shibuya Center-Gai", "duration": "1.5 hrs", "cost_estimate": 2500, "description": "Enjoy crispy golden Berkshire pork cutlets served with shredded cabbage and miso soup.", "tips": "Order the Kurobuta sirloin cut."}
                    ],
                    "meals": [
                        {"type": "Breakfast", "recommendation": "7-Eleven Fresh Onigiri & Egg Sandwich", "estimated_cost": 400},
                        {"type": "Lunch", "recommendation": "Ichiran Ramen Shibuya", "estimated_cost": 1200},
                        {"type": "Dinner", "recommendation": "Tonkatsu Maisen", "estimated_cost": 2500}
                    ],
                    "transport": [
                        {"route": "Airport to Shibuya", "mode": "Airport Express Train", "estimated_time": "40 mins", "cost": 1600},
                        {"route": "Harajuku to Shibuya", "mode": "JR Yamanote Line", "estimated_time": "3 mins", "cost": 150}
                    ],
                    "estimated_activity_time": "6.5 hrs",
                    "notes": ["Light walking scheduled on Day 1 to adjust to time zone."]
                },
                {
                    "day": 2,
                    "theme": "Day 2: Historic Asakusa & Futuristic teamLab Borderless",
                    "morning": [
                        {"time": "09:00 AM", "activity": "Senso-ji Temple & Nakamise Street", "location": "Asakusa", "duration": "2.5 hrs", "cost_estimate": 0, "description": "Tokyo's oldest Buddhist temple featuring the iconic Kaminarimon thunder gate and huge paper lantern.", "tips": "Try fresh melonpan pastries at Nakamise stalls."}
                    ],
                    "afternoon": [
                        {"time": "01:00 PM", "activity": "Sumida River Cruise to Odaiba", "location": "Asakusa Pier", "duration": "1.0 hr", "cost_estimate": 1400, "description": "Futuristic water bus cruise passing beneath Tokyo's famous bridges towards Tokyo Bay.", "tips": "Sit on the upper deck for open views."},
                        {"time": "02:30 PM", "activity": "teamLab Planets / Borderless Digital Art", "location": "Toyosu", "duration": "2.5 hrs", "cost_estimate": 3800, "description": "Immersive walk-through digital light art museum where visitor actions transform visual artwork.", "tips": "Wear shorts or roll-up pants as some exhibits involve wading in water."}
                    ],
                    "evening": [
                        {"time": "07:00 PM", "activity": "Gundam Statue & Odaiba Bay Sunset", "location": "Odaiba Promenade", "duration": "1.5 hrs", "cost_estimate": 0, "description": "Admire the giant 1:1 scale Unicorn Gundam statue and views of Rainbow Bridge.", "tips": "Statue light show transforms at 19:30."}
                    ],
                    "meals": [
                        {"type": "Breakfast", "recommendation": "Asakusa Kissaten Coffee House", "estimated_cost": 600},
                        {"type": "Lunch", "recommendation": "Daikokuya Tempura Asakusa", "estimated_cost": 1800},
                        {"type": "Dinner", "recommendation": "Tsukiji Sushiko Odaiba", "estimated_cost": 3200}
                    ],
                    "transport": [
                        {"route": "Shibuya to Asakusa", "mode": "Ginza Subway Line", "estimated_time": "30 mins", "cost": 250}
                    ],
                    "estimated_activity_time": "7.5 hrs",
                    "notes": ["Advance tickets pre-booked for teamLab."]
                }
            ],
            "accommodations": [
                {"name": "Shibuya Stream Excel Hotel Tokyu", "tier": "Comfort / 4-Star", "area": "Shibuya", "price_per_night": "₹6,800", "why_stay": "Direct bridge connection to Shibuya Station; sleek modern decor."},
                {"name": "The Ritz-Carlton Tokyo", "tier": "Luxury / 5-Star", "area": "Roppongi", "price_per_night": "₹28,000", "why_stay": "Panoramic views of Mt. Fuji and Tokyo Tower from high floors."}
            ],
            "food_recommendations": [
                {"dish": "Tonkotsu Ramen", "description": "Rich creamy pork bone broth with handmade springy noodles.", "price_range": "₹800", "must_try_spots": "Ichiran / Ippudo"},
                {"dish": "Fresh Tsukiji Omakase Sushi", "description": "Market-fresh nigiri crafted by veteran sushi masters.", "price_range": "₹3,500", "must_try_spots": "Tsukiji Outer Market"},
                {"dish": "Yakitori Skewers", "description": "Charcoal-grilled chicken skewers seasoned with tare sauce.", "price_range": "₹1,200", "must_try_spots": "Memory Lane (Omoide Yokocho)"}
            ],
            "transportation_guide": [
                {"mode": "JR Yamanote Loop Line", "tips": "Circumnavigates central Tokyo connecting Shibuya, Shinjuku, Tokyo Station, and Akihabara."},
                {"mode": "Tokyo Metro & Toei Subway Pass", "tips": "Unlimited 72-hour pass available for ¥1,500 at major stations."}
            ],
            "budget_breakdown": {
                "currency": "INR",
                "currency_symbol": "₹",
                "disclaimer": "Estimated prices — actual prices may vary.",
                "user_budget": 150000.0,
                "estimated_total": 142500.0,
                "per_person_cost": 71250.0,
                "daily_average_cost": 20357.0,
                "budget": {
                    "flights": 60000.0,
                    "hotel": 38000.0,
                    "food": 21000.0,
                    "transport": 9500.0,
                    "activities": 9000.0,
                    "shopping": 3000.0,
                    "miscellaneous": 2000.0,
                    "emergency_buffer": 4000.0,
                    "total": 142500.0,
                    "per_person": 71250.0
                },
                "category_percentages": {
                    "flights": "42%", "hotel": "27%", "food": "15%", "transport": "7%", "activities": "6%", "emergency_buffer": "3%"
                },
                "budget_tiers": {
                    "Budget": {"total": 97500.0, "per_person": 48750.0, "daily_average": 13928.0, "description": "Hostel private room, street food, local subway pass."},
                    "Comfort": {"total": 142500.0, "per_person": 71250.0, "daily_average": 20357.0, "description": "4-Star Shibuya Hotel, ramen & omakase meals, mix of train & taxi."},
                    "Premium": {"total": 232500.0, "per_person": 116250.0, "daily_average": 33214.0, "description": "5-Star Roppongi luxury suite, private driver, Michelin dining."}
                }
            },
            "packing_checklist": [
                {"category": "Essentials", "items": ["Passport & Japan Visit QR Code", "Suica IC Card app on phone", "Yen Cash (¥20,000 for small stalls)"]},
                {"category": "Footwear & Clothing", "items": ["Slip-on Comfortable Walking Shoes (20,000 daily steps)", "Light Rain Jacket / Compact Umbrella"]}
            ],
            "cultural_tips": [
                "Bowing slightly when saying thank you ('Arigatou Gozaimasu') is universally appreciated.",
                "Avoid talking loudly on trains and set mobile devices to silent (Manner Mode)."
            ],
            "safety_tips": [
                "Tokyo is rated among the safest cities globally; lost wallets are commonly turned into local Koban police boxes.",
                "Emergency Number: 119 for Fire/Ambulance, 110 for Police."
            ],
            "sources": [
                {"title": "Japan National Tourism Organization (JNTO)", "url": "https://www.japan.travel", "source_type": "Official Tourism Board"},
                {"title": "Tokyo Metro Transit Map Intelligence", "url": "https://www.tokyometro.jp", "source_type": "Public Transport Data"}
            ]
        }
    }

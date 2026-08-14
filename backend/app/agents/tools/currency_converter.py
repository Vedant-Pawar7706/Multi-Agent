from typing import Dict, Any

# Static exchange rate matrix relative to USD
EXCHANGE_RATES_TO_USD: Dict[str, float] = {
    "USD": 1.0,
    "INR": 83.5,
    "EUR": 0.92,
    "GBP": 0.78,
    "JPY": 155.0,
    "AED": 3.67,
    "AUD": 1.52,
    "CAD": 1.36,
    "SGD": 1.35,
    "CHF": 0.90
}

class CurrencyConverterTool:
    @staticmethod
    def convert(amount: float, from_currency: str, to_currency: str) -> float:
        from_curr = from_currency.upper()
        to_curr = to_currency.upper()
        
        if from_curr not in EXCHANGE_RATES_TO_USD or to_curr not in EXCHANGE_RATES_TO_USD:
            return amount # Fallback 1:1 if unsupported
            
        usd_amount = amount / EXCHANGE_RATES_TO_USD[from_curr]
        converted = usd_amount * EXCHANGE_RATES_TO_USD[to_curr]
        return round(converted, 2)

    @staticmethod
    def get_symbol(currency: str) -> str:
        symbols = {
            "INR": "₹",
            "USD": "$",
            "EUR": "€",
            "GBP": "£",
            "JPY": "¥",
            "AED": "AED ",
            "AUD": "A$",
            "CAD": "C$",
            "SGD": "S$",
            "CHF": "CHF "
        }
        return symbols.get(currency.upper(), currency.upper() + " ")

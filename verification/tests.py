"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": {
        "house": [
            "", "S", "S", "",
            "E", "NW", "NS", "",
            "E", "WS", "NS", "",
            "", "N", "N", ""]
    },
    "Extra": {
        "house": [
            "", "", "", "",
            "E", "ESW", "ESW", "W",
            "E", "ENW", "ENW", "W",
            "", "N", "N", ""]
    }
}

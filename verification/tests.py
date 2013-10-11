"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "1. Basics": {
        "house": [
            "", "S", "S", "",
            "E", "NW", "NS", "",
            "E", "WS", "NS", "",
            "", "N", "N", ""]
    },
    "2. Basics": {
        "house": [
            "", "", "", "",
            "E", "ESW", "ESW", "W",
            "E", "ENW", "ENW", "W",
            "", "", "", ""]
    },
    "3. Extra": {
        "house": [
            "", "", "ES", "W",
            "E", "W", "N", "",
            "E", "WS", "S", "",
            "", "N", "N", ""]
    },
    "4. Extra": {
        "house": [
            "", "S", "", "",
            "E", "WNE", "W", "",
            "", "E", "W", "",
            "", "E", "W", ""]
    },

}

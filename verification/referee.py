from math import hypot
import random
from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.multicall import CheckiORefereeMulti

from tests import TESTS

MAX_STEP = 30

DIRS = {
    "N": -4,
    "S": 4,
    "E": 1,
    "W": -1
}


def initial_referee(data):
    data["stephan"] = 16
    data["ghost"] = 1
    data['step_count'] = 0
    return data


def process_referee(referee_data, user_result):
    referee_data['step_count'] += 1
    stephen = referee_data["stephen"]
    ghost = referee_data["ghost"]
    house = referee_data["house"]
    if referee_data['step_count'] > MAX_STEP:
        referee_data.update({"result": False, "result_addon": "Too many moves."})
        return referee_data
    if not isinstance(user_result, str) or user_result not in "NSWE":
        referee_data.update({"result": False, "result_addon": 'The function should return "N", "S", "W" or "E".'})
        return referee_data
    if user_result in referee_data["house"][stephen - 1]:
        referee_data.update({"result": False, "result_addon": 'Stefan ran into a closed door. It was hurt.'})
        return referee_data
    if stephen == 1 and user_result == "N":
        referee_data.update({"result": True, "result_addon": 'Stefan has escaped.', 'stephen': 0})
        return referee_data
    stephen += DIRS[user_result]
    if ((user_result == "W" and stephen % 4 == 1) or (user_result == "E" and stephen % 4 == 0) or
            (stephen < 1) or (stephen > 16)):
        referee_data.update({"result": False, "result_addon": 'Stefan has gone out into the unknown.'})
        return referee_data
    referee_data["stephen"] = stephen
    sx, sy = stephen % 4, ((stephen - 1) // 4) + 1
    ghost_dirs = [ch for ch in "NWES" if ch not in house[ghost - 1]]
    if ghost % 4 == 1 and "W" in ghost_dirs:
        ghost_dirs.remove("W")
    if ghost % 4 == 0 and "E" in ghost_dirs:
        ghost_dirs.remove("E")
    ghost_dist = ["", 1000]
    for d in ghost_dirs:
        new_ghost = ghost + DIRS[d]
        gx, gy = new_ghost % 4, ((new_ghost - 1) // 4) + 1
        dist = (gx - sx) ** 2 + (gy - sy) ** 2
        if ghost_dist[1] > dist:
            ghost_dist = [d, dist]
        elif ghost_dist[1] == dist:
            ghost_dist[0] += d
    ghost_move = random.choice(ghost_dist[0])
    ghost += DIRS[ghost_move]
    referee_data.update({"result": False,
                         "result_addon": 'Stefan has gone out into the unknown.',
                         "ghost": ghost,
                         "ghost_move": ghost_move})
    return referee_data


def is_win_referee(referee_data):
    return referee_data['stephen'] == 0


api.add_listener(
    ON_CONNECT,
    CheckiORefereeMulti(
        tests=TESTS,
        initial_referee=initial_referee,
        process_referee=process_referee,
        is_win_referee=is_win_referee,
    ).on_ready)

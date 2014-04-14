from math import hypot
import random
from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.multicall import CheckiORefereeMulti
from checkio.referees.cover_codes import unwrap_args

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
    data["input"] = [data["house"], 16, 1]
    return data


def process_referee(referee_data, user_result):
    referee_data['step_count'] += 1
    stephan = referee_data["stephan"]
    ghost = referee_data["ghost"]
    house = referee_data["house"]
    referee_data["ghost_move"] = ""
    if referee_data['step_count'] > MAX_STEP:
        referee_data.update({"result": False, "result_addon": "Too many moves.", "stephan_move": ""})
        return referee_data
    if not isinstance(user_result, str) or user_result not in "NSWE":
        referee_data.update({"result": False, "result_addon": 'The function should return N, S, W or E.'})
        return referee_data
    referee_data["stephan_move"] = user_result
    if user_result in referee_data["house"][stephan - 1]:
        referee_data.update({"result": False, "result_addon": 'Stefan ran into a closed door. It was hurt.', "wall": True})
        return referee_data
    if stephan == 1 and user_result == "N":
        referee_data.update({"result": True, "result_addon": 'Stefan has escaped.', 'stephan': 0})
        return referee_data
    stephan += DIRS[user_result]
    if ((user_result == "W" and stephan % 4 == 0) or (user_result == "E" and stephan % 4 == 1) or
            (stephan < 1) or (stephan > 16)):
        referee_data.update({"result": False, "result_addon": 'Stefan has gone out into the darkness.'})
        return referee_data
    referee_data["stephan"] = stephan
    sx, sy = (stephan - 1) % 4, (stephan - 1) // 4
    ghost_dirs = [ch for ch in "NWES" if ch not in house[ghost - 1]]
    if ghost % 4 == 1 and "W" in ghost_dirs:
        ghost_dirs.remove("W")
    if ghost % 4 == 0 and "E" in ghost_dirs:
        ghost_dirs.remove("E")
    if ghost <= 4 and "N" in ghost_dirs:
        ghost_dirs.remove("N")
    if ghost > 12 and "S" in ghost_dirs:
        ghost_dirs.remove("S")

    ghost_dist = ["", 1000]
    for d in ghost_dirs:
        new_ghost = ghost + DIRS[d]
        gx, gy = (new_ghost - 1) % 4, (new_ghost - 1) // 4
        dist = (gx - sx) ** 2 + (gy - sy) ** 2
        if ghost_dist[1] > dist:
            ghost_dist = [d, dist]
        elif ghost_dist[1] == dist:
            ghost_dist[0] += d
    ghost_move = random.choice(ghost_dist[0])
    ghost += DIRS[ghost_move]
    if ghost == stephan:
        referee_data.update({"result": False, "result_addon": 'The ghost caught Stephan.', "ghost": ghost,
                             "ghost_move": ghost_move, })
        return referee_data
    referee_data.update({"result": True,
                         "result_addon": 'Next move.',
                         "ghost": ghost,
                         "ghost_move": ghost_move,
                         "input": [house, stephan, ghost],
                         "wall": False})
    return referee_data


def is_win_referee(referee_data):
    return referee_data['stephan'] == 0


api.add_listener(
    ON_CONNECT,
    CheckiORefereeMulti(
        tests=TESTS,
        initial_referee=initial_referee,
        process_referee=process_referee,
        is_win_referee=is_win_referee,
        cover_code={
            "python-27": unwrap_args,
            "python-3": unwrap_args
        }
    ).on_ready)

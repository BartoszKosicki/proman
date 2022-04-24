from functools import wraps
from flask import jsonify


def json_response(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


def only_column_names(data):
    """Return list of name columns from json."""
    names = ""
    for record in data:
        names += record['title'] + ", "
    return names[: -2]

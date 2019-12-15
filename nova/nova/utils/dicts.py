# Helper methods for dictionary operations


def get_subdict(d, keys):
    return {k: d[k] for k in keys if (k in d)}

import os
import platform
from pathlib import Path


def create_dir_if_not_exists(path):
    try:
        Path(path).mkdir(parents=True)
    except FileExistsError:
        pass


CRED_KEYS = ['MERCATUS_DB_NAME', 'MERCATUS_DB_USER', 'MERCATUS_DB_PASSWORD', 'MERCATUS_DB_HOST',
             'MERCATUS_DB_PORT', 'MERCATUS_TEST_DB_NAME',
             'MERCATUS_EMAIL_HOST', 'MERCATUS_EMAIL_HOST_USER', 'MERCATUS_EMAIL_HOST_PASSWORD',
             'MERCATUS_EMAIL_HOST_PORT']

CONDA_DIR = os.path.join(os.environ.get("CONDA_PREFIX"), "etc", "conda")
ACTIVATE_DIR = os.path.join(CONDA_DIR, "activate.d")
DEACTIVATE_DIR = os.path.join(CONDA_DIR, "deactivate.d")

if platform.system() == 'Windows':
    def set(k, v):
        return f"set {k}='{v}'"


    def unset(k):
        return f"set {k}="


    SCRIPT_NAME = "env_vars.bat"

else:
    def set(k, v):
        return f"export {k}='{v}'"


    def unset(k):
        return f"unset {k}"


    SCRIPT_NAME = "env_vars.sh"

sets = ""
unsets = ""

for k in CRED_KEYS:
    v = input(f"{k}=")

    sets += set(k, v) + os.linesep
    unsets += unset(k) + os.linesep

create_dir_if_not_exists(ACTIVATE_DIR)
create_dir_if_not_exists(DEACTIVATE_DIR)

with open(os.path.join(ACTIVATE_DIR, SCRIPT_NAME), 'a+') as f:
    f.write(sets)

with open(os.path.join(DEACTIVATE_DIR, SCRIPT_NAME), 'a+') as f:
    f.write(unsets)

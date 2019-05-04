export FLASK_APP=flaskr
export FLASK_ENV=development

BASE_DIR="./.."
export MERCATUS_SETTINGS="$BASE_DIR/../settings/settings.py"
flask initdb

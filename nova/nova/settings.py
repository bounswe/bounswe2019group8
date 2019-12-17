"""
Django settings for nova project.

Generated by 'django-admin startproject' using Django 2.2.6.

For more information on this file, see

https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'v5(xfk^f7*50*=y0ur4o*=^glca1x4zn@ud!y-_ea#^bex2&-u'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'nova',
    'corsheaders',
    'django_filters',
    'rest_framework_swagger'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware'
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = ['http://localhost:3000']
CORS_ORIGIN_REGEX_WHITELIST = ['http://localhost:3000']

ROOT_URLCONF = 'nova.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'nova.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('MERCATUS_DB_NAME'),
        'USER': os.environ.get('MERCATUS_DB_USER'),
        'PASSWORD': os.environ.get('MERCATUS_DB_PASSWORD'),
        'HOST': os.environ.get('MERCATUS_DB_HOST'),
        'PORT': os.environ.get('MERCATUS_DB_PORT'),
        'TEST': {
            'NAME': os.environ.get('MERCATUS_TEST_DB_NAME'),
        }
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DATE_INPUT_FORMATS': ['iso-8601'],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema',
}

SWAGGER_SETTINGS = {
    'DOC_EXPANSION': 'list',
    'SHOW_REQUEST_HEADERS': True,
    'USE_SESSION_AUTH': False,
    'SECURITY_DEFINITIONS': {
        "api_key": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
        },
    },
    'OPERATIONS_SORTER': 'method',
    'APIS_SORTER': 'alpha',
}

AUTH_USER_MODEL = 'nova.User'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'mercatus.bounswe@gmail.com'
# this app password is configured for the host email
EMAIL_HOST_PASSWORD = 'fnyycxorasikyxkl'
EMAIL_PORT = 587

MEDIA_ROOT = os.path.join(BASE_DIR, '')
MEDIA_URL = '/media/'

ALPHAVANTAGE_KEYS = ['QZQCYEL31RPUPJOR', 'E0SOC3U8P5FOU8UB', 'CWEM01JWXJIDKX8Q', '4W7D04POAPQBNF7T',
                     '97LZVT2HISVPQ4I8', 'LSKLJ3TNMU80DC70', 'TV8RYYNXJ5HCXB73', '87XUVGCMPJRWIKZ9', 'ROZ4FSD96A0UA3VY',
                     'D5G9T6LX297WEZXA', '3IA7WIBFQ24K5BFU', 'BFXJTNL6L7ALTXPF', 'BUESYAYPM8LTQZ5M',
                     'KK1IYE6BI48S5YEG', 'YT3WLJ1EYL0T1GGX', 'I8KLE0V6XO9ZCX7K', 'B3MI5470OG9YIK62',
                     'N25X0M9V2UL3BJBV', '3ED6BWNGC9YCHN9L', '7JACNWU6TIM3F6D6', 'AAT4EC9XDANMOZYF', 'QQJ1PGSBLS6X115A']

AV_URLS = {'alpha': 'https://www.alphavantage.co/', 'api': 'https://www.alphavantage.co/query?function',
           'phy_cur': 'physical_currency_list', 'dig_cur': 'digital_currency_list'}

AV_EXCLUDE = {'TRY_CNY', 'TRY_AUD', 'TRY_MXN', 'CNY_MXN', 'CNY_TRY', 'MXN_TRY', 'BCH_CNY', 'BCH_MXN', 'MXN_CNY'}

FX_CURRENCY_LIST = {'USD', 'EUR', 'TRY', 'JPY', 'AUD', 'CAD', 'CNY', 'CHF', 'GBP', 'MXN', 'SGD'}
DIG_CURRENCY_LIST = {'BTC', 'LTC', 'ETH', 'ZEC', 'DASH', 'XRP', 'XMR', 'NEO', 'EOS'}

NASDAQ_BASE_URL = "https://api.nasdaq.com/api/quote"

CRON_JOB_KEY = os.environ.get('CRON_JOB_KEY')

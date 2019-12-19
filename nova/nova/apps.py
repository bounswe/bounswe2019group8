from django.apps import AppConfig


class NovaAppConfig(AppConfig):
    name = 'nova'

    def ready(self):
        import nova.signals

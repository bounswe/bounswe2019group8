from django.core.exceptions import ValidationError


def validate_exists(model, data):
    if not model.objects.filter(**data).exists():
        raise ValidationError(f"{data} does not exist in {model}")

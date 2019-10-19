from rest_framework import serializers


class NovaSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        if self.Meta is not None:
            create_only_fields = self.Meta.create_only_fields

            for k in create_only_fields or []:
                validated_data.pop(k, None)

        return super(NovaSerializer, self).update(instance, validated_data)

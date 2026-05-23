from rest_framework import serializers

class StudentUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)

    course = serializers.IntegerField()
    year_level = serializers.IntegerField(min_value=1)

    email = serializers.EmailField()

class FacilitatorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = ['first_name','last_name','email']
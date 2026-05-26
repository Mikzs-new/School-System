# class Registration(TimeStampedModel):
#     name = models.CharField(max_length=255)
#     initials = models.CharField(max_length=25, blank=True)
#     school_id = models.IntegerField()
#     complete_address = models.TextField(blank=True)
#     email = models.EmailField()
#     status = models.BooleanField(default=False)
    
#     def __str__(self):
#         return f'Registration: {self.name}'
from django.db import models


class Video(models.Model):
    """This class represents the session model."""
    code = models.CharField(max_length=255, blank=False)
    url = models.CharField(max_length=255, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    description = models.TextField(max_length=10000, blank=True, null=True)

    likes = models.IntegerField(blank=True, null=True)
    dislikes = models.IntegerField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)

    category = models.CharField(max_length=1000, blank=True, null=True)
    license = models.CharField(max_length=1000, blank=True, null=True)

    author = models.CharField(max_length=500, blank=True, null=True)
    published = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.title)
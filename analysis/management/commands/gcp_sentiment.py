import json

from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.google_sentiment import classify_text
from races.models import RaceTask
from utils.command_utils import get_snapshots, add_arguments

class Command(BaseCommand):
    help = 'Do google cloud platform natural language sentiment analysis'

    def add_arguments(self, parser):
        add_arguments(parser)

    def handle(self, *args, **options):
        pk = options['pk']
        race_id = options['race_id']
        limit = options['limit']
        offset = options['offset']
        override = options['override']

        self.stdout.write(
            self.style.SUCCESS(
                'Classifying tone for limit %s and offset %s and override %s'
                % (limit, offset, override)
            )
        )
        snapshots = get_snapshots(pk, race_id, limit, offset)

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

            if created or override:
                google_sentiment = classify_text(title)
                s.gcp_sentiment_score = google_sentiment[0]
                s.gcp_sentiment_magnitude = google_sentiment[1]
                s.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        'Saving snapshot sentiment: %s - %s: %s' %
                        (title, s.sentiment, s.watson_raw_tone)
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        'Skipping snaphost as it is already processed: %s' %
                        (s.title)
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                'Done sentiment analysis'
            )
        )

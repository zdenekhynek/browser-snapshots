# Generated by Django 2.0 on 2018-04-04 06:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='training',
            name='interval',
            field=models.IntegerField(default=3600),
        ),
    ]

# Generated by Django 2.0 on 2018-02-08 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('snapshots', '0011_auto_20171217_1137'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='comments',
            field=models.TextField(blank=True, null=True),
        ),
    ]

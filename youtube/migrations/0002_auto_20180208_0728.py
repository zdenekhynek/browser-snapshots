# Generated by Django 2.0 on 2018-02-08 07:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='published',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

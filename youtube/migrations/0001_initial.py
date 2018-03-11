# Generated by Django 2.0 on 2018-02-06 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=1000)),
                ('likes', models.IntegerField(blank=True, null=True)),
                ('dislikes', models.IntegerField(blank=True, null=True)),
                ('length', models.FloatField(blank=True, null=True)),
                ('category', models.CharField(blank=True, max_length=1000, null=True)),
                ('license', models.CharField(blank=True, max_length=1000, null=True)),
                ('author', models.CharField(blank=True, max_length=500, null=True)),
                ('published', models.DateTimeField()),
            ],
        ),
    ]

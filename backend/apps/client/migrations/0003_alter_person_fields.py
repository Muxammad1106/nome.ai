from django.db import migrations, models
import pgvector.django.vector


class Migration(migrations.Migration):
    dependencies = [
        ("client", "0002_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="person",
            name="vector",
            field=pgvector.django.vector.VectorField(blank=True, dimensions=128, null=True),
        ),
        migrations.AlterField(
            model_name="person",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="people/"),
        ),
    ]

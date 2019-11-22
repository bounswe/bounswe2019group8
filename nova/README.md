# Nova
## Setup
To be able to run the app locally, you have to install Python3 along with the Django REST framework
and a couple of more supporting libraries.

To avoid version and compatibility problems, we suggest that you use `conda`.
Once you create an environment and activate it, run the following commands:

```
conda install -c conda-forge djangorestframework
conda install -c conda-forge django-filter
conda install -c conda-forge markdown
conda install pillow
conda install psycopg2
conda install -c conda-forge django-cors-headers
conda install requests
pip install django-kronos
```

Then, create a PostgreSQL database named `mercatus`. Supply the DB credentials to the project by running:
```
python setup_db_creds.py
```

Finally, setup and initialize the database by running:
```
python manage.py makemigrations nova
python manage.py migrate
python manage.py loaddata nova/fixtures/*.json
``` 

## Running the Server
While in this folder, run 
```
python manage.py runserver
```

## Adding New Endpoints
We are following the REST convention for our API. Therefore, you should choose the endpoint path accordingly. See the
references section below for some examples.

Note that in most cases, we have two related methods, such as `users_coll` and `user_res`, which represents 
the collection of users (`users/`) and a specific user object (`users/{user-id}`), respectively.

Once you are ready, add the endpoint path to the object `urlpatterns` in th file `urls.py`. Then, implement
the corresponding functionality in `views.py`.

If you need a new model for your endpoint, simply implement a new class in `models.py` and a serializer in `serializers.py`

See the following code sample that implements a serializer for the model `airplane`.
```python
class AirplaneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airplane
        
        # Fields that you want to serialize
        fields = ['producer', 'number_of_seats', 'callsign']
                  
        # Optionally, add "read_only_fields", which will be ignored when updating a model in the database.
        # An example use case could usernames
        read_only_fields = ['first_name', 'last_name']
```

## Authentication and Permissions
Default permission requirment for endpoints is being an authenticated basic user.

## Further Information and References
1. https://restfulapi.net/resource-naming/
1. https://www.django-rest-framework.org/
1. https://docs.djangoproject.com/en/2.2/topics/db/models/

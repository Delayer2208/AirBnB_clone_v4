#!/usr/bin/python3
"""
Flask application that integrates with AirBnB's static HTML template.
"""
from flask import Flask, render_template, url_for
from models import storage
import uuid

# Initialize Flask application
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'

# Handle teardown for each request
@app.teardown_appcontext
def teardown_storage(exception):
    """
    Function called after each request to close the current SQLAlchemy Session.
    """
    storage.close()

@app.route('/101-hbnb')
def render_hbnb_template(the_id=None):
    """
    Route to handle requests to a custom template with states, cities, and amenities.
    """
    state_objects = storage.all('State').values()
    states = {state.name: state for state in state_objects}
    amenities = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: "{} {}".format(user.first_name, user.last_name) for user in storage.all('User').values()}
    return render_template('101-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=states,
                           amens=amenities,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    Main entry point for the Flask application.
    """
    app.run(host=host, port=port)

import os

import pandas as pd
import numpy as np

#commenting out mySQL reference since we are using SQLite
#import pymysql
#pymysql.install_as_MySQLdb()

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import sqlite3

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/happiness.sqlite"
db = SQLAlchemy(app)

#commented out the next line since we are now using sqlite
# db = create_engine("mysql+pymysql://root:datascience2018@127.0.0.1/happiness_data")

# //k5xunpkmojyzse51:ifagg1gp7e2xyapi@ffn96u87j5ogvehy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/tq6h098h0ym00zp6")
# db = engine.execute("SELECT * FROM happiness_data.happiness_by_region_yr")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Happy_Metrics=Base.classes.happiness_by_region_yr
Regions = Base.classes.region_continent
social_progress = Base.classes.social_progress

#session = Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/about")
def about():
    """Return the about page."""
    return render_template("about.html")


@app.route("/comparison")
def comparison():
    """Return the comparison page."""
    return render_template("comparison.html")


@app.route("/analysis")
def analysis():
    """Return the analysis page."""
    return render_template("analysis.html")


@app.route("/top-25")
def top_25():
    """Return the analysis page."""
    return render_template("top-25.html")


@app.route("/metacountry/<COUNTRY_Happy>")
def metacountry(COUNTRY_Happy):
    """Return the country happiness data for a given choice."""
    sel = [
        Happy_Metrics.COUNTRY,
        Happy_Metrics.REGION,
        Happy_Metrics.CONTINENT,
        Happy_Metrics.HAPPINESS_SCORE,
        Happy_Metrics.ECONOMY_GDP_PER_CAPITA,
        Happy_Metrics.FAMILY,
        Happy_Metrics.HEALTH_LIFE_EXPECTANCY,
        Happy_Metrics.FREEDOM,
        Happy_Metrics.GENEROSITY,
        Happy_Metrics.TRUST_GOVERNMENT_CORRUPTION,
    ]

    results = db.session.query(*sel).filter(Happy_Metrics.COUNTRY == COUNTRY_Happy).all()

    # Create a dictionary entry for each row of country information
    happy_metrics = {}
    for result in results:
        happy_metrics["COUNTRY"] = result[0]
        happy_metrics["REGION"] = result[1]
        happy_metrics["CONTINENT"] = result[2]
        happy_metrics["HAPPINESS_SCORE"] = result[3]
        happy_metrics["ECONOMY_GDP_PER_CAPITA"] = result[4]
        happy_metrics["FAMILY"] = result[5]
        happy_metrics["HEALTH_LIFE_EXPECTANCY"] = result[6]
        happy_metrics["FREEDOM"] = result[7]
        happy_metrics["GENEROSITY"] = result[8]
        happy_metrics["TRUST_GOVERNMENT_CORRUPTION"] = result[9]

    print(happy_metrics)
    return jsonify(happy_metrics)

@app.route("/happiness")
def happiness():
    """Return a list of happiness entries by country."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(happiness_by_region_yr).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    return jsonify(df)

@app.route("/happycountry/<COUNTRY_Happy>")
def happycountry(COUNTRY_Happy):
    """Return data values in happiness dataset."""
    stmt = db.session.query(Happy_Metrics).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    happy_data = df.loc["HAPPINESS_SCORE", "FAMILY", COUNTRY_Happy]
    # Format the data to send as json
    data = {
        "HAPPINESS_SCORE": sample_data.HAPPINESS_SCORE.values.tolist(),
        "COUNTRY_Happy": sample_data[COUNTRY_Happy].values.tolist(),
        "FAMILY": sample_data.FAMILY.tolist(),
    }
    return jsonify(data)

# this route is for the country pull-down.  It has a list of all of the countries to choose from.
@app.route("/countries")
def countries():
    """Return a list of country names."""

    # query to find list of countries
    results = db.session.query(Regions.COUNTRY).all()
    
    all_countries = list(np.ravel(results))

    # Return a list of the column names (country names)
    return jsonify(all_countries)


# this route is for the regions pull-down.  It has a list of all of the regions to choose from.
@app.route("/regions")
def regions():
    """Return a list of regions."""

    # query to find list of regions
    results = db.session.query(Regions.REGION).group_by(Regions.REGION).all()
    
    all_regions = list(np.ravel(results))

    # Return a list of the values (region names)
    return jsonify(all_regions)


# this route is for the continent pull-down.  It has a list of all of the continents to choose from.
@app.route("/continents")
def continents():
    """Return a list of continents."""

    # query to find list of continents
    results = db.session.query(Regions.CONTINENT).group_by(Regions.CONTINENT).all()
    
    all_continents = list(np.ravel(results))

    # Return a list of the values (continent names)
    return jsonify(all_continents)



# this route will be for the data from the social progress database.  mostly a placeholder for now.
@app.route("/socialprogress")
def socialprogress():
    """Return a list of social progress items."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(social_progress).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    return jsonify(df)

if __name__ == "__main__":
    app.run()
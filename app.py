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


@app.route("/happiness")
def happiness():
    """Return a list of happiness entries by country."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(happiness_by_region_yr).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    return jsonify(df)


# this route is for the country pull-down.  It has a list of all of the countries to choose from.
@app.route("/countries")
def countries():
    """Return a list of country names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Regions).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (country names)
    return jsonify(list(df.columns)[0:])


# this route is for the regions pull-down.  It has a list of all of the regions to choose from.
@app.route("/regions")
def regions():
    """Return a list of regions, countries, and continents."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Regions).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    return jsonify(list(df.columns)[1:])


# this route is for the continent pull-down.  It has a list of all of the continents to choose from.
@app.route("/continents")
def continents():
    """Return a list of continents."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Regions).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    return jsonify(list(df.columns)[2:])

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
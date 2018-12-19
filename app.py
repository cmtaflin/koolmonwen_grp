# Structure of file
#1.) Flask Setup and HTML routes 
#2.) API lists of fields (Happiness data, Country, Region, Continent)
#3.) Routes that Depend on User inputs to filter data and render to Visualization

# 1.) Flask Set up and HTML Routes

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

@app.route("/top-25_happiness")
def top_25_happiness():
    """Return the analysis page."""
    return render_template("top-25_happiness.html")

@app.route("/top-25_economy")
def top_25_happiness_economy():
    """Return the analysis page."""
    return render_template("top-25_economy.html")

@app.route("/top-25_family")
def top_25_happiness_family():
    """Return the analysis page."""
    return render_template("top-25_family.html")

@app.route("/top-25_health")
def top_25_happiness_health():
    """Return the analysis page."""
    return render_template("top-25_health.html")

@app.route("/top-25_freedom")
def top_25_happiness_freedom():
    """Return the analysis page."""
    return render_template("top-25_freedom.html")

@app.route("/top-25_generosity")
def top_25_happiness_generosity():
    """Return the analysis page."""
    return render_template("top-25_generosity.html")

@app.route("/top-25_trust")
def top_25_happiness_trust():
    """Return the analysis page."""
    return render_template("top-25_trust.html")



#2.) API lists of fields (Happiness data, Country, Region, Continent)


@app.route("/happiness")
def happiness():
    """Return a list of happiness entries by country."""

    # Use Pandas to perform the sql query
    results_happy = db.session.query(Happy_Metrics).all()
    
    happydata = []
    for result in results_happy:
        happy_dict = {}
        happy_dict["COUNTRY"] = result.COUNTRY
        happy_dict["REGION"] = result.REGION
        happy_dict["CONTINENT"] = result.CONTINENT
        happy_dict["HAPPINESS_SCORE"] = result.HAPPINESS_SCORE
        happy_dict["ECONOMY_GDP_PER_CAPITA"] = result.ECONOMY_GDP_PER_CAPITA
        happy_dict["FAMILY"] = result.FAMILY
        happy_dict["HEALTH_LIFE_EXPECTANCY"] = result.HEALTH_LIFE_EXPECTANCY
        happy_dict["FREEDOM"] = result.FREEDOM
        happy_dict["GENEROSITY"] = result.GENEROSITY
        happy_dict["TRUST_GOVERNMENT_CORRUPTION"] = result.TRUST_GOVERNMENT_CORRUPTION
        happydata.append(happy_dict)
            
    
    return jsonify(happydata)

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
    results_spi = db.session.query(social_progress).all()
    
    spi = []
    for result in results_spi:
        spi_dict = {}
        spi_dict["Country"] = result.Country
        spi_dict["SPI"] = result.SPI
        spi_dict["BNeeds"] = result.BNeeds
        spi_dict["FWellB"] = result.FWellB
        spi_dict["Opportunity"] = result.Opport
        spi_dict["Shelter"] = result.Shelter
        spi_dict["Health"] = result.Health
        spi.append(spi_dict)
            
    
    return jsonify(spi)

#3.) Routes that Depend on User inputs to filter data and render to Visualization

@app.route("/metacountry/United_States")
def metacountry(United_States):
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

    # results = db.session.query(*sel).filter(Happy_Metrics.COUNTRY = United Kingdom).all()

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

@app.route("/happycountry/<COUNTRY_Happy>")
def happycountry(COUNTRY_Happy):
    
    COUNTRY_Happy = "Afghanistan"
    results = db.session.query(Happy_Metrics.COUNTRY,Happy_Metrics.REGION,Happy_Metrics.CONTINENT,\
        Happy_Metrics.HAPPINESS_RANK,Happy_Metrics.HAPPINESS_SCORE,Happy_Metrics.ECONOMY_GDP_PER_CAPITA,Happy_Metrics.FAMILY,\
        Happy_Metrics.HEALTH_LIFE_EXPECTANCY,Happy_Metrics.FREEDOM,Happy_Metrics.GENEROSITY,Happy_Metrics.TRUST_GOVERNMENT_CORRUPTION)\
        .filter(Happy_Metrics.COUNTRY==COUNTRY_Happy).all() 
    print(results)
    
    indexPie=[]
    for metrics in results:
        indexPie_dict={}
        indexPie_dict["ECONOMY_GDP_PER_CAPITA"]=metrics.ECONOMY_GDP_PER_CAPITA
        indexPie_dict["FAMILY"]=metrics.FAMILY
        indexPie_dict["HEALTH_LIFE_EXPECTANCY"]=metrics.HEALTH_LIFE_EXPECTANCY
        indexPie_dict["FREEDOM"]=metrics.FREEDOM
        indexPie_dict["GENEROSITY"]=metrics.GENEROSITY
        indexPie_dict["TRUST_GOVERNMENT_CORRUPTION"]=metrics.TRUST_GOVERNMENT_CORRUPTION
        indexPie.append(indexPie_dict)
    
    indexPielabels_list = []
    indexPievalues_list = []
    
    for label, value in indexPie_dict.items():
        indexPielabels_list.append(label)
        indexPievalues_list.append(value)

    data_py=[{
        "labels":indexPielabels_list,
        "values":indexPievalues_list,
        "type":"pie"
    }]
    
    return jsonify(data_py)
    
    
    # """Return data values in happiness dataset."""
    # stmt = db.session.query(Happy_Metrics).statement
    # df = pd.read_sql_query(stmt, db.session.bind)
    # COUNTRY_Happy = "United Kingdom"
    # # Filter the data based on the sample number and
    # # only keep rows with values above 1
    # # happy_data = df.loc["HAPPINESS_SCORE", "FAMILY", COUNTRY_Happy]
    # # Format the data to send as json
    # data = {
    #     "HAPPINESS_SCORE": sample_data.HAPPINESS_SCORE.values.tolist(),
    #     "COUNTRY_Happy": sample_data[COUNTRY_Happy].values.tolist(),
    #     "FAMILY": sample_data.FAMILY.tolist(),
    # }
    # return jsonify(data)

@app.route("/socialhappy")
def socialhappy():  
    
    testresult = db.session.query(Happy_Metrics).join(social_progress).filter(Happy_Metrics.COUNTRY==social_progress.Country).all()
    #testresult = db.session.query(Happy_Metrics).join(social_progress).all()
    
    socialhappy = []
    for result in testresult:
        shappy_dict = {}
        shappy_dict["Country"] = result.COUNTRY
        shappy_dict["SPI"] = result.social_progress.SPI
        shappy_dict["HEALTH_LIFE_EXPECTANCY"] = result.HEALTH_LIFE_EXPECTANCY
        shappy_dict["HAPPINESS_SCORE"] = result.HAPPINESS_SCORE
        shappy_dict["ECONOMY_GDP_PER_CAPITA"] = result.ECONOMY_GDP_PER_CAPITA
        shappy_dict["FAMILY"] = result.FAMILY
        shappy_dict["FREEDOM"] = result.FREEDOM
        shappy_dict["GENEROSITY"] = result.GENEROSITY
        shappy_dict["TRUST_GOVERNMENT_CORRUPTION"] = result.TRUST_GOVERNMENT_CORRUPTION
        shappy_dict["BNeeds"] = result.social_progress.BNeeds
        shappy_dict["FWellB"] = result.social_progress.FWellB
        shappy_dict["Opportunity"] = result.social_progress.Opport
        shappy_dict["Shelter"] = result.social_progress.Shelter
        shappy_dict["Health"] = result.social_progress.Health
        shappy_dict["Per_Safe"] = result.social_progress.Per_Safe
        shappy_dict["Free_Cho"] = result.social_progress.Free_Cho
        shappy_dict["Tol_Incl"] = result.social_progress.Tol_Incl
        socialhappy.append(shappy_dict)
        
    return jsonify(socialhappy)

@app.route("/comparison/compRightPie")
def compRightPie():
    # Use Pandas to perform the sql query

    # countryselect = d3.select("#selCountryLeft")
    countryselect = "United States"
    results = db.session.query(Happy_Metrics.COUNTRY,Happy_Metrics.REGION,Happy_Metrics.CONTINENT,\
        Happy_Metrics.HAPPINESS_RANK,Happy_Metrics.HAPPINESS_SCORE,Happy_Metrics.ECONOMY_GDP_PER_CAPITA,Happy_Metrics.FAMILY,\
        Happy_Metrics.HEALTH_LIFE_EXPECTANCY,Happy_Metrics.FREEDOM,Happy_Metrics.GENEROSITY,Happy_Metrics.TRUST_GOVERNMENT_CORRUPTION)\
        .filter(Happy_Metrics.COUNTRY==countryselect).all() 
    
    compRightPie=[]
    for metrics in results:
        compRightPie_dict={}
        compRightPie_dict["ECONOMY_GDP_PER_CAPITA"]=metrics.ECONOMY_GDP_PER_CAPITA
        compRightPie_dict["FAMILY"]=metrics.FAMILY
        compRightPie_dict["HEALTH_LIFE_EXPECTANCY"]=metrics.HEALTH_LIFE_EXPECTANCY
        compRightPie_dict["FREEDOM"]=metrics.FREEDOM
        compRightPie_dict["GENEROSITY"]=metrics.GENEROSITY
        compRightPie_dict["TRUST_GOVERNMENT_CORRUPTION"]=metrics.TRUST_GOVERNMENT_CORRUPTION
        compRightPie.append(compRightPie_dict)
    
    compRightPielabels_list = []
    compRightPievalues_list = []
    
    for label, value in compRightPie_dict.items():
        compRightPielabels_list.append(label)
        compRightPievalues_list.append(value)

    data_py=[{
        "labels":compRightPielabels_list,
        "values":compRightPievalues_list,
        "type":"pie"
    }]
    
    return jsonify(data_py)
    
@app.route("/comparison/compLeftPie")
def compLeftPie():
    # Use Pandas to perform the sql query
    
    # countryselect = d3.select(selCountryRight)
    countryselect = "United Kingdom"
    results = db.session.query(Happy_Metrics.COUNTRY,Happy_Metrics.REGION,Happy_Metrics.CONTINENT,\
        Happy_Metrics.HAPPINESS_RANK,Happy_Metrics.HAPPINESS_SCORE,Happy_Metrics.ECONOMY_GDP_PER_CAPITA,Happy_Metrics.FAMILY,\
        Happy_Metrics.HEALTH_LIFE_EXPECTANCY,Happy_Metrics.FREEDOM,Happy_Metrics.GENEROSITY,Happy_Metrics.TRUST_GOVERNMENT_CORRUPTION)\
        .filter(Happy_Metrics.COUNTRY==countryselect).all() 
    
    compLeftPie=[]
    for metrics in results:
        compLeftPie_dict={}
        compLeftPie_dict["ECONOMY_GDP_PER_CAPITA"]=metrics.ECONOMY_GDP_PER_CAPITA
        compLeftPie_dict["FAMILY"]=metrics.FAMILY
        compLeftPie_dict["HEALTH_LIFE_EXPECTANCY"]=metrics.HEALTH_LIFE_EXPECTANCY
        compLeftPie_dict["FREEDOM"]=metrics.FREEDOM
        compLeftPie_dict["GENEROSITY"]=metrics.GENEROSITY
        compLeftPie_dict["TRUST_GOVERNMENT_CORRUPTION"]=metrics.TRUST_GOVERNMENT_CORRUPTION
        compLeftPie.append(compLeftPie_dict)
    
    compLeftPielabels_list = []
    compLeftPievalues_list = []
    
    for label, value in compLeftPie_dict.items():
        compLeftPielabels_list.append(label)
        compLeftPievalues_list.append(value)

    data_py=[{
        "labels":compLeftPielabels_list,
        "values":compLeftPievalues_list,
        "type":"pie"
    }]
    
    return jsonify(data_py)

# liST (HAPPINESS_SCORE, ECOND,)
# vALUES(METRICS_HAPPINESS_SORE,)
if __name__ == "__main__":
    app.run(debug=True)
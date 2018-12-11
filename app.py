import os

import pandas as pd
import numpy as np

import pymysql
pymysql.install_as_MySQLdb()                                             
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

#################################################
# Database Setup
#################################################


db = create_engine("mysql+pymysql://root:datascience2018@127.0.0.1/happiness_data")
# //k5xunpkmojyzse51:ifagg1gp7e2xyapi@ffn96u87j5ogvehy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/tq6h098h0ym00zp6")
# db = engine.execute("SELECT * FROM happiness_data.happiness_by_region_yr")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Happy_Metrics=Base.classes.happiness_by_region_yr

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(happiness_by_region_yr).statement
    df = pd.read_sql_query(stmt, db.session.bind)


if __name__ == "__main__":
    app.run()
import csv

usage = """Preprocessing data for nn. Takes in a csv file
        and returns data"""

def parse_data(files, varnames):
    """
    Given a list of (csv) files and the variable names, create a data
    dictionary
    csv files should have 3 cols:
    country code, year, values
    files[i] should correspond to varnames[i]
    :param files: csv list of files
    :param varnames: list of variable names, including gdp but not including time
    :return: data dict
    """
    data = {}
    for file, var in zip(files, varnames):
        vardata = []
        with open(file, "r") as fin:
            reader = csv.reader(fin, delimiter=",")
            for line in reader:
                vardata.append(line)
        for row in vardata:
            country, year, value = row
            year = int(year)
            if country in data:
                if year in data[country]:
                    data[country][year][var] = value
                else:
                    data[country][year] = {var: value}
            else:
                data[country] = {year: {var: value}}

    newdata = {}
    for country in data:
        points = []
        for year in data[country]:
            points.append([year] + list(data[country][year].values()))
        newdata[country] = points

    return ["year"] + varnames, newdata

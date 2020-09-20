import torch
import torch.nn as nn
from torch.autograd import Variable
import torch.nn.functional as F
from API import preprocessing
import matplotlib.pyplot as plt
import numpy as np
from itertools import chain, combinations
import csv

class Propagator(nn.Module):
    """
    Takes a current state of GDP, literacy, etc. then gives the predicted state
    in the next year.
    """
    def __init__(self, n_feature, n_hidden, n_output):
        super(Propagator, self).__init__()
        self.hidden1 = nn.Linear(n_feature, n_feature)
        self.hidden2 = nn.Linear(n_feature, n_hidden)
        self.output = nn.Linear(n_hidden, n_output)

    def forward(self, x):
        x = torch.transpose(x, 0, 1)
        x = self.hidden1(x)
        x = F.relu(self.hidden2(x))
        x = self.output(x)
        x = torch.transpose(x, 0, 1)
        return x


class Regression(nn.Module):
    """
    Takes a given starting point x, then recursively applies Propagator to it
    T times.
    """
    def __init__(self, n_feature, n_output):
        super(Regression, self).__init__()
        n_hidden = 16
        self.prop = Propagator(n_feature, n_hidden, n_output)

    def forward(self, x, T):
        """T is number of years"""
        country_data = x
        for j in range(T):
            x = self.prop(x)
        return x


def country_loss(pred_evo, act_evo):
    """
    Given the predicted evolution of a country and actual time evolution, return
    the loss for that country.
    """
    loss = 0
    loss += ((pred_evo[0, 0] - act_evo[0])/act_evo[0])**2
    return loss


def powerset(iterable):
    s = list(iterable)
    return chain.from_iterable(combinations(s, r) for r in range(1, len(s)+1))

all_combs = powerset([1,2,3,4])
all_files = ["GDP.csv", "population.csv", "hours_worked.csv", "education.csv", "youth-mortality-rate.csv"]
all_varnames = ["GDP", "population", "hours worked", "education index", "youth mortality rate"]

for comb in all_combs:
    files = ["GDP.csv"] + [all_files[i] for i in comb]
    varnames = ["GDP"] + [all_varnames[i] for i in comb]
    loaded_data = preprocessing.parse_data(files, varnames)

    d = len(loaded_data[0]) - 1
    data = loaded_data[1]
    model = Regression(d, d)
    optimizer = torch.optim.SGD(model.parameters(), lr=0.0001)
    #train
    N = 100
    for i in range(N):
        overall_loss = 0
        for country in data.keys():
            if len(data[country]) > 0:
                country_data = data[country]
                act_evo = torch.tensor(country_data)[:,1:]
                act_evo = torch.transpose(act_evo, 0, 1)
                for i in range(act_evo.shape[0] - 1):
                    time = country_data[i+1][0] - country_data[i][0]
                    x = act_evo[:, i: i+1]
                    x = Variable(x.float(), requires_grad=True)
                    pred_evo = model(x, time)
                    # print ("pred_evo: " + str(pred_evo))
                    # print ("act_evo: " + str(act_evo[:, i+1]))
                    # print (pred_evo.shape)
                    overall_loss += country_loss(pred_evo, act_evo[:, i+1])
        print("overall loss: " + str(overall_loss))
        # print (type(overall_loss))
        optimizer.zero_grad()
        overall_loss.backward()
        optimizer.step()

    write_data = []
    for country in data:
        if not data[country]:
            continue
        year = data[country][-1][0]
        act_evo = torch.tensor(data[country])[:, 1:]
        act_evo = torch.transpose(act_evo, 0, 1)
        start = act_evo[:, -1:]
        for i in range(15):
            start = model(start, 1)
            write_data.append([country, year + i + 1, start[0, 0].item()])
    fname = "-".join(varnames) + ".csv"
    with open(fname, "w", newline="") as fout:
        writer = csv.writer(fout)
        for row in write_data:
            writer.writerow(row)

# gdp_act, gdp_pred = [], []
# for country in data:
#     country_data = data[country]
#     if not country_data:
#         continue
#     act_evo = np.array(country_data)[:, 1:]
#     act_evo = np.transpose(act_evo)
#     for i in range(act_evo.shape[0] - 1):
#         time = country_data[i + 1][0] - country_data[i][0]
#         x = torch.tensor(act_evo[:, i: i + 1])
#         x = Variable(x.float(), requires_grad=True)
#         pred_evo = model(x, time)
#         gdp_act.append(country_data[i][1])
#         gdp_pred.append(pred_evo[0, 0].item())

# plt.scatter(gdp_act, gdp_pred, size=5)
# plt.show()


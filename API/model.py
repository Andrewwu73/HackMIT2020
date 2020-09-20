import torch
import torch.nn as nn
from torch.autograd import Variable
import torch.nn.functional as F

class Propagator(nn.Module):
    """
    Takes a current state of GDP, literacy, etc. then gives the predicted state
    in the next year.
    """
    def __init__(self, n_feature, n_hidden, n_output):
        super(Propagator, self).__init__()
        self.hidden1 = nn.Linear(n_feature, n_hidden)
        self.hidden2 = nn.Linear(n_hidden, n_hidden)
        self.output = nn.Linear(n_hidden, n_output)

    def forward(self, x):
        x = F.elu(self.hidden1(x))
        x = F.relu(self.hidden2(x))
        x = self.output(x)
        return x


class Regression(nn.Module):
    """
    Takes a given starting point x, then recursively applies Propagator to it
    T times.
    """
    def __init__(self, n_feature, n_output):
        super(Regression, self).__init__()
        n_hidden = 64
        self.prop = Propagator(n_feature, n_hidden, n_output)

    def forward(self, x, T):
        country_data = x
        for j in range(T-1):
            x = self.prop(x)
            country_data = torch.cat((country_data, x), 1)
        return country_data


def country_loss(pred_evo, act_evo):
    """
    Given the predicted evolution of a country and actual time evolution, return
    the loss for that country.
    """
    loss = 0
    loss += torch.mean((pred_evo[0,:] - act_evo[0,:])**2)
    return loss


data = {'USA': [[2020, 100], [2021, 80], [2022, 23]]}

d = 1
model = Regression(d, d)
optimizer = torch.optim.SGD(model.parameters(), lr=0.0001)

N = 500
for i in range(N):
    overall_loss = 0
    for country in data.keys():
        country_data = data[country]
        act_evo = torch.tensor(country_data)[:,1:]
        act_evo = torch.transpose(act_evo, 0, 1)
        x = act_evo[:,0:1]
        T = act_evo.size()[1]
        x = Variable(x.float(), requires_grad=True)
        pred_evo = model(x, T)
        overall_loss += country_loss(pred_evo, act_evo)
    print(overall_loss)

    optimizer.zero_grad()
    overall_loss.backward()
    optimizer.step()
final_pred = model(x,T)
print(final_pred)
import torch
import torch.nn as nn
import torch.nn.functional as F

class Propagator(nn.Module):
    def __init__(self, n_feature, n_hidden, n_output):
        super(Propagator, self).__init__()
        self.hidden = nn.Linear(n_feature, n_hidden)
        self.output = nn.Linear(n_hidden, n_output)

    def forward(self, x):
        x = F.Sigmoid(self.hidden(x))
        x = F.Relu.output(x)
        return x


class Regression(nn.Module):
    def __init__(self, n_feature, n_output):
        super(Propagator, self).__init__()
        n_hidden = 20
        self.prop = Propagator(n_feature, n_hidden, n_output)

    def forward(self, x, T):
        d = x.size()[0]
        country_data = x
        for j in range(T):
            x = self.prop(x)
            torch.cat((country_data, x), 1)
        return country_data


def loss_func(pred_evo, act_evo):
    loss = 0
    loss += (pred_evo[0,:] - act_evo[0,:])**2
    return loss

N = 500
for i in range(N):
    x = torch()
    T = 1
    d = x.size()[0]
    # act_evo = ???

    model = Regression(n, n)
    optimizer = torch.optim.SGD(net.parameters(), lr=0.2)

    pred_evo = Regression(x)
    loss = loss_func(pred_evo, act_evo)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

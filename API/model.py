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



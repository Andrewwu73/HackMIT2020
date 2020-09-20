import React from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="About"
    >
      <Container maxWidth="lg">
        <Typography variant="h1" component="h2" gutterBottom> How it works </Typography>
        <Typography variant="h4" gutterBottom> 1. The Dataset </Typography>
        <Typography variant="body1" gutterBottom>
          Primarily, our datasets are taken from publicly available panel databases. In particular, the economic Real GDP dataset was
          taken from the Penn World Table (PWT) RGDP data table. The PWT data table is compiled periodically through National Accounts
          (NA) data on gross domestic product at current and constant prices. GDP is computed meticulously, taking into account a number
          factors, from relative export/import prices, total employment, and average hours worked. If interested, you can read into 
          greater detail <a href="https://www.rug.nl/ggdc/docs/pwt91_user_guide_to_data_files.pdf">here</a>.
        </Typography>

        <Typography variant="h4" gutterBottom> 2. Machine Learning </Typography>
        <Typography variant="body1" gutterBottom>
          To analyze the datasets, we took a variety of approaches. On the landing page, you can see a linear forecast of the GDPs
          in the near future. This forecast was generated from an autoregressive integrated moving average model, a machine learning
          algorithm that makes correlations between GDP and time in order to predict how the GDP will change in future years.
          
          While powerful, the ARIMA model requires the data to be to be parameterized by time which prevented us from being able to
          do explore correlations in the data unrelated to time. To analyze the datasets in greater detail, we developed our own
          Machine Learning model. This model take as input a series of five economic indicators of a country: GDP, population size,
          average work hours, education index and youth mortality index. From this input, the model uses a recurive neural network
          to predict the values of these indicators in the following year. This model was trained using data on these indicators from
          University of Groningen, and Our World in Data on a mean square loss function. Using this model, we can make predictions
          arbitrarily far into the future by recursively propagating these indicators through the model.
          (autoregressive)
        </Typography>
      </Container>
    </Page>
  );
};

export default Account;

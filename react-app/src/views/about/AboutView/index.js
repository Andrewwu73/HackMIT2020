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
          To analyze the datasets, we took a variety of approaches. On the landing page, you can see a simple Machine Learning model,
          trained simply through correlations among all countries in the world. This model, which was trained using ARIMA
          (autoregressive)
        </Typography>
      </Container>
    </Page>
  );
};

export default Account;

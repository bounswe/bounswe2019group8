import React from 'react';
import Prediction from '../prediction/Prediction'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TradingViewWidget from 'react-tradingview-widget';
import Grid from '@material-ui/core/Grid';
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },

    graph:{
        width: '50%',
        padding: '20px',
    },
});

let id = 0;
function createData(name, price) {
    id += 1;
    return { id, name, price };
}

const rows = [
    createData('BTC', 6050.2),
    createData('ETH', 183.81),
    createData('BCH', 289.61),
    createData('XRP', 0.30400),
    createData('EOS', 5.1807),
];

function SimpleTable(props) {
    const { classes } = props;

    return (
        <Router>
            <Route path="/:id" component={Child} align="left" />

            <Paper className={classes.root}>

            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell align="right">Price (USD)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                <Link to={row.name}>{row.name}</Link>
                            </TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/*
           It's possible to use regular expressions to control what param values should be matched.
              * "/order/asc"  - matched
              * "/order/desc" - matched
              * "/order/foo"  - not matched
        */}
            <Route
                path="/order/:direction(asc|desc)"
                component={ComponentWithRegex}
            />

        </Paper></Router>
    );
}

function Child({ match }) {
    return (
        <div className='wrapper'>
        <Grid item xs={6}>
            <TradingViewWidget symbol={"" + match.params.id + "USD"} />
        </Grid>
        <Grid item xs={6}><Prediction/></Grid>
        </div>
    );
}

function ComponentWithRegex({ match }) {
    return (
        <div>
            <h3>Only asc/desc are allowed: {match.params.direction}</h3>
        </div>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);

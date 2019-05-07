import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

function ContainedButtons(props) {
    const { classes } = props;
    return (
        <div>
            <h3>
                Prediction:
            </h3>
            <Button variant="contained" color="primary" className={classes.button}>
                INCREASES
            </Button>
            <Button variant="contained" color="secondary" className={classes.button}>
                DECREASES
            </Button>
        </div>
    );
}

ContainedButtons.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContainedButtons);

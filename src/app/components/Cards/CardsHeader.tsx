import React from 'react';
import { CardActionArea, Typography, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function CardsHeader(props: { titulo: any, texto: any, icono: any, color: any, font: any, onClick: any }) {

    const useStyles = makeStyles(() => ({
        root: {
            textAlign: 'center',
            background: props.color
        },
        texto: {
            fontSize: 18,
            color: props.font
        },
        titulo: {
            fontWeight: 'bold',
            fontSize: 22,
            color: props.font
        }
    }));

    const classes = useStyles();
    return (
        <CardActionArea className={classes.root} onClick={props.onClick}>
            <CardContent>
                {props.icono}
                <Typography className={classes.titulo}>
                    {props.titulo}
                </Typography>

                <Typography className={classes.texto}>
                    {props.texto}
                </Typography>
            </CardContent>
        </CardActionArea >
    );
}

export default CardsHeader;
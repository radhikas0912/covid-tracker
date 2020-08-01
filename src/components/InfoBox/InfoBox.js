import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './infobox.css';

function Infobox({ title, cases, total}) {
    return (
       <Card className="infobox">
           <CardContent>
               <Typography  className="infobox__title" color="textSecondary">
                   {title}
               </Typography>
                <h2 className="infobox__cases">{cases}</h2>
                <Typography className="infobox__total" color="textSecondary">
                   {total}
               </Typography>
           </CardContent>
       </Card>
    )
}

export default Infobox;
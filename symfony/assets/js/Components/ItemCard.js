import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card';
import {Link} from 'react-router-dom';
import '../../css/app.css';

const ItemCard = ({id, author, avatarUrl, title, subtitle, style, children}) => {
    let link = `/resume/${id}`;
    return (
        <Card style={style}>
            <CardHeader title={author} avatar={avatarUrl}/>
            <CardTitle title={title} subtitle={subtitle}/>
            <CardText><Typography noWrap component="p">{children}</Typography></CardText>
            <CardActions>
                <Link to={link} target="_blank" className="link-button">
                    <Button size="small" color="primary">Learn More</Button>
                </Link>
            </CardActions>
        </Card>
    );
};

export default ItemCard;

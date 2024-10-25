import * as React from "react";
import List from "@mui/material/List";
import {Drawer, ListItem} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {Link as RouterLink} from 'react-router-dom';

type ListItemLinkProps = {
    key: string,
    primary: string,
    to: string,
}

function ListItemLink(props: ListItemLinkProps) {
    const {key, primary, to} = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem disablePadding component={renderLink} key={key}>
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}

export default function LeftNavigationBar() {
    return <Drawer
        sx={{
            width: 200,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: 200,
                boxSizing: 'border-box',
            },
        }}
        variant="permanent"
        anchor="left"
    >
        <List component="nav">
            {ListItemLink({
                to: "/",
                primary: 'Create travel listing',
                key: 'Create travel listing',
            })}
        </List>
    </Drawer>
}
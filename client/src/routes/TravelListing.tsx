import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import LeftNavigationBar from "../components/LeftNavigationBar";
import {TravelItem} from "../types/TravelItem";
import {useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function not(a: readonly TravelItem[], b: readonly TravelItem[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly TravelItem[], b: readonly TravelItem[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TravelListing() {
    const [checked, setChecked] = React.useState<readonly TravelItem[]>([]);
    const [left, setLeft] = React.useState<readonly TravelItem[]>([]);
    const [right, setRight] = React.useState<readonly TravelItem[]>([]);
    useEffect(() => {
        fetch('http://localhost:5001/api/v1/items')
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .then((data) => {
                console.log(data);
                console.log(data.data);
                setLeft(data.data);
            });
    }, []);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: TravelItem) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const getTotalWeight = () => {
        return right.reduce((acc, item) => acc = acc + item.weight, 0);
    };

    const customList = (items: readonly TravelItem[]) => (
        <Paper sx={{width: 500, height: 575, overflow: 'auto'}}>
            <List dense component="div" role="list">
                {items.map((value: TravelItem) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItemButton
                            key={value.name}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.name}/>
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );

    const navigate = useNavigate();
    // @ts-ignore
    const saveProduct = async (e, data: TravelItem) => {
        e.preventDefault();
        await axios.post("http://localhost:5001/api/v1/item", data);
        navigate("/");
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <LeftNavigationBar />
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>
                    <Button variant="outlined" onClick={handleClickOpen}>
                        Open form dialog
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            component: 'form',
                            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                const formJson = Object.fromEntries((formData as any).entries()) as TravelItem;
                                console.log(formData);
                                console.log(formJson);
                                saveProduct(event, formJson).then(handleClose);
                            },
                        }}
                    >
                        <DialogTitle>Create Item</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="weight"
                                label="Weight"
                                type="number"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined">Cancel</Button>
                            <Button type="submit" variant="contained">Create</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{my: 0.5}}
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{my: 0.5}}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{my: 0.5}}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{my: 0.5}}
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                    <Typography>
                        Total weight: {getTotalWeight()}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}
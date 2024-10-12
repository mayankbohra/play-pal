import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, FormHelperText, Card, CardContent } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"; 

const RoomJoinPage = () => {
    const history = useHistory();

    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
    };

    const roomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: roomCode,
            }),
        };

        fetch("/backend/join-room", requestOptions)
            .then((response) => {
                response.ok ? history.push(`/room/${roomCode}`) : setError("Room not found.");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Grid
            container
            style={{
                backgroundColor: "#121212",
                minHeight: "100vh",
                padding: "24px",
                color: "#e0f7fa",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Grid item xs={12} align="center">
                <Typography
                    variant="h4"
                    component="h4"
                    style={{ marginBottom: "24px", color: "#80deea" }}
                >
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Card
                    style={{
                        padding: "24px",
                        borderRadius: "10px",
                        backgroundColor: "#1c1c1c",
                        maxWidth: 400,
                        margin: "0 auto",
                    }}
                >
                    <CardContent>
                        <Grid container spacing={2} direction="column" alignItems="center">
                            <Grid item xs={12}>
                                <FormControl style={{ width: '100%' }}>
                                    <TextField
                                        error={!!error}
                                        label="Enter the Room Code"
                                        placeholder="Enter the Room Code"
                                        value={roomCode}
                                        variant="outlined"
                                        onChange={handleTextFieldChange}
                                        InputLabelProps={{
                                            style: { color: "#80deea" },
                                        }}
                                        InputProps={{
                                            style: { backgroundColor: "#333", color: "#ffffff" },
                                        }}
                                        inputProps={{
                                            style: { textAlign: "center", color: "#ffffff" },
                                        }}
                                    />
                                    {error && <FormHelperText style={{ color: "#f50057" }}>{error}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} align="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        marginTop: "16px",
                                        padding: "12px",
                                        width: "100%",
                                        backgroundColor: "#26c6da",
                                        color: "#000000",
                                        borderRadius: "25px",
                                        transition: "all 0.3s",
                                        boxShadow: "0 0 5px #26c6da",
                                    }}
                                    onClick={roomButtonPressed}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "0 0 20px #26c6da, 0 0 30px #26c6da";
                                        e.currentTarget.style.backgroundColor = "#1de9b6";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "0 0 2px #26c6da, 0 0 5px #26c6da";
                                        e.currentTarget.style.backgroundColor = "#26c6da";
                                    }}
                                >
                                    Enter Room
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    to="/"
                    component={Link}
                    startIcon={<ArrowBackIcon />}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#f50057",
                        color: "#ffffff",
                        borderRadius: "25px",
                        transition: "all 0.3s",
                        boxShadow: "0 0 5px #f50057, 0 0 5px #f50057",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 20px #f50057, 0 0 30px #f50057";
                        e.currentTarget.style.backgroundColor = "#ff4081";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 5px #f50057, 0 0 10px #f50057";
                        e.currentTarget.style.backgroundColor = "#f50057";
                    }}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    );
};

export default RoomJoinPage;

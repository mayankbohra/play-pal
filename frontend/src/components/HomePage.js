import React, { useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

const HomePage = () => {
    const [roomCode, setRoomCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoomCode = async () => {
            setLoading(true);
            try {
                const response = await fetch("/backend/user-in-room");
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await response.json();                             // Fetching the room code from the backend
                setRoomCode(data.code);                                        // Setting the room code in the state
            } catch (error) {
                console.error("Error fetching room code:", error);
                setError("Could not fetch room code. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoomCode();
    }, []);

    const clearRoomCode = () => {
        setRoomCode(null);
    };

    const renderHomePage = () => (
        <Grid
            container
            style={{
                minHeight: "100vh",
                backgroundColor: "#121212",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Grid item xs={12}>
                <Typography variant="h3" compact="h3" style={{ color: "#80deea" }}>
                    House Party
                </Typography>
            </Grid>
            {error && <Typography style={{ color: "red" }}>{error}</Typography>}
            {loading ? (
                <Typography style={{ color: "#80deea" }}>Loading...</Typography>
            ) : (
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant="contained">
                        <Button
                            color="primary"
                            to="/join"
                            component={Link}
                            style={{
                                marginRight: "16px",
                                padding: "10px 20px",
                                borderRadius: "25px",
                                transition: "all 0.3s",
                                backgroundColor: "#26c6da",
                                color: "#000000",
                                boxShadow: "0 0 5px #26c6da",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.boxShadow = "0 0 15px #26c6da, 0 0 25px #26c6da";
                                e.currentTarget.style.backgroundColor = "#1de9b6";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = "0 0 5px #26c6da";
                                e.currentTarget.style.backgroundColor = "#26c6da";
                            }}
                        >
                            Join a Room
                        </Button>
                        <Button
                            color="secondary"
                            to="/create"
                            component={Link}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "25px",
                                transition: "all 0.3s",
                                backgroundColor: "#ff4081",
                                boxShadow: "0 0 5px #ff4081",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.boxShadow = "0 0 15px #ff4081, 0 0 25px #ff4081";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = "0 0 5px #ff4081";
                            }}
                        >
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            )}
        </Grid>
    );

    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() =>
                    roomCode ? <Redirect to={`/room/${roomCode}`} /> : renderHomePage()
                }
                />
                <Route path="/create" component={CreateRoomPage} />
                <Route path="/join" component={RoomJoinPage} />
                <Route path="/room/:roomCode" render={(props) => <Room {...props} leaveRoomCallback={clearRoomCode} />} />
            </Switch>
        </Router>
    );
};

export default HomePage;

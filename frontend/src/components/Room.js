import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Card, CardContent } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer.js";
import { useMediaQuery } from "@material-ui/core"; // Import useMediaQuery

const Room = ({ leaveRoomCallback }) => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [song, setSong] = useState({});
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const { roomCode } = useParams();
    const history = useHistory();
    const isSmallScreen = useMediaQuery("(max-width:600px)"); // Check for small screen size

    useEffect(() => {
        getRoomDetails();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getCurrentSong();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getRoomDetails = async () => {
        try {
            const response = await fetch("/backend/get-room?code=" + roomCode);
            if (!response.ok) {
                leaveRoomCallback();
                history.push("/");
            }
            const data = await response.json();
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
            if (data.is_host) {
                authenticateSpotify();
            }
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    };

    const authenticateSpotify = async () => {
        try {
            const response = await fetch("/spotify/is-authenticated");
            const data = await response.json();
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                const authUrlResponse = await fetch("/spotify/get-auth-url");
                const authUrlData = await authUrlResponse.json();
                window.location.replace(authUrlData.url);
            }
        } catch (error) {
            console.error("Error authenticating Spotify:", error);
        }
    };

    const getCurrentSong = async () => {
        try {
            const response = await fetch("/spotify/current-song");
            if (!response.ok) {
                setSong({});
            } else {
                const data = await response.json();
                setSong(data);
            }
        } catch (error) {
            console.error("Error fetching current song:", error);
        }
    };

    const leaveButtonPressed = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        await fetch("/backend/leave-room", requestOptions);
        leaveRoomCallback();
        history.push("/");
    };

    const updateShowSettings = (value) => {
        setShowSettings(value);
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => updateShowSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid
            container
            spacing={4}
            direction={isSmallScreen ? "column" : "row"}
            justifyContent="center"
            alignItems="center"
            style={{
                backgroundColor: "#121212",
                minHeight: "100vh",
                padding: "24px",
                color: "#e0f7fa",
                overflowY: "auto", // Enable vertical scrolling
                maxHeight: "calc(100vh - 48px)", // Adjust max height to allow for scrolling
            }}
        >
            {showSettings ? (
                renderSettings()
            ) : (
                <>
                    <Grid item xs={12} sm={10} md={8} lg={6} align="center">
                        <MusicPlayer {...song} />
                    </Grid>

                    <Grid item xs={12} sm={10} md={6} lg={4} align="center">
                        <Card style={{ padding: "24px", borderRadius: "10px", backgroundColor: "#1c1c1c" }}>
                            <CardContent>
                                <Grid container spacing={2} direction="column" alignItems="center">
                                    <Grid item xs={12} align="center">
                                        <Typography component="h4" variant="h4" style={{ color: "#ffffff", marginBottom: "16px" }}>
                                            Room Code: {roomCode}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} align="center">
                                        <Typography variant="h6" style={{ color: "#80deea" }}>
                                            Votes to Skip: {votesToSkip}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} align="center">
                                        <Typography variant="h6" style={{ color: "#80deea" }}>
                                            Guest Can Pause: {guestCanPause.toString()}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} align="center">
                                        <Typography variant="h6" style={{ color: "#80deea" }}>
                                            Host: {isHost.toString()}
                                        </Typography>
                                    </Grid>

                                    {isHost && (
                                        <Grid item xs={12} align="center">
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                style={{
                                                    marginTop: "16px",
                                                    padding: "12px",
                                                    width: "100%",
                                                    backgroundColor: "#26c6da",
                                                    boxShadow: "0 0 5px #26c6da",
                                                    color: "#000000",
                                                    borderRadius: "25px",
                                                    transition: "all 0.3s",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.boxShadow = "0 0 15px #26c6da, 0 0 25px #26c6da";
                                                    e.currentTarget.style.backgroundColor = "#1de9b6";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.boxShadow = "0 0 5px #26c6da";
                                                    e.currentTarget.style.backgroundColor = "#26c6da";
                                                }}
                                                onClick={() => updateShowSettings(true)}
                                            >
                                                Update Settings
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item xs={12} align="center">
                                        <Button
                                            color="secondary"
                                            variant="contained"
                                            style={{
                                                marginTop: "16px",
                                                padding: "12px",
                                                width: "100%",
                                                backgroundColor: "#ff4081",
                                                boxShadow: "0 0 5px #ff4081",
                                                color: "#ffffff",
                                                borderRadius: "25px",
                                                transition: "all 0.3s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.boxShadow = "0 0 15px #ff4081, 0 0 25px #ff4081";
                                                e.currentTarget.style.backgroundColor = "#d5006d";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.boxShadow = "0 0 5px #ff4081";
                                                e.currentTarget.style.backgroundColor = "#ff4081";
                                            }}
                                            onClick={leaveButtonPressed}
                                        >
                                            Leave Room
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Room;

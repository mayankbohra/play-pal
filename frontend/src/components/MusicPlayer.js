import React from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const MusicPlayer = (props) => {
    const songProgress = (props.time / props.duration) * 100;

    const pauseSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/pause", requestOptions);
    };

    const playSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/play", requestOptions);
    };

    const skipSong = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/skip", requestOptions);
    };

    return (
        <Card
            style={{
                display: "flex",
                flexDirection: "column", // Default column layout for smaller screens
                background: "linear-gradient(45deg, #3a3a3a, #1c1c1c)",
                padding: "16px",
                borderRadius: "15px",
                color: "#e0f7fa",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                maxWidth: "100%", // Allows it to scale on smaller screens
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4} align="center">
                    <img
                        src={props.image_url}
                        style={{
                            width: "100%", // Responsive width for the image
                            maxWidth: "300px", // Keeps the max size of 300x300
                            height: "auto", // Ensures aspect ratio is maintained
                            objectFit: "cover",
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
                        }}
                        alt="Album Cover"
                    />
                </Grid>

                <Grid item xs={12} md={8} style={{ paddingLeft: "16px" }}>
                    <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: "bold", color: "#ffffff" }}
                    >
                        {props.title || "Unknown Song"}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="subtitle1"
                        style={{ color: "#b2ebf2" }}
                    >
                        {props.artist || "Unknown Artist"}
                    </Typography>

                    <div
                        style={{
                            marginTop: "16px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap", // Ensures buttons don't overflow on smaller screens
                        }}
                    >
                        <IconButton
                            style={{
                                color: "#ffffff",
                                backgroundColor: "#ff4081",
                                boxShadow: "0 0 5px #ff4081",
                                transition: "all 0.3s",
                                marginRight: "16px", // Increased margin for more distance
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.boxShadow = "0 0 15px #ff4081, 0 0 25px #ff4081";
                                e.currentTarget.style.backgroundColor = "#d5006d";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = "0 0 5px #ff4081";
                                e.currentTarget.style.backgroundColor = "#ff4081";
                            }}
                            onClick={props.is_playing ? pauseSong : playSong}
                        >
                            {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>

                        <IconButton
                            style={{
                                color: "#ffffff",
                                backgroundColor: "#26c6da",
                                boxShadow: "0 0 5px #26c6da",
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
                            onClick={skipSong}
                        >
                            {props.votes} / {props.votes_required}
                            <SkipNextIcon />
                        </IconButton>
                    </div>

                    <LinearProgress
                        variant="determinate"
                        value={songProgress}
                        style={{
                            marginTop: "16px",
                            height: "8px",
                            borderRadius: "5px",
                            backgroundColor: "#b2ebf2",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "#00e676",
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default MusicPlayer;

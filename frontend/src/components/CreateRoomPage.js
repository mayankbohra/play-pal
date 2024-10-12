import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link, useHistory } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";

const CreateRoomPage = ({ update = false, roomCode = null }) => {
    const history = useHistory();
    const defaultVotes = 2;

    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        if (update && roomCode) {
            fetch(`/backend/get-room?code=${roomCode}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.code) {
                        setVotesToSkip(data.votes_to_skip);
                        setGuestCanPause(data.guest_can_pause);
                    } else {
                        setErrorMsg("Error retrieving room details.");
                    }
                })
                .catch((error) => {
                    setErrorMsg("Error fetching room details.");
                });
        }
    }, [update, roomCode]);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true");
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: update ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                ...(update && { code: roomCode }), // Include roomCode only if updating
            }),
        };

        const endpoint = update ? "/backend/update-room" : "/backend/create-room";

        fetch(endpoint, requestOptions)
            .then((response) => response.json().then((data) => ({ response, data }))) // Combine response and data
            .then(({ response, data }) => { // Destructure the response and data
                if (response.ok) { // Check if the response is ok
                    update ? setSuccessMsg("Room updated successfully!") : history.push(`/room/${data.code}`);
                } else {
                    setErrorMsg("Error updating room...");
                }
            })
            .catch((error) => {
                setErrorMsg("Error creating/updating room: " + error.message);
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
                <Collapse in={errorMsg !== "" || successMsg !== ""}>
                    {successMsg !== "" ? (
                        <Alert severity="success" onClose={() => setSuccessMsg("")}>
                            {successMsg}
                        </Alert>
                    ) : (
                        <Alert severity="error" onClose={() => setErrorMsg("")}>
                            {errorMsg}
                        </Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4" style={{ marginBottom: "24px", color: "#80deea" }}>
                    {update ? "Update Room" : "Create A Room"}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Card style={{ padding: "24px", borderRadius: "10px", backgroundColor: "#1c1c1c", maxWidth: 400, margin: "0 auto" }}>
                    <CardContent>
                        <Grid container spacing={2} direction="column" alignItems="center">
                            <Grid item xs={12} align="center">
                                <FormControl component="fieldset" style={{ marginBottom: "16px", width: '100%' }}>
                                    <FormHelperText style={{ textAlign: "center", color: "#80deea", fontSize: "1.2rem", marginBottom: "1rem" }}>
                                        Guest Control of Playback State
                                    </FormHelperText>
                                    <RadioGroup
                                        row
                                        value={guestCanPause.toString()}
                                        onChange={handleGuestCanPauseChange}
                                        style={{ justifyContent: "center" }}
                                    >
                                        <FormControlLabel
                                            value="true"
                                            control={<Radio color="primary" />}
                                            label={<span style={{ color: "#ffffff", fontSize: "1rem" }}>Play/Pause</span>}
                                            labelPlacement="end"
                                            style={{ margin: "0 2rem" }}
                                        />
                                        <FormControlLabel
                                            value="false"
                                            control={<Radio color="secondary" />}
                                            label={<span style={{ color: "#ffffff", fontSize: "1rem" }}>No Control</span>}
                                            labelPlacement="end"
                                            style={{ margin: "0 2rem" }}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} align="center">
                                <FormControl style={{ width: '100%' }}>
                                    <TextField
                                        required
                                        type="number"
                                        onChange={handleVotesChange}
                                        value={votesToSkip}
                                        inputProps={{
                                            min: 1,
                                            style: { textAlign: "center", color: "#ffffff" },
                                        }}
                                        label="Votes Required To Skip Song"
                                        variant="outlined"
                                        InputLabelProps={{
                                            style: { color: "#80deea" },
                                        }}
                                        InputProps={{
                                            style: { backgroundColor: "#333", color: "#ffffff" },
                                        }}
                                    />
                                    <FormHelperText style={{ color: "#b0bec5" }}>
                                        Enter the number of votes required to skip a song.
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} align="center">
                                <Button
                                    color="primary"
                                    variant="contained"
                                    style={{
                                        marginTop: "16px",
                                        padding: "12px",
                                        width: '100%',
                                        backgroundColor: "#26c6da",
                                        color: "#000000",
                                        borderRadius: "25px",
                                        transition: "all 0.3s",
                                        boxShadow: "0 0 5px #26c6da",
                                    }}
                                    onClick={handleRoomButtonPressed}
                                    startIcon={<SaveIcon />}
                                >
                                    {update ? "Update Room" : "Create A Room"}
                                </Button>
                            </Grid>

                            <Grid item xs={12} align="center">
                                <Button
                                    variant="contained"
                                    to="/"
                                    component={Link}
                                    startIcon={<ArrowBackIcon />}
                                    style={{
                                        marginTop: "16px",
                                        padding: "12px 24px",
                                        backgroundColor: "#f50057",
                                        color: "#ffffff",
                                        borderRadius: "25px",
                                    }}
                                >
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CreateRoomPage;

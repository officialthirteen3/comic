import React, { useState } from 'react';
import { TextField, MenuItem, CircularProgress, FormControl, InputLabel, Select, Paper, Button } from '@mui/material';

const DynamicDropdowns = () => {
    const [charCount, setCharCount] = useState(0);
    const [character, setCharacter] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);


    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            '@media (max-width: 600px)': {
                flexDirection: 'column',
            },
        },
        leftPanel: {
            flex: 1,
            padding: '10px',
            '@media (max-width: 600px)': {
                flex: 'none',
                marginBottom: '10px',
            },
        },
        rightPanel: {
            flex: 1,
            padding: '10px',
            '@media (max-width: 600px)': {
                flex: 'none',
            },
        },
        paper: {
            height: '100%',
            overflow: 'auto',
            padding: '10px',
            fontFamily: 'monospace',
        },
        formControl: {
            flex: 2,
            marginRight: '10px',
            '@media (max-width: 600px)': {
                flex: 'none',
                marginRight: '0',
                marginBottom: '10px',
            },
        },
        textField: {
            flex: 8,
            '@media (max-width: 600px)': {
                flex: 'none',
            },
        },
    };

    const handleCharCountChange = (event) => {
        setCharCount(event.target.value);
    };

    const handleAddMessage = () => {
        if (message) {
            setMessageList(prev => [...prev, { character, text: message }]);
            setMessage(null);
        }
    };

    const handleImage = () => {
        setLoading(true); // Start loading
        var myHeaders = new Headers();
        myHeaders.append("Accept", "image/png");
        myHeaders.append("Authorization", "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "inputs": `Create a digital comic strip with ten panels witn conversation list ${messageList.toString()}`
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud", requestOptions)
            .then(response => response.text())
            .then(blob => {
                const url = URL.createObjectURL(blob); // Create a URL from the blob
                setImageUrl(url); // Update the state with the new URL
                setLoading(false); // Stop loading after the image is processed
            })
            .catch(error => {
                console.log('error', error);
                setLoading(false); // Stop loading in case of error
            });
    };

    const dropdownItems = Array.from({ length: charCount }, (_, i) => i + 1);

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                {/* Left side: Dropdowns and Text Inputs */}
                <TextField
                    label="Number of Characters"
                    type="number"
                    value={charCount}
                    onChange={handleCharCountChange}
                    margin="normal"
                    fullWidth
                />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                    <FormControl style={{ flex: 2, marginRight: '10px' }} fullWidth margin="normal">
                        <InputLabel id={`select-label`}>Select Character</InputLabel>
                        <Select
                            labelId={`select-label`}
                            value={character}
                            label="Select Character"
                            onChange={(event) => {
                                setCharacter(event.target.value);
                            }}>
                            {dropdownItems.map((item) => (
                                <MenuItem key={item} value={item}>
                                    Character {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        style={{ flex: 8 }}
                        label="Enter Text"
                        value={message}
                        onChange={(event) => {
                            setMessage(event.target.value);
                        }}
                        fullWidth
                        margin="normal"
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ height: '55px', marginLeft: '10px' }}
                        onClick={handleAddMessage}>
                        Add Message
                    </Button>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ height: '55px' }}
                    onClick={handleImage}>
                    Generate Image
                </Button>
                {loading && <CircularProgress />}
                {imageUrl && <img src={imageUrl} alt="Generated Content" style={{ maxWidth: '100%', height: 'auto' }} />}
            </div>
            <div style={styles.rightPanel}>
                {/* Right side: Script-like Display */}
                <Paper style={styles.paper}>
                    {messageList.map((message, index) =>
                        message ? (
                            <p key={index} style={{ fontFamily: 'monospace' }}>
                                <strong>Character {message.character || '?'}:</strong> {message.text}
                            </p>
                        ) : null
                    )}
                </Paper>
            </div>
        </div>
    );
};

export default DynamicDropdowns;

import React, { useState, useEffect, useGlobal } from 'reactn';
import { Box, Typography, TextField, Button } from '@mui/material';
import { CONSTS } from '../../../common/Consts.jsx';
import { Options } from './Options.jsx';

const EmotionInput = ({setSongsLoading}) => {

	const [isButtonDisabled, setIsButtonDisabled] = useState(true)
	const [expandOptions, setExpandOptions] = useState(false)
	const [playlistLen, setPlaylistLen] = useState(20)

	const [gsentence, setgSentence] = useGlobal("userInput")
	const [gsetSongsLoaded, setgSongsLoaded] = useGlobal('songsLoaded')
	const [gSongs, setgSongs] = useGlobal('songs');
	const [gPlaylistLink, setgPlaylistLink] = useGlobal('playlist_link');

	const handleInputChange = (event) => {
		setgSentence(event.target.value)
	}

	const handleClick = async (event) => {
		const dataObj = {
			text : gsentence,
			length: playlistLen
		};
		setSongsLoading(true)
		let response = null
		let responseJSON = null
		try {
			response = await fetch('http://localhost:8000/input',{
				method: 'POST',
				headers: {
			      'Content-Type': 'application/json',
			    },
			    body: JSON.stringify(dataObj)
			})
			responseJSON = await response.json();
			setgSongs(responseJSON.songs)
			setgPlaylistLink(responseJSON)
			// storing spotifySongUrls to provide during playlist create call
			// console.log(responseJSON)
			const urls = []
			 responseJSON.songs.forEach((song) => {urls.push(song.songUrl)});
			window.localStorage.setItem('song_urls', JSON.stringify(urls))

			setgSongsLoaded(true)
			setSongsLoading(false)
		} catch (error){
			console.log(error);
		} finally {
			setgSongsLoaded(true)
			setSongsLoading(false)	
		}
		
	}

	const toggleExpandOptions = () => {
		setExpandOptions(!expandOptions)
	} 

	useEffect(() => {
		if(gsentence.length > 0) {
			setIsButtonDisabled(false)
		}
		else{
			setIsButtonDisabled(true)
		}
	},[gsentence])

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'space-between'

		}}>
			<Box marginBottom='20px'>
				<TextField  value={gsentence} onChange={handleInputChange}
					multiline 
					maxRows="8" 
					placeholder="" 
					variant="outlined"
					label={CONSTS.emotionLabel} 
					color='warning'
					sx={{
						minWidth: "300px",
						marginBottom: '5px',
					}}
				/>
				<Typography variant="caption" display="block" onClick={toggleExpandOptions} sx={{
					width: 'fit-content',
    				marginLeft: 'auto',
    				cursor: 'pointer',
    				color: `${CONSTS.secondaryColor}`
				}}>
					{expandOptions? 'Less' : 'More'}
				</Typography>
				{expandOptions? 
				<Options playlistLen={playlistLen} setPlaylistLen={setPlaylistLen}/> 
				: 
				null
				}
			</Box>
			<Button variant="contained" 
			disabled={isButtonDisabled} 
			onClick={(e) => {handleClick(e)}}
			sx={{
				color: `${CONSTS.secondaryColor}`,
				backgroundColor: 'black',
			}}>
				Generate Playlist
			</Button>
		</Box>
	)
}

export { EmotionInput };
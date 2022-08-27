> # MIXLE

Mixle is an audio manipulation game.  
A random song is picked each day and users are able to create a mix using various audio effects.
Once a mix is complete the user can submit their mix for the world to hear.
Listen to and vote on other users mixes in the "Mixes" section.
All users are given 3 votes to vote on their favorite mixes.  
May the best mix win!

> ## Release Notes

##### UPDATE 8/1/22 - 
- Changed audio sourcing from local files to streaming from Deezer
    - songs are only 30 seconds now 
- Implemented a script on heroku to automatically change the song everyday at midnight EST and also reset all users votes for the day
- Songs now loop once they reach the end
- Completely rebuilt transport timer.  It is now much more accurate and adjusts based on play speed and detune settings

##### UPDATE 8/17/22 - 
- Deployed user authorization using JWT tokens.
    - most endpoints now require a valid JWT access token 
- Implemented validation emails
    - a user can no longer cast votes unless they have validated the email they used to create their Mixle account.

##### UPDATE 8/19/22
- Fixed issue with cookie having an expiration of "session" causing users to not auto login if they close the browser
    - cookie now expires in 1 week
- Refactored userDetails into a global context 
    - user details can now be access from any component by importing the "useUser" custom hook. It returns userDetails and a set user details function
    - the UserProvider context now executes the auto login useEffect if there is a refresh token cookie
- Refactored todaysTrack into a global context which can be accessed using the "useTrack" custom hook. It returns todays track and function to set todays track
    - the TrackProvider context now fetches track details from Deezer API on page load. 
- Eliminated the "mixersplashwrapper" component.  This was not needed as the audio will still play even though there's an audio context warning about lack of user interaction
- Eliminated all unecessary props and references to userDetails and todaysTrack
- Renamed the /audio route to /mixes
- Created a /mixer route which goes straight to the mixer
- The "/" route now goes to the splash page which will redirect to /mixer when the button is hit

##### UPDATE 8/20/22
- Refactored random album generator into helper function
- Fixed sizing on cards container div so it doesn't display under transport.
- Fixed issue with auto login not functioning after user details / context refactor

##### UPDATE 8/22/22
- fixed transport sizing issue with timer text splling onto 2 lines on smaller screens
- added custom vh units for mixes page to compensate for address/ navbars on mobile

##### UPDATE 8/26/22
- changed refresh cookies middleware to be called after login / register/ get refresh token and send the final result from server with an attached cookie
- adjusted some css that was causing unecessary scrollbars to display all the time.
- added 5px margin to bottom of transport controls in mixes view
- Fixed issue with dropdown menu going off the right side of screen on mobile. The dropdown menu is now right justified.
- Fixed issue with volume popover pushing transport controls off the screen on mobile
- Fixed bug with play when switching from mixer to mixes.  Should not be able to play right away. 


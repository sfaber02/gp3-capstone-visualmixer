> # MIXLE

Mixle is an audio manipulation game.  
A random song is picked each day and users are able to create a mix using various audio effects.
Once a mix is complete the user can submit their mix for the world to hear.
Listen to and vote on other users mixes in the "Mixes" section.
All users are given 3 votes to vote on their favorite mixes.  
May the best mix win!

> ## Release Notes
<hr>

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



> ## Bugs
- authorization route on /effects/allusers/:id was crashing page due to authorization not resolving
before React attempted to perform a .map on the effects array
    - authorization is disbaled on this route for now
- existing users are not getting accurate votes from DB


> ## ToDo
- refactor mixer / mixes page
    - re style using react bootstrap

    - add tooltips to mixer elements
- if user makes new mix on same day reset votes on mix
    - warn user before doing this
        - fix popover alignment issue
        - add thumbs overlay to mix cards
        - mobile styling of mixer
- move remaining votes and next song countdown to navbar?
- add tooltips to mixer elements

> ## Future Features
- leaderboard
- see all your own mixes
- see stats like how many votes you've recieve over certain time periods (week, month, year)

> ## Brainstorming
- mash up mode
- winner of the day picks a future song (jukebox mode!)


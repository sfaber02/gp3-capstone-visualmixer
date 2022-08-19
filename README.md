# MIXLE
Mixle is an audio manipulation game.  
A random song is picked each day and users are able to create a mix using various audio effects.
Once a mix is complete the user can submit their mix for the world to hear.
Listen to and vote on other users mixes in the "Mixes" section.
All users are given 3 votes to vote on their favorite mixes.  
May the best mix win!

## Release Notes

### UPDATE 8/1/22 - 
- Changed audio sourcing from local files to streaming from Deezer
    - songs are only 30 seconds now 
- Implemented a script on heroku to automatically change the song everyday at midnight EST and also reset all users votes for the day
- Songs now loop once they reach the end
- Completely rebuilt transport timer.  It is now much more accurate and adjusts based on play speed and detune settings

### UPDATE 8/17/22 - 
- Deployed user authorization using JWT tokens.
    - most endpoints now require a valid JWT access token 
- Implemented validation emails
    - a user can no longer cast votes unless they have validated the email they used to create their Mixle account.


### Bugs
- authorization route on /effects/allusers/:id was crashing page due to authorization not resolving
before React attempted to perform a .map on the effects array
    - authorization is disbaled on this route for now
- existing users are not getting accurate votes from DB


### ToDo
- refactor mixer / mixes page
    - re style using react bootstrap
        - fix popover alignment issue
        - add thumbs overlay to mix cards
        - mobile styling of mixer
- move remaining votes and next song countdown to navbar?
- add tooltips to mixer elements

### Future Features
- leaderboard
- see all your own mixes
- see stats like how many votes you've recieve over certain time periods (week, month, year)

### Brainstorming
- mash up mode
- winner of the day picks a future song (jukebox mode!)

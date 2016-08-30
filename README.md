# WhatHaveIDone

Offers a very simple website to log your activities.
Just say what you have done and it will be saved with a time stamp in a log file.
Processing of this data is up to the user.

# Installation
1. Get Node.js [online](https://nodejs.org/en/download/) and install it or via your package manager
2. Get the code
  1. `git clone https://github.com/DemonSpawn/WhatHaveIDone.git`
  2. _or_ get a [zip-file](https://github.com/DemonSpawn/WhatHaveIDone/archive/master.zip)
4. change into the folder (`cd WhatHaveIDone`)
5. install dependencies: `npm install optimist express fs`

# Usage
run `node server.js` to start the server, expected output:  
```
WhatHaveIDone server listening on port 8081!  
writing activities into activity.txt
```
now open your browser, connect to `localhost:8081` and start logging

for the help dialog and more options run `node server.js -h` 

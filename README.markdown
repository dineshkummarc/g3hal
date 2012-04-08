# G3 HAL

[G3][1] HAL is a basic node.js web application that is used to control [MPD][2] 
and provide a few other basic services for running an automated internet
radio jukebox system.

Configuration information is expected to be in a config.json file in the 
base server directory. Look at the config.json.example file for an idea of
what settings there are.

## Configs

The server has two config files, the first one **config.json** contains the 
information needed to access MPD and the basic info such as what port to
listen on, etc.

The second file is the **users.json** file which is a simple hash of usernames 
and passwords, where the passwords are hashes. The hashes can be generated
using the **user_password_hash.js** script

## Server

Run the server:

    node ./app.js

Generate passwords for the users.json config file :

    node ./user_password_hash.js my_password_string

[1]:http://g3-radio.net
[2]:http://musicpd.org

# OrderSystem
OrderSystem
![image](https://user-images.githubusercontent.com/45313904/169800788-507131c2-0347-4b36-893d-e2692d84802e.png)

# install gude
## Prerequisite
* git
* curl
* python3 + pip3
* [nodeJS](https://github.com/IC-WIE-2022/OrderSystem/blob/main/README.md#install-nodejs-with-nvmused-frontend-server)
* sqlitebrowser[optional]
```bash
sudo apt update && sudo apt upgrade
sudo apt install -y git curl tmux python3 python3-pip
pip3 install pip
```
## Clone the Porject from Github
```bash
cd ~
git clone https://github.com/IC-WIE-2022/OrderSystem.git
```
## Install Nodejs with nvm(used Frontend Server)
Check the lastest version of [nvm](https://github.com/nvm-sh/nvm/releases) (`v0.39.1`) is used in this example    
Replace `v0.39.1` with the lastest version
```bash
curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh -o install_nvm.sh
bash install_nvm.sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
Install and use the statble relase (check using `nvm ls-remote`)
```bash
nvm install v16.15.0
nvm use v16.15.0
node -v
```
install the nodejs package used in this project 
```bash
cd ~/OrderSystem/frontend
npm install
```
## Install Python 3
```
cd ~/OrderSystem/server
pip3 install requirements.txt
```

# Start the server
## Front End
```bash
cd ~/OrderSystem/frontend
npm start
```
## Back End
```bash
cd ~/OrderSystem/server
python3 app.py
```

# How to Use
## Cutomer Side
[http://{Server IP}:3000/scanTable?table={table ID}](http://158.132.154.15:3000/scanTable?table=1) <--table 1 example
![image](https://user-images.githubusercontent.com/45313904/169236423-e97cb205-c3b2-45e4-8191-a4d0ed5ce77e.png)

## kitich Side
![image](https://user-images.githubusercontent.com/45313904/169231916-f7b27102-d83c-453a-95b5-b58d317a4f0a.png)
[http://{Server IP}:3000/](http://158.132.154.15:3000/)
Ac: admin pw: admin     
![image](https://user-images.githubusercontent.com/45313904/169240648-1ebe90ca-fae1-47f6-b2bf-2d8c1318f841.png)
![image](https://user-images.githubusercontent.com/45313904/169240752-05f18ae7-3378-49c2-9e5b-f4d65a5f2515.png)
### Order Management
![image](https://user-images.githubusercontent.com/45313904/169241125-379b888f-2006-4306-b327-014e9086fb55.png)
### Menu Management
![image](https://user-images.githubusercontent.com/45313904/169241276-31fe6ee8-5a77-4123-a65d-3edcee339607.png)
![image](https://user-images.githubusercontent.com/45313904/169241333-e990afd2-bb26-443d-b0f8-37e937041d5e.png)
![image](https://user-images.githubusercontent.com/45313904/169241691-7e45517c-e06b-4ffa-85d7-f4c0815b001b.png)
### Robot
![image](https://user-images.githubusercontent.com/45313904/169241998-d45d4e0d-e487-4e97-bfc6-d0061e377b33.png)





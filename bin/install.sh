#!/bin/bash

# Install config
NAME="foodelicious";
VERSION="0.1.0";
TRACKER="http://github.com/rubRU/foodelicious";
NODE_VERSION="0.10.33";

# Modify it or not . I DON'T CAAARE
SRC_FOLDER="../source";
SERVER_FOLDER="$SRC_FOLDER/server";


# Script variables
isRoot=0;
TEMP_FOLDER="/tmp/install-$NAME";
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

#
# Functions
#

function download {
	echo -ne "$DOWNLOAD_TITLE ";
	echo -ne '\E[0;32m'"\033[1m"; echo -n "[ o 0% ]";
	wget --progress=dot -c -P $TEMP_FOLDER $DOWNLOAD_URL 2>&1 | grep --line-buffered "%" | sed -u -e "s,\.,,g" -re "s/[ \t]{2,}/ /g" | awk -W interactive '{printf("\b\b\b\b\b\b-%4s", $2); printf(" ]"); system("")}' #cut -s -d" " -f3-3 >&1 2>&1 | xargs -L1 echo -en "\b\b\b\b\b";
	echo -ne "\b\b\b\b\b\b- 100% ]"; echo -e "\033[0m";
}

function ok {
	echo -ne '\E[0;32m'"\033[1m";
	echo -n "$ARG_MESSAGE";
	echo -e "\033[0m";
}

function nok {
	echo -ne '\E[0;31m'"\033[1m";
	echo -n "$ARG_MESSAGE";
	echo -e "\033[0m";	
}

function fatal {
	echo; echo -ne '\E[47;31m'"\033[1m";
	echo -n " $ARG_MESSAGE ";
	echo -e "\033[0m"; echo;

	# Show cursor
	tput cnorm;

	exit;
}

function isRoot {
	if [ "$isRoot" -eq 0 ]
	then
		echo -n "> Checking if script was run in root ... ";
		if [ "$EUID" -ne 0 ]
		then
			ARG_MESSAGE="[ NOK ]";
			nok;
			ARG_MESSAGE="Please launch script with sudo 'sudo ./install.sh'";
			fatal;
		fi
		isRoot=1;
		ARG_MESSAGE="[ OK ]";
		ok;
	fi
}

function question {
	echo;echo;
	#ARG_QUESTION="Aimez-vous les frites ?"
	echo -e '\t\E[47;35m'"\033[1m                                                      	\033[0m"
	echo -e '\t\E[47;31m'"\033[1m 	                QUESTION                   	\033[0m"
	echo -e '\t\E[47;35m'"\033[1m                                                      	\033[0m"
	echo; echo;
	echo -e '\E[0;33m'"\033[1m 	 $ARG_QUESTION \033[0m"
	echo -ne '\E[0;30m'"\033[1m 	 (\033[0m"
	echo -ne '\E[0;32m'"\033[1mY\033[0m"
	echo -ne '\E[0;30m'"\033[1m)es or (\033[0m"
	echo -ne '\E[0;31m'"\033[1mN\033[0m"
	echo -ne '\E[0;30m'"\033[1m)o ? \033[0m";

	# Show cursor
	tput cnorm;
	read -n 1 ARG_RETURN;

	# Hide cursor
	tput civis;

	echo; echo;
	echo -e '\t\E[47;35m'"\033[1m                                                      	\033[0m"
	echo; echo;
	if [[ $ARG_RETURN = "Y" || $ARG_RETURN = "y" ]];
	then
		ARG_RETURN=1
	elif [[ $ARG_RETURN = "N" || $ARG_RETURN = "n" ]];
	then
		ARG_RETURN=0
	else
		ARG_MESSAGE="Please answer by Y or N";
		nok;
		question;
	fi
}

#
# Script
#

# Get into script DIR
cd DIR;

# Hide cursor
tput civis;

# Entry message
echo;echo;
echo -e '\E[47;35m'"\033[1m                                                      	\033[0m"
echo -e '\E[47;30m'"\033[1m                Installation script                   	\033[0m"
echo -e '\E[47;35m'"\033[1m                                                      	\033[0m"
echo -e '\E[47;35m'"\033[1m         \033[0m"
echo -e '\E[47;35m'"\033[1m Name    \033[0m	$NAME"
echo -e '\E[47;35m'"\033[1m         \033[0m"
echo -e '\E[47;34m'"\033[1m Version \033[0m	v$VERSION"
echo -e '\E[47;35m'"\033[1m         \033[0m"
echo -e '\E[47;31m'"\033[1m Tracker \033[0m	$TRACKER"
echo -e '\E[47;35m'"\033[1m         \033[0m"
echo -e '\E[47;35m'"\033[1m                                                      	\033[0m"
echo;echo;


# Check if internet
echo -n "> Checking internet connection ... ";
CHECK=`(ping -w5 -c3 4.2.2.1 > /dev/null 2>&1 && echo "1") || (echo "0")`

if [ $CHECK -eq 1 ]; then
	ARG_MESSAGE="[ OK ]";
	ok;
else
	ARG_MESSAGE="[ NOK ]";
	nok;
	

	ARG_MESSAGE="You need an internet connection in order to install this software.";
	fatal;
fi

# Creating temporary directory
echo -n "> Creating temporary folder ... ";
mkdir $TEMP_FOLDER >/dev/null 2>&1
ARG_MESSAGE="[ OK ]";
ok;



# Architecture detection
is64= uname -m >/dev/null 2>&1;

echo -n "> Detecting architecture ... ";
if [ $is64="x86_64" ]; then
	ARCH="x64"
	ARG_MESSAGE="[ 64 bits ]";
	ok;
else
	ARCH="x86"
	ARG_MESSAGE="[ 32 bits ]";
	ok;
fi

# NodeJS
echo -n "> Checking NodeJS installation ... ";
command -v node >/dev/null 2>&1 && {
	ARG_MESSAGE="[ `node -v` ]";
	ok;
} || {
	ARG_MESSAGE="[ Not installed ]";
	nok;

	isRoot;

	# NodeJS installation
	DOWNLOAD_TITLE="	> Downloading NodeJS";
	DOWNLOAD_URL="http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.gz";
	download;

	# Extract && Install
	echo -n "	> Extracting && Installing NodeJS ... ";
	cd $TEMP_FOLDER; # Because i'm lazy to say to TAR that he needs to extract to temp folder :)
	
	## Extraction
	tar -xf "node-v$NODE_VERSION-linux-$ARCH.tar.gz"

	## Cleaning source
	rm -f "node-v$NODE_VERSION-linux-$ARCH/ChangeLog" "node-v$NODE_VERSION-linux-$ARCH/LICENSE" "node-v$NODE_VERSION-linux-$ARCH/README.md"

	## Copy !
	cp -R "node-v$NODE_VERSION-linux-$ARCH/bin" "node-v$NODE_VERSION-linux-$ARCH/share" "node-v$NODE_VERSION-linux-$ARCH/include" "node-v$NODE_VERSION-linux-$ARCH/lib" "/usr/local/."

	## Get back to script DIR
	cd $DIR;
	command -v node >/dev/null 2>&1 && {
		ARG_MESSAGE="[ `node -v` ]";
		ok;
	} || {
		ARG_MESSAGE="[ NOK ]";
		nok;

		ARG_MESSAGE="NodeJS failed to install. Please contact developers with tracker url.";
		fatal;	
	}
}


# NPM Dependencies
echo -n "> Installing dependencies ... "
cd $DIR;
cd $SERVER_FOLDER;
ARG_QUESTION="Souhaitez vous installer les dépendences développeur ?";
question;
if [[ $ARG_RETURN -eq 1 ]]; then
	echo -n "> Installing dependencies in developer mode ...";
	npm install >/dev/null 2>&1;
	ARG_MESSAGE="[ OK ]";
	ok;
else
	echo -n "> Installing dependencies in production mode ... ";
	npm install --production >/dev/null 2>&1;
	ARG_MESSAGE="[ OK ]";
	ok;
fi


# Cleaning temp folder
echo -n "> Cleaning temporary folder ... ";
rm -rf $TEMP_FOLDER;
ARG_MESSAGE="[ OK ]";
ok;

# EOS
echo;echo -ne '\E[47;32m'"\033[1m";
echo -n " $NAME has been successfully installed. ";
echo -e "\033[0m"; echo;

# Show cursor
tput cnorm;
exit;

# 
# Useful
#

### [color]

# echo -e "\033[1mChoose one of the following persons:\033[0m" # Bold
# tput sgr0                               # Reset attributes.
# echo -e "\033[0m";                      # Reset attributes.
# echo -en '\E[47;34m'"\033[1mE\033[0m"   # Blue
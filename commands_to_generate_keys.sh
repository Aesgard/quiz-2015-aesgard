#!/bin/bash

if [ ! -d certs ]
then
	mkdir certs
fi

cd certs

KEY="quiz-2015-aesgard-key.pem"
CSR="quiz-2015-aesgard-csr.pem"
CRT="quiz-2015-aesgard-cert.pem"

if [ ! -f $KEY ]
then
	openssl genrsa -out $KEY 2048
	if [ $? -ne 0 ]
	then
		echo "ERROR: resultado ${KEY}: $?"
		exit 1
	fi
	if [ ! -f $KEY ]
	then
		echo "ERROR: no se ha creado el fichero KEY: ${KEY}"
		exit 1
	fi
	echo "${KEY} ok"
fi


if [ ! -f $CSR ]
then
	openssl req -new -sha256 -key $KEY -out $CSR
	if [ $? -ne 0 ]
	then
		echo "ERROR: resultado ${CSR}: $?"
		exit 1
	fi
	if [ ! -f $CSR ]
	then
		echo "ERROR: no se ha creado el fichero CSR: ${CSR}"
		exit 1
	fi
	echo "${CSR} ok"
fi

if [ ! -f $CRT ]
then
	openssl x509 -req -in $CSR -signkey $KEY -out $CRT
	if [ $? -ne 0 ]
	then
		echo "ERROR: resultado ${CRT}: $?"
		exit 1
	fi
	if [ ! -f $CRT ]
	then
		echo "ERROR: no se ha creado el fichero CRT: ${CRT}"
		exit 1
	fi
	echo "${CRT} ok"
fi

#end script

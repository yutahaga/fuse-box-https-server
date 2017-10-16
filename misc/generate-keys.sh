#!/bin/sh

cwd=`dirname "${0}"`

openssl req \
  -newkey rsa:2048 \
  -days 3650 \
  -nodes \
  -x509 \
  -subj "/C=/ST=/L=/O=/OU=/CN=dev.localhost" \
  -extensions SAN \
  -config <( cat /etc/pki/tls/openssl.cnf \
    <(printf "[SAN]\nsubjectAltName='DNS:dev.localhost'")) \
  -keyout "${cwd}/../keys/server.key" \
  -out "${cwd}/../keys/server.crt"

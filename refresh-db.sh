#!/bin/bash

pushd src/NumberGuessingGame
rm -rf ./Migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
popd
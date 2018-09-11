cmake_minimum_required(VERSION 3.5)
project(whitehole VERSION 1.0.0)

find_package(EOSIOWasmsdk REQUIRED)
include(EosioWasmToolchain)

add_executable(whitehole.wasm
    eosio.token.cpp
    whitehole.cpp
    )
target_abi(whitehole.wasm whitehole.abi)

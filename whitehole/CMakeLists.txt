cmake_minimum_required(VERSION 3.5)
project(hello_example VERSION 1.0.0)

find_package(EOSIOWasmsdk REQUIRED)
include(EosioWasmToolchain)

include_directories(eosio.token/include)

add_executable(whitehole.wasm
    eosio.token/src/eosio.token.cpp
    whitehole.cpp
    )

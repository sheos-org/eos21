cmake_minimum_required(VERSION 3.5)
project(hello_example VERSION 1.0.0)

find_package(EOSIOWasmsdk REQUIRED)
include(EosioWasmToolchain)

include_directories(${EOSIOWasmsdk_INCLUDE_DIRS})

add_executable(whitehole.wasm
    eosio.token.cpp
    whitehole.cpp
    )
target_abi(whitehole.wasm whitehole.wasm.abi)

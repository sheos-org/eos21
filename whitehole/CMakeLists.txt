cmake_minimum_required(VERSION 3.5)
project(hello_example VERSION 1.0.0)

find_package(EOSIOWasmsdk REQUIRED)
include(EosioWasmToolchain)

include_directories(${EOSIOWasmsdk_INCLUDE_DIRS})

add_executable(whitehole.wasm
    eosio.token.cpp
    whitehole.cpp
    )
add_custom_command(TARGET whitehole.wasm POST_BUILD
    COMMAND ${EOSIOWasmsdk_ABIGEN} ${CMAKE_CURRENT_SOURCE_DIR}/whitehole.cpp -output whitehole.abi
    VERBATIM
    )


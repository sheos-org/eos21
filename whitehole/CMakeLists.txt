cmake_minimum_required(VERSION 3.5)
project(hello_example VERSION 1.0.0)

find_package(EOSIOWasmsdk REQUIRED)
include(EosioWasmToolchain)

add_subdirectory(eosio.token)

add_executable( hello hello.cpp )

cmake_minimum_required(VERSION 3.5)
project(whitehole VERSION 0.1.0)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/CMakeModules")

find_package(EOSIO_CDT REQUIRED)
include(EosioWasmToolchain)

add_subdirectory(eosio.token)



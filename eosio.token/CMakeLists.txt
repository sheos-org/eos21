cmake_minimum_required(VERSION 3.5)
project(eosio.token VERSION 0.1.0)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/CMakeModules")

find_package(EOSIO_CDT REQUIRED)

include(EosioWasmToolchain)

add_executable(eosio.token.wasm ${CMAKE_CURRENT_SOURCE_DIR}/src/eosio.token.cpp)
target_include_directories(eosio.token.wasm
   PUBLIC
   ${CMAKE_CURRENT_SOURCE_DIR}/include)

set_target_properties(eosio.token.wasm
   PROPERTIES
   RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/eosio.token")

configure_file("${CMAKE_CURRENT_SOURCE_DIR}/abi/eosio.token.abi" "${CMAKE_CURRENT_BINARY_DIR}/eosio.token/eosio.token.abi" COPYONLY)
#install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/include/ DESTINATION ${WASM_ROOT}/eosio.wasmsdk/include)








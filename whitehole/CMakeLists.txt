cmake_minimum_required(VERSION 3.5)
project(hello_example VERSION 1.0.0)

#include the toolchain cmake
include(EosioWasmToolchain)

add_executable( hello hello.cpp )

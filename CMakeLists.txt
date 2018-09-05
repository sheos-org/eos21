cmake_minimum_required(VERSION 3.5)
project(eos21 VERSION 0.1.0)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/CMakeModules")

find_package(EOSIOWasmsdk REQUIRED)

#add_subdirectory(blackhole)
add_subdirectory(whitehole)



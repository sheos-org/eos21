find_program(EOSIOWasmsdk_ABIGEN eosio-abigen PATHS ${EOSIO_WASMSDK_ROOT}/bin NO_DEFAULT_PATH)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(EOSIOWasmsdk REQUIRED_VARS EOSIOWasmsdk_ABIGEN)

list(APPEND CMAKE_MODULE_PATH ${EOSIO_WASMSDK_ROOT}/lib/cmake)

set(EOSIOWasmsdk_INCLUDE_DIRS ${EOSIO_WASMSDK_ROOT}/include)

include_directories(${EOSIOWasmsdk_INCLUDE_DIRS})

macro(target_generate_abi TARGET OUTPUT)
    get_target_property(SOURCES ${TARGET} SOURCES)
    add_custom_command(TARGET ${TARGET} POST_BUILD
        COMMAND ${EOSIOWasmsdk_ABIGEN} ${SOURCES} -output ${CMAKE_CURRENT_BINARY_DIR}/${OUTPUT}
        COMMENT "Generating ABI ${OUTPUT}"
        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
        VERBATIM
        )
endmacro()

macro(target_abi TARGET FILE)
    add_custom_command(TARGET ${TARGET} POST_BUILD
        COMMAND cmake -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/${FILE} ${CMAKE_CURRENT_BINARY_DIR}/${FILE}
    )
endmacro()



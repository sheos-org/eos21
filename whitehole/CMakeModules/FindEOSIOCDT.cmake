find_program(EOSIO_CDT_ABIGEN eosio-abigen PATHS ${EOSIO_CDT_ROOT}/bin NO_DEFAULT_PATH)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(EOSIO_CDT REQUIRED_VARS EOSIO_CDT_ABIGEN)

list(APPEND CMAKE_MODULE_PATH ${EOSIO_CDT_ROOT}/lib/cmake)

set(EOSIO.cdt_INCLUDE_DIRS ${EOSIO_CDT_ROOT}/include)

include_directories(${EOSIO_CDT_INCLUDE_DIRS})

macro(target_generate_abi TARGET OUTPUT)
    get_target_property(SOURCES ${TARGET} SOURCES)
    add_custom_command(TARGET ${TARGET} POST_BUILD
            COMMAND ${EOSIO_CDT_ABIGEN} ${SOURCES} -output ${CMAKE_CURRENT_BINARY_DIR}/${OUTPUT}
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



find_program(EOSIOCDT_ABIGEN eosio-abigen PATHS ${EOSIOCDT_ROOT}/bin NO_DEFAULT_PATH)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(EOSIOCDT REQUIRED_VARS EOSIOCDT_ABIGEN)

list(APPEND CMAKE_MODULE_PATH ${EOSIOCDT_ROOT}/lib/cmake)

set(EOSIO.cdt_INCLUDE_DIRS ${EOSIOCDT_ROOT}/include)

include_directories(${EOSIOCDT_INCLUDE_DIRS})

macro(target_generate_abi TARGET OUTPUT)
    get_target_property(SOURCES ${TARGET} SOURCES)
    add_custom_command(TARGET ${TARGET} POST_BUILD
	    COMMAND ${EOSIOCDT_ABIGEN} ${SOURCES} -output ${CMAKE_CURRENT_BINARY_DIR}/${OUTPUT}
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



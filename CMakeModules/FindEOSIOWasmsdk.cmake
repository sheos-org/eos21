find_program(EOSIOWasmsdk_ABIGEN eosio-abigen PATHS ${EOSIO_WASMSDK_ROOT}/bin NO_DEFAULT_PATH)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(EOSIOWasmsdk REQUIRED_VARS EOSIOWasmsdk_ABIGEN)

list(APPEND CMAKE_MODULE_PATH ${EOSIO_WASMSDK_ROOT}/lib/cmake)


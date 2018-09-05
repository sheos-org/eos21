
find_program(EOSIOWasmsdk_CLANG clang-7 PATHS ${EOSIO_WASMSDK_ROOT}/bin NO_DEFAULT_PATH)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(EOSIOWasmsdk REQUIRED_VARS EOSIOWasmsdk_CLANG)

list(APPEND CMAKE_MODULE_PATH ${EOSIO_WASMSDK_ROOT}/lib/cmake)


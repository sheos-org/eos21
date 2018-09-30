find_package(EOSIO_CDT REQUIRED)
include(EosioWasmToolchain)

add_subdirectory(eosio.token)

add_executable(whitehole.wasm whitehole.cpp)
target_generate_abi(whitehole.wasm whitehole.abi)

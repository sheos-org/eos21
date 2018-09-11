add_executable(whitehole.wasm
    eosio.token.cpp
    whitehole.cpp
    )
target_abi(whitehole.wasm whitehole.abi)

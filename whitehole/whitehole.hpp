#pragma once

#include "eosio.token/include/eosio.token/eosio.token.hpp"
#include <eosiolib/eosio.hpp>

#include "whitehole.hpp"

class whitehole : public eosio::token {
public:
    whitehole(account_name self);

    /// @abi action
    void hi(account_name user);
};

EOSIO_ABI( whitehole, (hi) )



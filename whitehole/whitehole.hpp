#pragma once

#include "eosio.token/include/eosio.token/eosio.token.hpp"
#include <eosiolib/eosio.hpp>

#include "whitehole.hpp"

class whitehole {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void hi(account_name user);

    private:
    eosio::token mToken;
};

EOSIO_ABI( whitehole, (hi) )



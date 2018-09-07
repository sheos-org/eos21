#pragma once

#include <eosiolib/eosio.hpp>

#include "eosio.token.hpp"

class whitehole {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void hi(account_name user);

    private:
    eosio::token mToken;
};

EOSIO_ABI( whitehole, (hi) )



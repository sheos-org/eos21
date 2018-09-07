#pragma once

#include <eosiolib/eosio.hpp>

#include "eosio.token.hpp"

class whitehole {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void issue( account_name to, eosio::asset quantity, eosio::string memo );

private:
    eosio::token mToken;
};

EOSIO_ABI( whitehole, (issue) )



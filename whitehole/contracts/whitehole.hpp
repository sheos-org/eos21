#pragma once

#include <eosiolib/eosio.hpp>

#include "eosio.token.hpp"

class whitehole {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void create(account_name issuer, eosio::asset maximum_supply);

    [[eosio::action]]
    void issue(account_name to, eosio::asset quantity, eosio::string memo);

    inline bool isCreated() const;

private:
    eosio::token mToken;
    bool mCreated = {false};
};

EOSIO_ABI(whitehole, (issue)(create))

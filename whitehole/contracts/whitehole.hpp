#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <string>

class whitehole : public eosio::contract {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo);
};

EOSIO_ABI(whitehole, (issue))

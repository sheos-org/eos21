#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/singleton.hpp>
#include <string>

class whitehole : public eosio::contract {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void setissuer(account_name tokenAccount);

    [[eosio::action]]
    void issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo);

private:
    struct state
    {
        uint64_t lastId;
        account_name tokenAccount;
    };
    eosio::singleton<N(singleton), state> _state;
};

EOSIO_ABI(whitehole, (issue)(setissuer))

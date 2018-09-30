#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/singleton.hpp>
#include <string>

class whitehole : public eosio::contract {
public:
    whitehole(account_name self);

    [[eosio::action]]
    void issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo);

private:
    eosio::singleton<N(singleton), uint64_t> m_id;
};

EOSIO_ABI(whitehole, (issue))

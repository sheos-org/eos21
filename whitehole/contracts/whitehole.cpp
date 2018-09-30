#include "whitehole.hpp"

#include <eosiolib/print.hpp>

whitehole::whitehole(account_name self):
    contract(self),
    m_id(self, self)
{
    eosio::print("constructor called, owner: ", eosio::name{self});
}

void whitehole::issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo){
    eosio::print("whitehole::issue called");
    require_auth( _self );
}


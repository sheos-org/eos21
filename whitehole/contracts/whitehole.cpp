#include "whitehole.hpp"

whitehole::whitehole(account_name self):
    contract(self)
{

}

void whitehole::issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo){
    require_auth( _self );
}


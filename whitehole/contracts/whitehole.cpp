#include "whitehole.hpp"

whitehole::whitehole(account_name self):
    mToken(self)
{}

void whitehole::create(account_name issuer, eosio::asset maximum_supply)
{
    eosio_assert(!mCreated, "already created" );
    mToken.create(issuer, maximum_supply);
    mCreated = true;
}

void whitehole::issue(account_name to, eosio::asset quantity, eosio::string memo)
{
    mToken.issue(to, quantity, memo);
}

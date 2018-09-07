#include "whitehole.hpp"

whitehole::whitehole(account_name self):
    mToken(self)
{}

void whitehole::issue(account_name to, eosio::asset quantity, eosio::string memo)
{
    mToken.issue(to, quantity, memo);
}

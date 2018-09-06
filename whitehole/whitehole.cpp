#include "whitehole.hpp"

whitehole::whitehole(account_name self):
    eosio::token(self)
{}

void whitehole::hi(account_name user) {
    print( "Hello, ", eosio::name{user} );
}

#include "whitehole.hpp"

whitehole::whitehole(account_name self):
    mToken(self)
{}

void whitehole::hi(account_name user) {
    print( "Hello, ", eosio::name{user} );
}

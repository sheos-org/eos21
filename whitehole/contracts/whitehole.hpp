#pragma once

#include <eosiolib/eosio.hpp>

#include "eosio.token.hpp"

class whitehole : public eosio::token {
public:
    whitehole(account_name self);
};

EOSIO_ABI(whitehole, (issue)(create))

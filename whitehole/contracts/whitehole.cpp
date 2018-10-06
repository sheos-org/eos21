#include "whitehole.hpp"

#include <eosiolib/print.hpp>

whitehole::whitehole(account_name self):
    contract(self),
    _state(self, self)
{
}

void whitehole::setissuer(account_name account)
{
    require_auth(_self);
    eosio_assert(account != _self, "issuer can't be this account");
    auto state = _state.get_or_default();
    eosio_assert(0 == state.tokenAccount, std::string("issuer already set to ").append(eosio::name{state.tokenAccount}.to_string()).c_str());
    state.tokenAccount = account;
    _state.set(state, _self);
}

void whitehole::issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo)
{
    require_auth( _self );
    auto state = _state.get_or_default();
    auto tokenAccount = state.tokenAccount;
    auto nextId = state.lastId + 1;
    eosio_assert(0 != state.tokenAccount, eosio::name{tokenAccount}.to_string().c_str());
    eosio_assert(id == nextId, "wrong id");

    eosio::action(
                eosio::permission_level{_self, N(active)},
                tokenAccount,
                N(issue),
                make_tuple(to, quantity, memo)
                ).send();

    state.lastId = nextId;
    _state.set(state, _self);
}


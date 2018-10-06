#include "whitehole.hpp"

#include <eosiolib/print.hpp>

whitehole::whitehole(account_name self):
    contract(self),
    _state(self, self)
{
    uint64_t initId = 0;
    account_name initTokenAccount = self;
    _state.set({initId, initTokenAccount}, _self);
}

void whitehole::setissuer(account_name tokenAccount)
{
    require_auth(_self);
    auto state = _state.get();
    eosio_assert(_self == state.tokenAccount, "token account already set");
    state.tokenAccount = tokenAccount;
    _state.set(state, _self);
}

void whitehole::issue(uint64_t id, account_name to, eosio::asset quantity, std::string memo)
{
    require_auth( _self );
    auto state = _state.get();
    auto tokenAccount = state.tokenAccount;
    auto nextId = state.lastId + 1;
    eosio_assert(_self != state.tokenAccount, "token account not set");
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


const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const BlackHole = artifacts.require('BlackHole');
const SenseToken = artifacts.require('ElementToken');

contract('BlackHole_SenseTocken', accounts => {
    const name = 'Sense test';
    const symbol = 'SNS';
    const decimals = 8;
    const tokens = 100;

    const genesisBlock = 0;
    const nullAddress = 0x0;
    const note = 'no problems, just solutions';

    let senseToken = null;
    let blackHole = null;
    beforeEach(async () => {
        senseToken = await SenseToken.new(name, symbol, tokens, decimals);
        blackHole = await BlackHole.new(senseToken.address, genesisBlock);
    })

    it('create blackHole with ERC20 contract', async () => {

    })
});


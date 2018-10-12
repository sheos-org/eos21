# EOS21 协议

将您的ERC20代币传送到EOS。

## 概述

EOS21协议可以实现ETH和EOS跨链代币转移。

- .ETH (ERC20) –\&gt; EOS21 –\&gt; EOS (代币)

本协议的目标是为app开发人员提供一个基础标准，来实现跨链操作代币和app。

尽请加入shEOS telegram共同讨论EOS21。同时也诚挚欢迎您为sheos21sheos节点投票。

## 协议基础

- .[EOS.IO](https://github.com/EOSIO/eos) - EOS 区块链
- .[EOSIO.CDT](https://github.com/EOSIO/eosio.cdt) - EOS Contract Development Toolkit

## 必备条件

- .[node.js](https://nodejs.org/) - Javascript 运行环境 (测试版本为 v8.10 和11)
- .[cmake](https://cmake.org/) - 包

## EOS21 概览

We believe that any token should be able to move as the developers desire or require as their apps may be best run on different chains at different times.

我们认为，任何代币都应该能如开发人员预期或要求的方式转移。在不同的链上，不同的时间条件下，app都能跨链运行。

Typically, the way this has been done is by using what we call the &quot;snapshot&quot; method.

通常情况下，实现上述要求我们是借助&quot;快照&quot;模式完成。

In the EOS21 protocol, we are providing another option for ERC20 contracts that do not have a built-in pause/expiry function but who want to move their token to another chain. We are calling this action: teleportation. To teleport a token from one chain to another, it will exist on the destination chain, but no longer exist in a fungible form on the source chain.

在EOS21协议里，我们为没有内置暂停/到期功能且不能满足想要跨链转移代币的用户的ERC20合约提供了另一种方式。我们将此需求称为：teleportation隐形转移。链间转移一个代币，此代币将存在于目的链，但在源链上不再以可替换形式存在。

#### EOS21协议有3个维度

- . **维度**** 1**  是源链，Ethereum。此处有一个Blackhole合约。
- . **维度**** 2** 是 一个Oracle。
- . **维度**** 3**  是目的链，EOS。EOS代币合约将代币分配给由代币持有者在第1层中指定的目的EOS账户。

The standard Blackhole contract has 2 functions - be authorized to receive token Y from Ethereum and then receive the EOS account info the tokens to be distributed on the destination chain via the Oracle.

标准的Blackhole合约有2个功能——授权从Ethereum接收Y个代币，然后接收EOS账户信息，通过Oracle在目的链上分配代币。

Once a user sends their tokens and destination account to the Blackhole, the ERC20 tokens will become non-fungible and the EOS tokens will be teleported to their destination account on the EOS chain.

一旦用户向Blackhole发送他们的代币和目的账户。此部分ERC20代币将变为不可替代的，并且EOS代币将在EOS链上转移到目的账户。

The developer can choose to either send the tokens to a 0X000 address and thereby them, or hold them in the Blackhole contract.

开发人员可以选择将代币发送到0X000地址，也可以将它们保留在Blackhole合约。

##### EOS21 GitHub 详细目录

- . **eos21/eos21.js**  - Oracle 负责管理代币从ETH到EOS转移。
- . **eos21/** [**config.json**](https://github.com/sheos-org/eos21/blob/master/config.json) - blackhole和Oracle合约的配置文件
- . **eos21/blackhole/**** 合约 ****/**  - blackhole合约如下
  - . **sol** - blackhole合约吸收ERC20代币。
  - . **sol** - blackhole 合约将EOS账户作为一个输入来激活代币传输操作。
  - . **sol**  - 将一个EOS公匙作为一个输入激活代币传输操作。（您需要使用修改后的Oracle创建账户）
  - . **sol**  - 用于为测试部署指定 ElementToken.sol
  - . **sol**  - 对ERC20代币的默认ElementToken合约
  - . **sol**  - 确认EOS账户或钥匙
- . **eos21/blackhole/migrations/**  - 部署truffle测试的脚本
- . **eos21/blackhole/test/**  -blackhole的 truffle 测试
- . **eos21/eosio.token/**  - 来自EOS.IO GitHub的标准EOSIO代币合约测试
- . **eos21/utils/**  - 错误检查脚本
- . **eos21/package.json**  - 测试套件的NPM安装包

# 贡献

欢迎阅读 [CONTRIBUTING.md](https://sheos-org.github.io/eos21/CONTRIBUTING.md)

_EOS21 is open-source and we encourage you to customize, fork, and use the code. We built this as a__n_ _example case. Some of the ideas we have include:_

_EOS21代码是开源的，我们鼓励所有人定制、派生和使用代码。我们建立它是作为一个基石。以下是我们的一些想法：_

- ._可以修改EOS21合约，使用注册EOS账户或钥匙来驱动快照分配。_
- ._可以编写EOS21&quot; __teleporter__&quot;或 __&quot;__ racle&quot;，从而完全在EOS链上运行（代替了 __js__ ），并且简化的支付认证过程（SPV）也可完全在链上进行。_
- ._可以修改EOS21合约，在Oracle成功将ETH代币转移至EOS后，通过将此部分ETH代币发送到0x00地址来完成代币燃烧。_
- ._可以修改EOS21合约，允许代币在传送点ETH_ _↔ __EOS间传送，通过使用__&quot; __2-通道__&quot;__代币，锁定代币不再是靠每条链单独的合约。_
- ._EOS21 可以在共享相同私匙的任何一个链上创建公匙。_
- ._EOS21__可以用于验证EOS与ETH交易。_
- ._EOS21 可以用于在EOS __子链__ 间转移代币。_
- ._可以改写EOS21 Blackhole合约，用于支持其它的Ethereum分支链，例如GoChain，和其他支持代币类似于 __Stellar__ 的链。_

# 端到端测试

_For testing, we will use a local Ethereum chain via_ _Ganache and the EOS Jungle Testnet._

_为方便测试，我们将通过 __Ganache_ _和_ _EOS Jungle Testnet__ 来使用本地Ethereum链。_

### 测试概览

_Our scripts automate some of this process, but this is to help you understand what each step is in the process._

_我们的脚本自动化了一些流程，这是为了帮助您理解流程中的每一步。_

1. **Create token on Ethereum.**** 在Ethereum上创建代币。** _Truffle_ _进行此操作。（4个代币将表示为40000，Ethereum合约中有4个小数点。 __——__ 可在_[config.json](https://github.com/sheos-org/eos21/blob/master/config.json)_完成配置__)._
2. **向新Ethereum账户分配新代币。** _Truffle_ _进行此操作。_
3. _ **部署blackhole合约。** __合约地址在truffle配置文件中自动更新。_
4. **在**** Jungle Testnet ****部署标准eosio.token合约。**
5. _ **通过eosio.token合约发行EOS代币。** __参数见_ [config.json](https://github.com/sheos-org/eos21/blob/master/config.json)_中配置。_
6. **在**** js ****服务器上建立**** teleport\_oracle ****。**
7. **源Ethereum账户必须进行2个操作。**

-
  - .授权blackhole转移一定数量的ERC20代币。
  - .发送EOS账户名来激活代币传输。

1. **Oracle将在Ethereum上捕捉事件，并发送代币到第7步中指定的EOS账户。**
2. **关闭blackhole。**

### Ganache / Jungle 测试必备条件

- .[Truffle](https://truffleframework.com/) - npm install -g truffle
- .[Ganache](https://truffleframework.com/ganache) - 点击本地Ethereum区块链。
  - ._Ganache __应该被配置在8545端口上进行本地运行。（您可能需要在__ Ganache__首选项设置或编辑_ [config.json](https://github.com/sheos-org/eos21/blob/master/config.json)匹配端口_）_

### Ganache / Jungle测试准备

- .[在](http://dev.cryptolions.io/#account)[Jungle Testnet. GUI](http://dev.cryptolions.io/#account)[创建](http://dev.cryptolions.io/#account)[EOS](http://dev.cryptolions.io/#account)[账户。](http://dev.cryptolions.io/#account)_这就是我们的_
- .[使用](http://dev.cryptolions.io/#faucet)[Jungle Testnet Faucet GUI](http://dev.cryptolions.io/#faucet)[在您的EOS账户中](http://dev.cryptolions.io/#faucet)[获得EOS。](http://dev.cryptolions.io/#faucet)_Jungle Testnet_ _会给您免费的代币！_
- . **EOS钱包安装**
  - .cleos wallet create --name &quot;\&lt;name of wallet\&gt;&quot; --to-console
- . **导入账户私匙**
  - .cleos wallet import --private-key \&lt;EOS private key\&gt;--name &quot;\&lt;name of wallet\&gt;&quot;
- ._购买RAM来部署EOS代币合约。这需要约300kb的RAM，也就是说用于测试网20EOS应该就足够了。对于主网来说，请根据_[EOS NY&#39;s EOS Resource Planner](https://www.eosrp.io/)_估价。_
  - .cleos -u http://dev.cryptolions.io:38888 system buyram \&lt;EOSTokenCreatorAccount\&gt; \&lt;EOSTokenCreatorAccount\&gt; &quot;20.0000 EOS&quot;

## 步骤1：Ethereum合约的Truffle发展。（ERC20代币+Blackhole）

- . **克隆EOS21 资源库**
  - .git clone https://github.com/sheos-org/eos21.git
  - .mkdir build
  - .cd build
- .\*\*编译blackhole合约\*\*
  - .cmake .. -DEOSIO\_CDT\_ROOT=/usr/local/eosio.cdt &amp;&amp; make
- .\*\*更改目录为根目录\*\*
  - .cd ../../../
- .\*\*安装npm\*\*
  - .npm install
- . \*\*安装truffle基础设施\*\*
  - .npm install -g truffle
- .\*\*编译blackhole合约\*\*
  - .cd blackhole &amp;&amp; truffle compile
- . \*\*测试合约\*\*
  - .truffle test
- .\*\*部署ERC20合约和在 [config.json](https://github.com/sheos-org/eos21/blob/master/config.json)中定义blackhole合约。\*\*
  - .truffle migrate --reset --network ganache
  - ._进程还将把你新创建的ERC20代币发送到你在 __Ganache__ 界面的第一个账户。_

## 步骤2：部署Oracle

- .\*\*从EOS21 项目的根文件开始oracle\*\*
  - ._打开另一个窗口 __——__ 或者更好在窗口展示命令。_
  - .node ./eos21.js

## 步骤3：部署EOS代币合约

- .\*\*部署标准EOSIO.token合约\*\*
  - .cleos -u http://dev.cryptolions.io:38888 set contract \&lt;EOSTokenCreatorAccount\&gt; ./eosio.token
- ._\*\*通过eosio.token合约分发自定义的EOS代币，你可能需要解锁钱包首先。\*\*_ cleos -u http://dev.cryptolions.io:38888 push action \&lt;EOSTokenCreatorAccount\&gt; create &#39;[&quot;\&lt;EOSTokenCreatorAccount\&gt;&quot;,&quot;4.0000 \&lt;EOSTokenName\&gt;&quot;]&#39; -p \&lt;EOSTokenCreatorAccount\&gt;@active

## 步骤4：代币传输测试

- .\*\*进入ganache控制台\*\*
  - .truffle console --network ganache
- .\*\*获取ERC代币合约地址\*\*
  - .ERC20Token.deployed().then(i =\&gt; erc20=i)
  - ._在上述命令的结果中搜索，您将在 __&quot;__ from&quot;字段中获得ERC20代币的公匙。注意到这一点，您将在1分钟内需要它。 __0x52…__ 将会是步骤2中的 __ERC20PublicKey__ 。_
  - . **ERC20PublicKey**  **例如：** class\_defaults: { from: &#39;0x52410180254b53a0816e77082ec0578d7a141c5c&#39;,
- .\*\*使用Blackhole 合约\*\*
  - .BlackHoleEosAccount.deployed().then(i =\&gt; blackhole=i)
- .\*\*向Blackhole发送批准吸收代币\*\*
  - .erc20.approve(blackhole.address, 40000, {from:&#39;\&lt;ERC20PublicKey\&gt;&#39;})
  - ._这是 __0x52…__ 地址，上面的例子中的地址。您的地址会是不同的。_
- .\*\*输入目的EOS账户地址进行代币转移\*\*
  - .blackhole.teleport(&quot;\&lt;DestinationEOSAccount\&gt;&quot;)
  - ._您应该在您的oracle控制界面时刻查看账户活动。_
- .\*\*在目的EOS账户中检查自定义EOS代币余额\*\*
  - .cleos -u http://dev.cryptolions.io:38888 get table \&lt;EOSTokenCreatorAccount\&gt; \&lt;DestinationEOSAccount\&gt; accounts

### 您的测试代币已经被成功转移！

# 主网部署

## 特殊说明！

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

本软件是基于&quot;现状&quot;提供的，没有对包括但不仅限于，可销性、特定目的适用性和非侵权性的任何形式的担保承诺、明示或暗示。在任何情况下，无论是在合约、侵权行为或其他方面，有软件或软件使用引起的索赔、损害或其他责任，作者或版权所有者都不承担责任。

#### _ **我们强烈的建议首先使用上面列出的** __**Ganache / Jungle**__ **指南进行测试。** _

#### 测试准备

- .你必须在Ethereum主网上部署ERC20代币，获得钥匙能够允许将EOS代币传送到oracle运行的钱包。
- .在[config.json](https://github.com/sheos-org/eos21/blob/master/config.json)配置blackhole 和 eosiotoken部分到您的代币参数
  - .websocket\_provider 将指向 Ethereum 节点 - 在主网上使用wss://mainnet.infura.io/ws
  - .critic\_block 将是您想要到期blackhole合约在Ethereum上的块编号，如果它未到期，则将其设置为0。
  - .decimals symbol 和 tokens 是您在ERC20代币合约中定义的小数点，ERC20代币的表示符号，在ERC20合约中的最大代币数额。
  - .chain\_id 是EOS链的ID - EOS主网的将是aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906
  - .http\_endpoint 指向一个EOS API节点
  - .account 是具备您分发EOS代币地址权限的账户
  - .private\_key 私匙是代表传输EOS代币的权利。
- .在Ethereum主网上安装eos21/blackhole/contracts/BlackHoleEosAccount.sol orblackhole/contracts/BlackHoleEosPublicKey.sol
- .开始Oracle
- ._从一个包含您想要传送的代币的Ethereum账户中，授权blackhole从您的账户中吸收代币，然后将您的EOS账户名称发送到合约 __&quot;__ 传送点 __&quot;__ 触发代币转移操作。通过非常好的UX/UI设计，可以是这个过程变得非常简单。_

# 人员简介

## 作者

- . **Ben Sigman**  - 基础_架构、测试、文档_ - [bensig](https://github.com/bensig)
- . **Alessandro Siniscalchi**  - _C++/js heavy lifting_ [asiniscalchi](https://github.com/asiniscalchi)

## 贡献者

- . **Angel Jose**  - _js_ _指导_ [ajose01](https://github.com/ajose01)
- . **Vladimir Venediktov**  - _js/C++_ _指导_ [venediktov](https://github.com/venediktov)

## 特别鸣谢

[Cryptolions](https://cryptolions.io/) - _为了让 __Jungle Testnet__ 保持活跃！并且还有很棒的__Jungle Testnet_ _T恤。_

[Brock Pierce](https://twitter.com/brockpierce) - 特别感谢您为协议命名——EOS21.

[Crystal Rose](https://twitter.com/crystalrose) - 特别感谢您诞生了这个协议的想法，和您的鼎力支持。_._

感谢EOS Nation的Lena的翻译。PotatoheadYa on WeChat.

# 许可证

This project is licensed under the MIT License - see the [LICENSE.md](https://sheos-org.github.io/eos21/LICENSE.md) file for details

本项目获得 MIT许可——查看详细细节[LICENSE.md](https://sheos-org.github.io/eos21/LICENSE.md)

[**eos21**](https://github.com/sheos-org/eos21) ** is maintained by ** [**sheos-org**](https://github.com/sheos-org) **.** This page was generated by [GitHub Pages](https://pages.github.com/).

[**eos21**](https://github.com/sheos-org/eos21) ** **** 由**[**sheos-org**](https://github.com/sheos-org)**维护 ****.**

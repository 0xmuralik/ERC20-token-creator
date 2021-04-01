var TokenSale = artifacts.require("./TokenSale.sol");
var Token = artifacts.require("./Token.sol");

contract("TokenSale",function(accounts){
    var buyer = accounts[5];
    var admin =accounts[0];
    var tokenPrice=1000000000000000;
    var tokensForSale=5000;

    before(async () => {
        this.tokenSale = await TokenSale.deployed();
        this.token= await Token.deployed();
    })

    it('deploys successfully', async () => {
        const address = await this.tokenSale.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

    it("Intialized values correctly",async()=>{
        var tokenContract =await this.tokenSale.tokenContract.call();
        assert.equal(token.address,tokenContract,"Token instance matched");

        var price= await this.tokenSale.tokenPrice() 
        assert.equal(price.toNumber(),tokenPrice,"Price");
    })

    it("Add tokens to sale",async()=>{
        try{
            var result = await this.tokenSale.addTokensToSale(tokensForSale,{from:buyer})
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'must be admin to add tokens');
        }

        try{
            var result = await this.tokenSale.addTokensToSale(20000,{from:admin})
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'Insufficient tokens in admin wallet');
        }

        var result = await this.tokenSale.addTokensToSale(tokensForSale,{from:admin})
        var number= await this.token.balanceOf(this.tokenSale.address);
        assert.equal(number,tokensForSale,"Contract Balance Equal to number of tokens for sale");
    })

    it("Purchase of Tokens",async()=>{
        var intialBalance = await this.token.balanceOf(this.tokenSale.address);

        try{
            var result = await this.tokenSale.buyTokens(6000,{from: buyer,value: 6000*tokenPrice});
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'not enough tokens available');
        }

        try{
            var result = await this.tokenSale.buyTokens(200,{from: buyer,value: 100*tokenPrice});

        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'Insufficient value');
        }
        
       
        var result = await this.tokenSale.buyTokens(200,{from: buyer,value: 200*tokenPrice});
        var event = result.logs[0].args;
        
        assert.equal(result.logs[0].event,'Sell',"Emits Sell event");
        assert.equal(event._buyer,buyer,"buyer");
        assert.equal(event._tokens.toNumber(),200,"number of tokens");
        
        var recentBalance = await this.token.balanceOf(this.tokenSale.address);
        assert.equal(intialBalance.toNumber()-recentBalance.toNumber(),200,"Tokens sent to buyer")

        var tokensSold = await this.tokenSale.tokensSold();
        assert.equal(tokensSold.toNumber(),200,"Incremented tokensSold");
    })

    it("Ending Sale",async()=>{
        try{
            var result = await this.tokenSale.endSale({from:buyer});    
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'must be admin to end sale');  
        }
        
        var result = await this.tokenSale.endSale({from:admin});
        var balanceOfSale = await this.token.balanceOf(this.tokenSale.address);
        assert.equal(balanceOfSale.toNumber(),0,"Tokens sent back to admin");

        var balance = await web3.eth.getBalance(this.tokenSale.address)
        assert.equal(balance,0,"Ether transfered to admin")
    })
});
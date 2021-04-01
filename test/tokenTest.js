var Token = artifacts.require("./Token.sol");

contract('Token', function(accounts){
    
    before(async () => {
        this.token = await Token.deployed()
    })
    
    it('deploys successfully', async () => {
        const address = await this.token.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

    it("intializes contract with correct values",async()=>{
        var tokenName=await token.tokenName();
        var tokenSymbol=await token.tokenSymbol();
        var decimals=await token.decimals();
        var totalSupply=await token.totalSupply();

        assert.equal(tokenName,"I Don't Count","token name");
        assert.equal(tokenSymbol,"IDC","token symbol");
        assert.equal(decimals.toNumber(),8,"decimals");
        assert.equal(totalSupply.toNumber(),1000,"total supply");
    })

    it("allocates intial supply upon deployement",async()=>{
        var balanceOwner= await token.balanceOf(accounts[0]);
        
        assert.equal(balanceOwner.toNumber(),1000);
    })

    it("transfers token ownership",async()=>{
        try{
            var result= await token.transfer(accounts[0],accounts[1],1000000);
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'not enough balance');
        }
        


        var success= await this.token.transfer.call(accounts[0],accounts[1],2);
        
        assert.equal(success,true,"Transfer success");


        var result= await this.token.transfer(accounts[0],accounts[1],2);
        var event = result.logs[0].args;
        
        assert.equal(result.logs[0].event,'Transfer',"Emits Transfer event");
        assert.equal(event._from,accounts[0],"transfered from");
        assert.equal(event._to,accounts[1],"transfered to");
        assert.equal(event._value.toNumber(),2,"value");
        

        var balanceOwner= await token.balanceOf(accounts[0]);
        var balanceRecepient = await this.token.balanceOf(accounts[1]);

        assert.equal(balanceOwner.toNumber(),998,"Deducted from owner");
        assert.equal(balanceRecepient.toNumber(),2,"Added to recepient");
    })

    it("Approves tokens for delegated transfer", async()=>{
        var success = await this.token.approve.call(accounts[1],5,{from : accounts[0]});

        assert.equal(success,true,"approve success");

        var result= await this.token.approve(accounts[1],5,{from: accounts[0]});
        var event = result.logs[0].args;
        
        assert.equal(result.logs[0].event,'Approval',"Emits Transfer event");
        assert.equal(event._owner,accounts[0],"owner account");
        assert.equal(event._spender,accounts[1],"spender account");
        assert.equal(event._value.toNumber(),5,"value");

        var allowance = await this.token.allowance(accounts[0],accounts[1]);

        assert.equal(allowance.toNumber(),5,"Allowance allotted");

    })

    it("handles delegated token transfers",async()=>{
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];

        var transferResult = await this.token.transfer(accounts[0],fromAccount,10);
        var approveResult = await this.token.approve(spendingAccount,5,{from: fromAccount});
        try{
            var transferFromResult = await this.token.transferFrom(fromAccount,toAccount,100000,{from: spendingAccount});
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'not enough balance');
        }
        
        try{
            var transferFromResult = await this.token.transferFrom(fromAccount,toAccount,7,{from: spendingAccount});
        }catch(error){
            assert(error.message.indexOf('revert') >= 0, 'not enough allowance');
        }
        
        var transferFromSuccess = await this.token.transferFrom.call(fromAccount,toAccount,3,{from: spendingAccount});
        assert.equal(transferFromSuccess,true,"delegated successfully");

        var transferFromResult = await this.token.transferFrom(fromAccount,toAccount,3,{from: spendingAccount});
        var event = transferFromResult.logs[0].args;

        assert.equal(transferFromResult.logs[0].event,"Transfer","Emits Transfer Event");
        assert.equal(event._from,fromAccount,"transfered from");
        assert.equal(event._to,toAccount,"transfered to");
        assert.equal(event._value.toNumber(),3,"value");

        var balanceOf = await this.token.balanceOf(fromAccount);
        assert.equal(balanceOf.toNumber(),7,"deducted from fromAccount(accounts[2])");

        var balanceOf = await this.token.balanceOf(toAccount);
        assert.equal(balanceOf.toNumber(),3,"deducted from toAccount(accounts[3])");

        var allowance = await this.token.allowance(fromAccount,spendingAccount);
        assert.equal(allowance.toNumber(),2,"dedcuted allowance");
    })
});
var Token = artifacts.require("Token");
var TokenSale = artifacts.require("TokenSale");

module.exports = function(deployer){

    var tokenName="I Don't Count";
    var tokenSymbol="IDC";
    var decimals=8;
    var tokenSupply=10000;

    deployer.deploy(Token,tokenName,tokenSymbol,decimals,tokenSupply).then(function(){

        var tokenPrice=100000000;
        var tokensForSale=5000;
        
        return deployer.deploy(TokenSale,Token.address,tokenPrice,tokensForSale);
    });
    
}